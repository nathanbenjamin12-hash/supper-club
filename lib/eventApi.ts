import type {
  ChecklistItem,
  ChecklistItemDraft,
  DinnerEvent,
  EventBundle,
  EventDraft,
  Guest,
  GuestDraft
} from "@/types/events";
import {
  addChecklistItem as addLocalChecklistItem,
  claimChecklistItem as claimLocalChecklistItem,
  createEvent as createLocalEvent,
  createGuest as createLocalGuest,
  deleteChecklistItem as deleteLocalChecklistItem,
  getEvent as getLocalEvent,
  getEventBundle as getLocalEventBundle,
  importEventBundle as importLocalEventBundle,
  releaseChecklistItemClaim as releaseLocalChecklistItemClaim,
  updateChecklistItem as updateLocalChecklistItem,
  updateEvent as updateLocalEvent
} from "@/lib/events";

type CreateEventResponse = {
  event: DinnerEvent;
  bundle: EventBundle;
};

type GuestResponse = {
  guest: Guest;
  bundle: EventBundle;
};

type ChecklistItemResponse = {
  item: ChecklistItem;
  bundle: EventBundle;
};

type BundleResponse = {
  bundle: EventBundle;
};

type EventResponse = {
  event: DinnerEvent;
};

async function requestJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    cache: "no-store"
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getSharedEventBundle(eventId: string) {
  try {
    const response = await requestJson<BundleResponse>(`/api/events/${eventId}`);
    return response?.bundle ?? getLocalEventBundle(eventId);
  } catch {
    return getLocalEventBundle(eventId);
  }
}

export async function getSharedEvent(eventId: string) {
  const bundle = await getSharedEventBundle(eventId);
  return bundle?.event ?? getLocalEvent(eventId);
}

export async function importSharedEventBundle(bundle: EventBundle) {
  try {
    const response = await requestJson<BundleResponse>("/api/events/import", {
      method: "POST",
      body: JSON.stringify({ bundle })
    });
    return response?.bundle;
  } catch {
    return importLocalEventBundle(bundle);
  }
}

export async function createSharedEvent(data: EventDraft, starterItems: ChecklistItemDraft[] = []) {
  try {
    const response = await requestJson<CreateEventResponse>("/api/events", {
      method: "POST",
      body: JSON.stringify({ data, starterItems })
    });

    if (response) {
      return response.event;
    }
  } catch {
    // Fall through to local fallback.
  }

  return createLocalEvent(data, starterItems);
}

export async function updateSharedEvent(eventId: string, data: EventDraft) {
  try {
    const response = await requestJson<EventResponse>(`/api/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify({ data })
    });

    if (response) {
      return response.event;
    }
  } catch {
    // Fall through to local fallback.
  }

  return updateLocalEvent(eventId, data);
}

export async function createSharedGuest(eventId: string, data: GuestDraft) {
  try {
    const response = await requestJson<GuestResponse>(`/api/events/${eventId}/guests`, {
      method: "POST",
      body: JSON.stringify({ data })
    });

    if (response) {
      return response;
    }
  } catch {
    // Fall through to local fallback.
  }

  const guest = createLocalGuest(eventId, data);
  const bundle = getLocalEventBundle(eventId);

  return guest && bundle ? { guest, bundle } : undefined;
}

export async function claimSharedChecklistItem(eventId: string, itemId: string, guestId: string, note?: string) {
  try {
    const response = await requestJson<ChecklistItemResponse>(`/api/events/${eventId}/claims`, {
      method: "POST",
      body: JSON.stringify({ itemId, guestId, note })
    });

    if (response) {
      return response;
    }
  } catch {
    // Fall through to local fallback.
  }

  const item = claimLocalChecklistItem(itemId, guestId, note);
  const bundle = getLocalEventBundle(eventId);

  return item && bundle ? { item, bundle } : undefined;
}

export async function releaseSharedChecklistItemClaim(eventId: string, itemId: string, guestId: string) {
  try {
    const response = await requestJson<ChecklistItemResponse>(`/api/events/${eventId}/claims`, {
      method: "DELETE",
      body: JSON.stringify({ itemId, guestId })
    });

    if (response) {
      return response;
    }
  } catch {
    // Fall through to local fallback.
  }

  const item = releaseLocalChecklistItemClaim(itemId, guestId);
  const bundle = getLocalEventBundle(eventId);

  return item && bundle ? { item, bundle } : undefined;
}

export async function addSharedChecklistItem(eventId: string, data: ChecklistItemDraft) {
  try {
    const response = await requestJson<ChecklistItemResponse>(`/api/events/${eventId}/checklist`, {
      method: "POST",
      body: JSON.stringify({ data })
    });

    if (response) {
      return response.item;
    }
  } catch {
    // Fall through to local fallback.
  }

  return addLocalChecklistItem(eventId, data);
}

export async function updateSharedChecklistItem(eventId: string, itemId: string, data: ChecklistItemDraft) {
  try {
    const response = await requestJson<ChecklistItemResponse>(`/api/events/${eventId}/checklist/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ data })
    });

    if (response) {
      return response.item;
    }
  } catch {
    // Fall through to local fallback.
  }

  return updateLocalChecklistItem(itemId, data);
}

export async function deleteSharedChecklistItem(eventId: string, itemId: string) {
  try {
    const response = await requestJson<{ deleted: boolean }>(`/api/events/${eventId}/checklist/${itemId}`, {
      method: "DELETE"
    });

    if (response) {
      return response.deleted;
    }
  } catch {
    // Fall through to local fallback.
  }

  return deleteLocalChecklistItem(itemId);
}
