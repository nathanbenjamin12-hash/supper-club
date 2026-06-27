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
import { makeId, normalizeVenmoHandle } from "@/lib/utils";

const STORAGE_KEY = "supperclub.events.v1";
const LEGACY_STORAGE_KEY = "bringboard.events.v1";

function now() {
  return new Date().toISOString();
}

function browserAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneBundles(bundles: EventBundle[]) {
  return bundles.map(migrateBundle);
}

function migrateBundle(bundle: EventBundle): EventBundle {
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

function readBundles(): EventBundle[] {
  if (!browserAvailable()) {
    return cloneBundles(mockBundles);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  const legacyStored = window.localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!stored) {
    if (legacyStored) {
      try {
        const migrated = (JSON.parse(legacyStored) as EventBundle[]).map(migrateBundle);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      } catch {
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }

    const seeded = cloneBundles(mockBundles);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return (JSON.parse(stored) as EventBundle[]).map(migrateBundle);
  } catch {
    const seeded = cloneBundles(mockBundles);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function writeBundles(bundles: EventBundle[]) {
  if (!browserAvailable()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundles));
}

function withBundle(
  eventId: string,
  updater: (bundle: EventBundle, bundles: EventBundle[]) => EventBundle
) {
  const bundles = readBundles();
  const index = bundles.findIndex((bundle) => bundle.event.id === eventId);

  if (index === -1) {
    return undefined;
  }

  bundles[index] = updater(bundles[index], bundles);
  writeBundles(bundles);
  return bundles[index];
}

export function getEvents() {
  return readBundles().map((bundle) => bundle.event);
}

export function getEvent(eventId: string) {
  return readBundles().find((bundle) => bundle.event.id === eventId)?.event;
}

export function getEventBundle(eventId: string) {
  return readBundles().find((bundle) => bundle.event.id === eventId);
}

export function importEventBundle(bundle: EventBundle) {
  const migrated = migrateBundle(bundle);
  const bundles = readBundles();
  const existing = bundles.find((candidate) => candidate.event.id === migrated.event.id);

  if (existing) {
    return existing;
  }

  writeBundles([migrated, ...bundles]);

  return migrated;
}

export function createEvent(data: EventDraft, starterItems: ChecklistItemDraft[] = []) {
  const timestamp = now();
  const event: DinnerEvent = {
    ...data,
    id: makeId("event"),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const checklistItems =
    data.eventType === "custom"
      ? createChecklistFromDrafts(event.id, starterItems)
      : [...createChecklistFromTemplate(event.id, data.eventType), ...createChecklistFromDrafts(event.id, starterItems)];
  const bundles = readBundles();
  bundles.unshift({
    event,
    guests: [],
    checklistItems
  });
  writeBundles(bundles);

  return event;
}

export function updateEvent(eventId: string, data: EventDraft) {
  const updated = withBundle(eventId, (bundle) => ({
    ...bundle,
    event: {
      ...bundle.event,
      ...data,
      updatedAt: now()
    }
  }));

  return updated?.event;
}

export function createGuest(eventId: string, data: GuestDraft) {
  const timestamp = now();
  const guest: Guest = {
    ...data,
    id: makeId("guest"),
    eventId,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  withBundle(eventId, (bundle) => ({
    ...bundle,
    guests: [...bundle.guests, guest],
    event: { ...bundle.event, updatedAt: timestamp }
  }));

  return guest;
}

export function updateGuest(eventId: string, guestId: string, data: GuestDraft) {
  const timestamp = now();
  let updatedGuest: Guest | undefined;

  withBundle(eventId, (bundle) => {
    const guests = bundle.guests.map((guest) => {
      if (guest.id !== guestId) {
        return guest;
      }

      updatedGuest = {
        ...guest,
        ...data,
        updatedAt: timestamp
      };

      return updatedGuest;
    });

    return {
      ...bundle,
      guests,
      event: updatedGuest ? { ...bundle.event, updatedAt: timestamp } : bundle.event
    };
  });

  return updatedGuest;
}

export function claimChecklistItem(itemId: string, guestId: string, note?: string) {
  const bundles = readBundles();
  let updatedItem: ChecklistItem | undefined;

  const nextBundles = bundles.map((bundle) => {
    const guest = bundle.guests.find((candidate) => candidate.id === guestId);
    const item = bundle.checklistItems.find((candidate) => candidate.id === itemId);

    if (!guest || !item) {
      return bundle;
    }

    if (item.itemType === "money") {
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

  writeBundles(nextBundles);
  return updatedItem;
}

export function releaseChecklistItemClaim(itemId: string, guestId: string) {
  const bundles = readBundles();
  let updatedItem: ChecklistItem | undefined;

  const nextBundles = bundles.map((bundle) => {
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

  writeBundles(nextBundles);
  return updatedItem;
}

export function addChecklistItem(eventId: string, data: ChecklistItemDraft) {
  const timestamp = now();
  const item: ChecklistItem = {
    ...data,
    id: makeId("item"),
    eventId,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  withBundle(eventId, (bundle) => ({
    ...bundle,
    checklistItems: [...bundle.checklistItems, item],
    event: { ...bundle.event, updatedAt: timestamp }
  }));

  return item;
}

export function updateChecklistItem(itemId: string, data: ChecklistItemDraft) {
  const bundles = readBundles();
  let updatedItem: ChecklistItem | undefined;
  const timestamp = now();

  const nextBundles = bundles.map((bundle) => {
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
      event:
        updatedItem && updatedItem.eventId === bundle.event.id
          ? { ...bundle.event, updatedAt: timestamp }
          : bundle.event
    };
  });

  writeBundles(nextBundles);
  return updatedItem;
}

export function deleteChecklistItem(itemId: string) {
  const bundles = readBundles();
  let deleted = false;
  const timestamp = now();

  const nextBundles = bundles.map((bundle) => {
    let bundleDeleted = false;
    const checklistItems = bundle.checklistItems.filter((item) => {
      if (item.id === itemId) {
        deleted = true;
        bundleDeleted = true;
        return false;
      }

      return true;
    });

    return {
      ...bundle,
      checklistItems,
      event: bundleDeleted ? { ...bundle.event, updatedAt: timestamp } : bundle.event
    };
  });

  writeBundles(nextBundles);
  return deleted;
}

export function createChecklistFromTemplate(eventId: string, eventType: EventType) {
  const template = starterChecklistTemplates[eventType];
  const timestamp = now();
  const items: ChecklistItem[] = [];

  Object.entries(template).forEach(([category, titles]) => {
    titles?.forEach((title) => {
      items.push({
        id: makeId("item"),
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
    id: makeId("item"),
    eventId,
    createdAt: timestamp,
    updatedAt: timestamp
  }));
}

// TODO: Add real host authentication before production. The MVP host route is only link-based.
