import type { EventBundle } from "@/types/events";

type InvitePayload = {
  version: 1;
  bundle: EventBundle;
};

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function isEventBundle(value: unknown): value is EventBundle {
  const candidate = value as EventBundle;

  return (
    typeof candidate?.event?.id === "string" &&
    typeof candidate.event.title === "string" &&
    Array.isArray(candidate.guests) &&
    Array.isArray(candidate.checklistItems)
  );
}

function createPortableInviteBundle(bundle: EventBundle): EventBundle {
  return {
    event: { ...bundle.event },
    guests: [],
    checklistItems: bundle.checklistItems.map((item) => ({
      ...item,
      claimedByGuestId: undefined,
      claimedByName: undefined,
      claimNote: undefined,
      moneyClaims: undefined
    }))
  };
}

export function createInviteUrl(origin: string, bundle: EventBundle) {
  const url = new URL(`/event/${bundle.event.id}`, origin);

  return url.toString();
}

export function decodeInviteBundle(encodedInvite: string | null, eventId: string) {
  if (!encodedInvite) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(encodedInvite)) as Partial<InvitePayload>;

    if (parsed.version !== 1 || !isEventBundle(parsed.bundle)) {
      return undefined;
    }

    if (parsed.bundle.event.id !== eventId) {
      return undefined;
    }

    return createPortableInviteBundle(parsed.bundle);
  } catch {
    return undefined;
  }
}
