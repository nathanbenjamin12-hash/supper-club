import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";
import { dirname, join } from "path";
import { mockBundles, starterChecklistTemplates } from "@/data/mockEvents";
import type {
  ChecklistCategory,
  ChecklistItem,
  ChecklistItemDraft,
  DinnerEvent,
  EventBundle,
  EventDraft,
  EventType,
  Guest,
  GuestDraft
} from "@/types/events";
import { normalizeVenmoHandle } from "@/lib/utils";

export const EVENT_STORE_KEY = "supperclub.events.v1";
const FILE_STORE_PATH =
  process.env.SUPPER_CLUB_EVENT_STORE_PATH ??
  join(/*turbopackIgnore: true*/ process.cwd(), ".data", "events.json");
export const EVENT_STORE_PERSISTENCE_ERROR_MESSAGE =
  "Supper Club event persistence requires KV_REST_API_URL and KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, in production.";

type StoreGlobal = typeof globalThis & {
  __supperClubEventBundles?: EventBundle[];
  __supperClubEventWriteQueue?: Promise<void>;
};

type MutationResult<T> = {
  bundles: EventBundle[];
  result: T;
};

const storeGlobal = globalThis as StoreGlobal;

export class EventStorePersistenceError extends Error {
  constructor(message = EVENT_STORE_PERSISTENCE_ERROR_MESSAGE) {
    super(message);
    this.name = "EventStorePersistenceError";
  }
}

export function isEventStorePersistenceError(error: unknown) {
  return error instanceof EventStorePersistenceError;
}

function now() {
  return new Date().toISOString();
}

function makeServerId(prefix = "id") {
  return `${prefix}-${randomUUID()}`;
}

function cloneBundle(bundle: EventBundle): EventBundle {
  return {
    event: {
      ...bundle.event,
      venmoHandle: bundle.event.venmoHandle ?? normalizeVenmoHandle(bundle.event.venmoUrl)
    },
    guests: bundle.guests.map((guest) => ({ ...guest })),
    checklistItems: bundle.checklistItems.map((item) => ({
      ...item,
      itemType: item.itemType ?? "bring",
      moneyClaims: item.moneyClaims?.map((claim) => ({ ...claim }))
    }))
  };
}

function cloneBundles(bundles: EventBundle[]) {
  return bundles.map(cloneBundle);
}

function hasKvStore() {
  return Boolean(getKvUrl() && getKvToken());
}

function getKvUrl() {
  return process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
}

function getKvToken() {
  return process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
}

export function getEventStoreLogContext() {
  const urlEnv = process.env.KV_REST_API_URL
    ? "KV_REST_API_URL"
    : process.env.UPSTASH_REDIS_REST_URL
      ? "UPSTASH_REDIS_REST_URL"
      : "missing";
  const tokenEnv = process.env.KV_REST_API_TOKEN
    ? "KV_REST_API_TOKEN"
    : process.env.UPSTASH_REDIS_REST_TOKEN
      ? "UPSTASH_REDIS_REST_TOKEN"
      : "missing";

  return {
    storeKey: EVENT_STORE_KEY,
    backend: hasKvStore() ? "redis" : "local-file",
    urlEnv,
    tokenEnv,
    fileStorePath: hasKvStore() ? undefined : FILE_STORE_PATH
  };
}

function requiresDurableStore() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

function assertProductionStoreConfigured() {
  if (requiresDurableStore() && !hasKvStore()) {
    throw new EventStorePersistenceError();
  }
}

async function kvCommand<T>(command: unknown[]) {
  const url = getKvUrl();
  const token = getKvToken();

  if (!url || !token) {
    throw new EventStorePersistenceError();
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new EventStorePersistenceError(`KV event persistence command failed with ${response.status}.`);
  }

  return (await response.json()) as { result: T };
}

async function readPersistedBundles() {
  assertProductionStoreConfigured();

  if (hasKvStore()) {
    const response = await kvCommand<string | null>(["GET", EVENT_STORE_KEY]);
    return response?.result ? (JSON.parse(response.result) as EventBundle[]) : undefined;
  }

  if (!existsSync(FILE_STORE_PATH)) {
    return undefined;
  }

  return JSON.parse(readFileSync(FILE_STORE_PATH, "utf8")) as EventBundle[];
}

