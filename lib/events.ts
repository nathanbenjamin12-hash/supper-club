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
import { makeId } from "@/lib/utils";

const STORAGE_KEY = "supperclub.events.v1";
const LEGACY_STORAGE_KEY = "bringboard.events.v1";

function now() {
  return new Date().toISOString();
}

function browserAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneBundles(bundles: EventBundle[]) {
  return bundles.map((bundle) => ({
    event: { ...bundle.event },
    guests: bundle.guests.map((guest) => ({ ...guest })),
    checklistItems: bundle.checklistItems.map((item) => ({ ...item }))
  }));
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
        const migrated = JSON.parse(legacyStored) as EventBundle[];
        window.localStorage.setItem(STORAGE_KEY, legacyStored);
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
    return JSON.parse(stored) as EventBundle[];
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
      : createChecklistFromTemplate(event.id, data.eventType);
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

export function claimChecklistItem(itemId: string, guestId: string, note?: string) {
  const bundles = readBundles();
  let updatedItem: ChecklistItem | undefined;

  const nextBundles = bundles.map((bundle) => {
    const guest = bundle.guests.find((candidate) => candidate.id === guestId);
    const item = bundle.checklistItems.find((candidate) => candidate.id === itemId);

    if (!guest || !item) {
      return bundle;
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

      updatedItem = {
        ...item,
        ...data,
        updatedAt: timestamp
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
    id: makeId("item"),
    eventId,
    createdAt: timestamp,
    updatedAt: timestamp
  }));
}

// TODO: Add real host authentication before production. The MVP host route is only link-based.
