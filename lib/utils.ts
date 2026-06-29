import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ChecklistCategory, EventType, RSVPStatus } from "@/types/events";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const eventTypeLabels: Record<EventType, string> = {
  dinner_party: "Dinner Party",
  bbq: "BBQ",
  game_night: "Game Night",
  friendsgiving: "Friendsgiving",
  birthday: "Birthday",
  custom: "Custom"
};

export const categoryLabels: Record<ChecklistCategory, string> = {
  appetizers: "Appetizers",
  mains: "Main dishes",
  sides: "Sides",
  desserts: "Desserts",
  drinks: "Drinks",
  supplies: "Supplies",
  games: "Games",
  other: "Other"
};

export const categoryOrder: ChecklistCategory[] = [
  "appetizers",
  "mains",
  "sides",
  "desserts",
  "drinks",
  "supplies",
  "games",
  "other"
];

export const rsvpLabels: Record<RSVPStatus, string> = {
  yes: "I'm in",
  maybe: "Maybe",
  no: "Can't make it"
};

export function formatEventDate(date: string) {
  if (!date) {
    return "Date TBD";
  }

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "Date TBD";
  }

  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}

export function makeId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function cleanOptional(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizeVenmoHandle(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = new URL(trimmed);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const handleFromUrl = segments.at(-1);
    return normalizeVenmoHandle(handleFromUrl);
  } catch {
    const withoutAt = trimmed.replace(/^@+/, "");
    const withoutProfilePrefix = withoutAt.replace(/^u\//i, "");
    const normalized = withoutProfilePrefix.replace(/\s+/g, "");
    return normalized || undefined;
  }
}

export function venmoProfileUrl(handle?: string) {
  const normalized = normalizeVenmoHandle(handle);
  return normalized ? `https://venmo.com/u/${encodeURIComponent(normalized)}` : undefined;
}

export function venmoPaymentUrl(handle?: string, amount?: number, note?: string) {
  const normalized = normalizeVenmoHandle(handle);

  if (!normalized) {
    return undefined;
  }

  const params = new URLSearchParams({
    txn: "pay",
    recipients: normalized
  });

  if (amount && amount > 0) {
    params.set("amount", String(amount));
  }

  if (note?.trim()) {
    params.set("note", note.trim());
  }

  return `https://venmo.com/?${params.toString()}`;
}