async function writePersistedBundles(bundles: EventBundle[]) {
  const serialized = JSON.stringify(bundles);
  assertProductionStoreConfigured();

  if (hasKvStore()) {
    await kvCommand(["SET", EVENT_STORE_KEY, serialized]);
    return;
  }

  mkdirSync(dirname(FILE_STORE_PATH), { recursive: true });
  writeFileSync(FILE_STORE_PATH, serialized);
}

async function readBundles() {
  assertProductionStoreConfigured();

  if (hasKvStore()) {
    const stored = await readPersistedBundles();
    const bundles = stored ? cloneBundles(stored) : cloneBundles(mockBundles);

    if (!stored) {
      await writePersistedBundles(bundles);
    }

    storeGlobal.__supperClubEventBundles = bundles;
    return cloneBundles(bundles);
  }

  if (storeGlobal.__supperClubEventBundles) {
    return cloneBundles(storeGlobal.__supperClubEventBundles);
  }

  const stored = await readPersistedBundles();
  const bundles = stored ? cloneBundles(stored) : cloneBundles(mockBundles);

  storeGlobal.__supperClubEventBundles = bundles;

  if (!stored) {
    await writePersistedBundles(bundles);
  }

  return cloneBundles(bundles);
}

async function writeBundles(bundles: EventBundle[]) {
  const cloned = cloneBundles(bundles);
  storeGlobal.__supperClubEventBundles = cloned;
  await writePersistedBundles(cloned);
}

async function withBundles<T>(mutator: (bundles: EventBundle[]) => Promise<MutationResult<T>> | MutationResult<T>) {
  const previous = storeGlobal.__supperClubEventWriteQueue ?? Promise.resolve();
  let runResult: T;

  const run = previous.then(async () => {
    const bundles = await readBundles();
    const { bundles: nextBundles, result } = await mutator(bundles);
    await writeBundles(nextBundles);
    runResult = result;
  });

  storeGlobal.__supperClubEventWriteQueue = run.then(() => undefined, () => undefined);
  await run;

  return runResult!;
}

export async function getStoredEventBundle(eventId: string) {
  const bundles = await readBundles();
  return bundles.find((bundle) => bundle.event.id === eventId);
}

export async function importStoredEventBundle(bundle: EventBundle) {
  return withBundles((bundles) => {
    const migrated = cloneBundle(bundle);
    const existing = bundles.find((candidate) => candidate.event.id === migrated.event.id);

    if (existing) {
      return { bundles, result: existing };
    }

    const nextBundles = [migrated, ...bundles];
    return { bundles: nextBundles, result: migrated };
  });
}

