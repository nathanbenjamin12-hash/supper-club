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
    appetizers: ["Appetizer", "Cheese board", "Bread or crackers"],
    mains: ["Main dish"],
    sides: ["Salad", "Vegetable side", "Starch side"],
    desserts: ["Dessert"],
    drinks: ["Red wine", "White wine", "Non-alcoholic drinks", "Sparkling water"],
    supplies: ["Ice", "Napkins", "Extra chairs"],
    games: ["Card game", "Board game"]
  },
  bbq: {
    mains: ["Burgers", "Hot dogs", "Vegetarian option"],
    sides: ["Chips", "Salad", "Fruit", "Corn"],
    drinks: ["Beer", "Soda", "Water"],
    supplies: ["Ice", "Charcoal/propane", "Plates", "Napkins"],
    games: ["Cornhole", "Cards"]
  },
  game_night: {
    mains: ["Pizza"],
    sides: ["Snacks"],
    desserts: ["Dessert"],
    drinks: ["Beer/wine", "Non-alcoholic drinks"],
    games: ["Board game", "Card game", "Party game"],
    supplies: ["Score pads", "Pens", "Extra chairs"]
  },
  friendsgiving: {
    mains: ["Turkey or main dish", "Vegetarian main"],
    sides: [
      "Stuffing",
      "Mashed potatoes",
      "Cranberry sauce",
      "Green beans",
      "Sweet potatoes"
    ],
    desserts: ["Pie", "Cookies"],
    drinks: ["Wine", "Cider", "Non-alcoholic drinks"],
    supplies: ["Ice", "Serving utensils", "Leftover containers"]
  },
  birthday: {
    appetizers: ["Snack board"],
    mains: ["Easy main dish"],
    sides: ["Fruit", "Chips"],
    desserts: ["Cake", "Cupcakes"],
    drinks: ["Sparkling water", "Wine or beer"],
    supplies: ["Candles", "Plates", "Napkins"],
    games: ["Party game"]
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
    isRequired: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item-caesar-salad",
    eventId: sampleEvent.id,
    category: "sides",
    title: "Caesar salad",
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
    isRequired: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item-ice",
    eventId: sampleEvent.id,
    category: "supplies",
    title: "Ice",
    isRequired: true,
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
