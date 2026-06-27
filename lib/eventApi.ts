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
  updateEvent as updateLocalEvent,
  updateGuest as updateLocalGuest
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

const EVENT_FETCH_RETRY_DELAYS_MS = [150, 300, 600, 900];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function canUseLocalEventStoreFallback() {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV !== "production";
  }

  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function optionalLocalFallback<T>(fallback: () => T) {
  return canUseLocalEventStoreFallback() ? fallback() : undefined;
}

export async function getSharedEventBundle(eventId: string) {
  try {
    for (let attempt = 0; attempt <= EVENT_FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
      const response = await requestJson<BundleResponse>(`/api/events/${eventId}`);

      if (response?.bundle) {
        return response.bundle;
      }

      const nextDelay = EVENT_FETCH_RETRY_DELAYS_MS[attempt];

      if (nextDelay) {
        await wait(nextDelay);
      }
    }

    return optionalLocalFallback(() => getLocalEventBundle(eventId));
  } catch (error) {
    if (canUseLocalEventStoreFallback()) {
      return getLocalEventBundle(eventId);
    }

    throw error;
  }
}

export async function getSharedEvent(eventId: string) {
  const bundle = await getSharedEventBundle(eventId);
  return bundle?.event ?? optionalLocalFallback(() => getLocalEvent(eventId));
}

export async function importSharedEventBundle(bundle: EventBundle) {
  try {
    const response = await requestJson<BundleResponse>("/api/events/import", {
      method: "POST",
      body: JSON.stringify({ bundle })
    });
    return response?.bundle;
  } catch (error) {
    if (canUseLocalEventStoreFallback()) {
      return importLocalEventBundle(bundle);
    }

    throw error;
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    throw new Error("Shared event persistence is unavailable.");
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return undefined;
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return undefined;
  }

  const guest = createLocalGuest(eventId, data);
  const bundle = getLocalEventBundle(eventId);

  return guest && bundle ? { guest, bundle } : undefined;
}

export async function updateSharedGuest(eventId: string, guestId: string, data: GuestDraft) {
  try {
    const response = await requestJson<GuestResponse>(`/api/events/${eventId}/guests`, {
      method: "PATCH",
      body: JSON.stringify({ guestId, data })
    });

    if (response) {
      return response;
    }
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return undefined;
  }

  const guest = updateLocalGuest(eventId, guestId, data);
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return undefined;
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return undefined;
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return undefined;
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return undefined;
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
  } catch (error) {
    if (!canUseLocalEventStoreFallback()) {
      throw error;
    }
  }

  if (!canUseLocalEventStoreFallback()) {
    return false;
  }

  return deleteLocalChecklistItem(itemId);
}