export async function createStoredEvent(data: EventDraft, starterItems: ChecklistItemDraft[] = []) {
  const timestamp = now();
  const event: DinnerEvent = {
    ...data,
    id: makeServerId("event"),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const checklistItems =
    data.eventType === "custom"
      ? createChecklistFromDrafts(event.id, starterItems)
      : [...createChecklistFromTemplate(event.id, data.eventType), ...createChecklistFromDrafts(event.id, starterItems)];
  const bundle: EventBundle = {
    event,
    guests: [],
    checklistItems
  };

  return withBundles((bundles) => ({
    bundles: [bundle, ...bundles],
    result: bundle
  }));
}

export async function updateStoredEvent(eventId: string, data: EventDraft) {
  return withBundles((bundles) => {
    let updatedEvent: DinnerEvent | undefined;
    const nextBundles = bundles.map((bundle) => {
      if (bundle.event.id !== eventId) {
        return bundle;
      }

      updatedEvent = {
        ...bundle.event,
        ...data,
        updatedAt: now()
      };

      return {
        ...bundle,
        event: updatedEvent
      };
    });

    return { bundles: nextBundles, result: updatedEvent };
  });
}

export async function createStoredGuest(eventId: string, data: GuestDraft) {
  const timestamp = now();
  const guest: Guest = {
    ...data,
    id: makeServerId("guest"),
    eventId,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return withBundles((bundles) => {
    let createdGuest: Guest | undefined;
    const nextBundles = bundles.map((bundle) => {
      if (bundle.event.id !== eventId) {
        return bundle;
      }

      createdGuest = guest;

      return {
        ...bundle,
        guests: [...bundle.guests, guest],
        event: { ...bundle.event, updatedAt: timestamp }
      };
    });

    return { bundles: nextBundles, result: createdGuest };
  });
}

export async function claimStoredChecklistItem(eventId: string, itemId: string, guestId: string, note?: string) {
  return withBundles((bundles) => {
    let updatedItem: ChecklistItem | undefined;

    const nextBundles = bundles.map((bundle) => {
      if (bundle.event.id !== eventId) {
        return bundle;
      }

      const guest = bundle.guests.find((candidate) => candidate.id === guestId);
      const item = bundle.checklistItems.find((candidate) => candidate.id === itemId);

      if (!guest || !item) {
        return bundle;
      }

      if ((item.itemType ?? "bring") === "money") {
        const existingClaims = item.moneyClaims ?? [];
        const existingGuestClaim = existingClaims.find((claim) => claim.guestId === guest.id);
        const totalSpots = item.totalSpots ?? 1;

        if (existingGuestClaim || existingClaims.length >= totalSpots) {
          updatedItem = item;
          return bundle;
        }

        const timestamp = now();
        const checklistItems = bundle.checklistItems.map((candidate) => {
          if (candidate.id !== itemId) {
            return candidate;
          }

          updatedItem = {
            ...candidate,
            moneyClaims: [
              ...(candidate.moneyClaims ?? []),
              {
                guestId: guest.id,
                guestName: guest.name,
                note: note?.trim() || undefined,
                createdAt: timestamp
              }
            ],
            updatedAt: timestamp
          };

          return updatedItem;
        });

        return {
          ...bundle,
          checklistItems,
          event: { ...bundle.event, updatedAt: timestamp }
        };
      }

      if (item.claimedByGuestId && item.claimedByGuestId !== guestId) {
        updatedItem = item;
        return bundle;
      }

      const timestamp = now();
      const checklistItems = bundle.checklistItems.map((candidate) => {
        if (candidate.id !== itemId) {
          return candidate;
        }

        updatedItem = {
          ...candidate,
          claimedByGuestId: guest.id,
          claimedByName: guest.name,
          claimNote: note?.trim() || undefined,
          updatedAt: timestamp
        };

        return updatedItem;
      });

      return {
        ...bundle,
        checklistItems,
        event: { ...bundle.event, updatedAt: timestamp }
      };
    });

    return { bundles: nextBundles, result: updatedItem };
  });
}

export async function releaseStoredChecklistItemClaim(eventId: string, itemId: string, guestId: string) {
  return withBundles((bundles) => {
    let updatedItem: ChecklistItem | undefined;

    const nextBundles = bundles.map((bundle) => {
      if (bundle.event.id !== eventId) {
        return bundle;
      }

      const item = bundle.checklistItems.find((candidate) => candidate.id === itemId);

      if (!item) {
        return bundle;
      }

      if ((item.itemType ?? "bring") === "money") {
        const existingClaims = item.moneyClaims ?? [];
        const guestClaimExists = existingClaims.some((claim) => claim.guestId === guestId);

        if (!guestClaimExists) {
          updatedItem = item;
          return bundle;
        }

        const timestamp = now();
        const checklistItems = bundle.checklistItems.map((candidate) => {
          if (candidate.id !== itemId) {
            return candidate;
          }

          updatedItem = {
            ...candidate,
            moneyClaims: (candidate.moneyClaims ?? []).filter((claim) => claim.guestId !== guestId),
            updatedAt: timestamp
          };

          return updatedItem;
        });

        return {
          ...bundle,
          checklistItems,
          event: { ...bundle.event, updatedAt: timestamp }
        };
      }

      if (item.claimedByGuestId !== guestId) {
        updatedItem = item;
        return bundle;
      }

      const timestamp = now();
      const checklistItems = bundle.checklistItems.map((candidate) => {
        if (candidate.id !== itemId) {
          return candidate;
        }

        updatedItem = {
          ...candidate,
          claimedByGuestId: undefined,
          claimedByName: undefined,
          claimNote: undefined,
          updatedAt: timestamp
        };

        return updatedItem;
      });

      return {
        ...bundle,
        checklistItems,
        event: { ...bundle.event, updatedAt: timestamp }
      };
    });

    return { bundles: nextBundles, result: updatedItem };
  });
}

export async function addStoredChecklistItem(eventId: string, data: ChecklistItemDraft) {
  const timestamp = now();
  const item: ChecklistItem = {
    ...data,
    id: makeServerId("item"),
    eventId,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return withBundles((bundles) => {
    let addedItem: ChecklistItem | undefined;
    const nextBundles = bundles.map((bundle) => {
      if (bundle.event.id !== eventId) {
        return bundle;
      }

      addedItem = item;

      return {
        ...bundle,
        checklistItems: [...bundle.checklistItems, item],
        event: { ...bundle.event, updatedAt: timestamp }
      };
    });

    return { bundles: nextBundles, result: addedItem };
  });
}

export async function updateStoredChecklistItem(eventId: string, itemId: string, data: ChecklistItemDraft) {
  const timestamp = now();

  return withBundles((bundles) => {
    let updatedItem: ChecklistItem | undefined;
    const nextBundles = bundles.map((bundle) => {
      if (bundle.event.id !== eventId) {
        return bundle;
      }

      const checklistItems = bundle.checklistItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const nextItem: ChecklistItem = {
          ...item,
          ...data,
          updatedAt: timestamp
        };

        updatedItem =
          data.itemType === "money"
            ? {
                ...nextItem,
                claimedByGuestId: undefined,
                claimedByName: undefined,
                claimNote: undefined,
                quantity: undefined,
                moneyClaims: nextItem.moneyClaims ?? item.moneyClaims ?? []
              }
            : {
                ...nextItem,
                amountPerPerson: undefined,
                totalSpots: undefined,
                moneyClaims: undefined
              };

        return updatedItem;
      });

      return {
        ...bundle,
        checklistItems,
        event: updatedItem ? { ...bundle.event, updatedAt: timestamp } : bundle.event
      };
    });

    return { bundles: nextBundles, result: updatedItem };
  });
}

export async function deleteStoredChecklistItem(eventId: string, itemId: string) {
  const timestamp = now();

  return withBundles((bundles) => {
    let deleted = false;
    const nextBundles = bundles.map((bundle) => {
      if (bundle.event.id !== eventId) {
        return bundle;
      }

      const checklistItems = bundle.checklistItems.filter((item) => {
        if (item.id === itemId) {
          deleted = true;
          return false;
        }

        return true;
      });

      return {
        ...bundle,
        checklistItems,
        event: deleted ? { ...bundle.event, updatedAt: timestamp } : bundle.event
      };
    });

    return { bundles: nextBundles, result: deleted };
  });
}

function createChecklistFromTemplate(eventId: string, eventType: EventType) {
  const template = starterChecklistTemplates[eventType];
  const timestamp = now();
  const items: ChecklistItem[] = [];

  Object.entries(template).forEach(([category, titles]) => {
    titles?.forEach((title) => {
      items.push({
        id: makeServerId("item"),
        eventId,
        category: category as ChecklistCategory,
        title,
        itemType: "bring",
        isRequired: true,
        createdAt: timestamp,
        updatedAt: timestamp
      });
    });
  });

  return items;
}

function createChecklistFromDrafts(eventId: string, drafts: ChecklistItemDraft[]) {
  const timestamp = now();

  return drafts.map((draft) => ({
    ...draft,
    itemType: draft.itemType ?? "bring",
    id: makeServerId("item"),
    eventId,
    createdAt: timestamp,
    updatedAt: timestamp
  }));
}
