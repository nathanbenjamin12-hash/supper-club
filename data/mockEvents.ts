import type {
  ChecklistCategory,
  ChecklistItem,
  DinnerEvent,
  EventBundle,
  EventType,
  Guest
} from "@/types/events";

const now = "2026-06-09T09:00:00.000Z";

export const starterChecklistTemplates: Record<
  EventType,
  Partial<Record<ChecklistCategory, string[]>>
> = {
  dinner_party: {
    appetizers: ["Snack board"],
    mains: ["Main dish"],
    sides: ["Side dish"],
    desserts: ["Ice cream"],
    drinks: ["Red wine"],
    supplies: ["Ice"],
    other: ["Bread"]
  },
  bbq: {
    mains: ["Burgers"],
    sides: ["Chips"],
    desserts: ["Sweet treat"],
    drinks: ["Beer"],
    supplies: ["Ice"],
    games: ["Cornhole"],
    other: ["Charcoal"]
  },
  game_night: {
    appetizers: ["Snacks"],
    mains: ["Pizza"],
    desserts: ["Cookies"],
    drinks: ["Soda"],
    supplies: ["Dice"],
    games: ["Catan"],
    other: ["Extra chair"]
  },
  friendsgiving: {
    appetizers: ["Cheese board"],
    mains: ["Turkey (fried)"],
    sides: ["Stuffing"],
    desserts: ["Pie"],
    drinks: ["White wine"],
    supplies: ["Serving utensils"],
    other: ["Leftover containers"]
  },
  birthday: {
    appetizers: ["Cheese board"],
    mains: ["Pizza"],
    desserts: ["Birthday cake"],
    drinks: ["Beer"],
    supplies: ["Plates & napkins", "Candles"],
    other: ["Decorations"]
  },
  custom: {
    other: []
  }
};

export const sampleEvent: DinnerEvent = {
  id: "sample-dinner-party",
  title: "Pasta Night at Nathan's",
  hostName: "Nathan",
  date: "2026-07-18",
  time: "7:00 PM",
  location: "123 Main St, Philadelphia, PA",
  description: "Casual pasta night. Bring wine, dessert, or a game if you want.",
  eventType: "dinner_party",
  coverStyle: "tomato tablecloth",
  pitchInEnabled: true,
  venmoHandle: "nathanbenjamin",
  createdAt: now,
  updatedAt: now
};

export const sampleGuests: Guest[] = [
  {
    id: "guest-sarah",
    eventId: sampleEvent.id,
    name: "Sarah",
    rsvpStatus: "yes",
    dietaryRestrictions: "Vegetarian",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "guest-mike",
    eventId: sampleEvent.id,
    name: "Mike",
    rsvpStatus: "maybe",
    dietaryRestrictions: "No restrictions",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "guest-emma",
    eventId: sampleEvent.id,
    name: "Emma",
    rsvpStatus: "yes",
    dietaryRestrictions: "Gluten-free",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "guest-david",
    eventId: sampleEvent.id,
    name: "David",
    rsvpStatus: "no",
    allergies: "Nut allergy",
    noteToHost: "Sorry to miss it. Please keep nuts labeled for next time.",
    createdAt: now,
    updatedAt: now
  }
];

export const sampleChecklistItems: ChecklistItem[] = [
  {
    id: "item-red-wine",
    eventId: sampleEvent.id,
    category: "drinks",
    title: "Red wine",
    itemType: "bring",
    isRequired: true,
    claimedByGuestId: "guest-sarah",
    claimedByName: "Sarah",
    claimNote: "bringing a Barbera",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item-dessert",
    eventId: sampleEvent.id,
    category: "desserts",
    title: "Dessert",
    itemType: "bring",
    isRequired: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item-caesar-salad",
    eventId: sampleEvent.id,
    category: "sides",
    title: "Caesar salad",
    itemType: "bring",
    isRequired: true,
    claimedByGuestId: "guest-emma",
    claimedByName: "Emma",
    claimNote: "gluten-free croutons on the side",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item-board-game",
    eventId: sampleEvent.id,
    category: "games",
    title: "Board game",
    itemType: "bring",
    isRequired: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item-ice",
    eventId: sampleEvent.id,
    category: "supplies",
    title: "Ice",
    itemType: "bring",
    isRequired: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item-pitch-in-dinner",
    eventId: sampleEvent.id,
    category: "other",
    title: "Pitch in for dinner",
    itemType: "money",
    isRequired: true,
    amountPerPerson: 15,
    totalSpots: 5,
    description: "Nathan is picking up pasta and sauce. A few people can pitch in.",
    moneyClaims: [
      {
        guestId: "guest-sarah",
        guestName: "Sarah",
        createdAt: now
      },
      {
        guestId: "guest-emma",
        guestName: "Emma",
        createdAt: now
      }
    ],
    createdAt: now,
    updatedAt: now
  }
];

export const mockBundles: EventBundle[] = [
  {
    event: sampleEvent,
    guests: sampleGuests,
    checklistItems: sampleChecklistItems
  }
];
