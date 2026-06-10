export type RSVPStatus = "yes" | "maybe" | "no";

export type EventType =
  | "dinner_party"
  | "bbq"
  | "game_night"
  | "friendsgiving"
  | "birthday"
  | "custom";

export type ChecklistCategory =
  | "appetizers"
  | "mains"
  | "sides"
  | "desserts"
  | "drinks"
  | "supplies"
  | "games"
  | "other";

export type ChecklistItemType = "bring" | "money";

export interface MoneyContributionClaim {
  guestId: string;
  guestName: string;
  note?: string;
  createdAt: string;
}

export interface DinnerEvent {
  id: string;
  title: string;
  hostName: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  eventType: EventType;
  coverStyle?: string;
  pitchInEnabled?: boolean;
  recommendedContributionAmount?: number;
  venmoHandle?: string;
  /** Legacy localStorage field. New events store venmoHandle and derive the URL in UI. */
  venmoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  rsvpStatus: RSVPStatus;
  email?: string;
  phone?: string;
  dietaryRestrictions?: string;
  allergies?: string;
  noteToHost?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  eventId: string;
  category: ChecklistCategory;
  title: string;
  itemType?: ChecklistItemType;
  description?: string;
  quantity?: number;
  isRequired: boolean;
  amountPerPerson?: number;
  totalSpots?: number;
  moneyClaims?: MoneyContributionClaim[];
  claimedByGuestId?: string;
  claimedByName?: string;
  claimNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventBundle {
  event: DinnerEvent;
  guests: Guest[];
  checklistItems: ChecklistItem[];
}

export type EventDraft = Omit<DinnerEvent, "id" | "createdAt" | "updatedAt">;

export type GuestDraft = Omit<Guest, "id" | "eventId" | "createdAt" | "updatedAt">;

export type ChecklistItemDraft = Omit<
  ChecklistItem,
  | "id"
  | "eventId"
  | "claimedByGuestId"
  | "claimedByName"
  | "claimNote"
  | "moneyClaims"
  | "createdAt"
  | "updatedAt"
>;
