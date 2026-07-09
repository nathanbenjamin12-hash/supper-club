export type EventTheme = {
  id: string;
  label: string;
  description: string;
  primaryAccent: string;
  secondaryAccent: string;
  subtleTint: string;
  borderAccent: string;
  swatch: string;
  heroGradient: string;
  heroOverlay: string;
  pageBackground: string;
  softPanel: string;
  cardAccent: string;
  divider: string;
  accentText: string;
  accentBorder: string;
  iconText: string;
  chip: string;
  openBadge: string;
  cta: string;
  glow: string;
  imageUrl: string;
  imageAlt: string;
};

export const eventThemes: EventTheme[] = [
  {
    id: "tomato tablecloth",
    label: "Candlelit Table",
    description: "Warm, intimate, and softly lit.",
    primaryAccent: "#a8563f",
    secondaryAccent: "#c9a66b",
    subtleTint: "#f3e2cf",
    borderAccent: "#a8563f",
    swatch: "bg-gradient-to-br from-[#fff7ea] via-[#e6c7a6] to-[#a8563f]",
    heroGradient:
      "bg-[linear-gradient(135deg,#4f3329_0%,#8a4938_48%,#c9a66b_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(34,24,20,0.18)_0%,rgba(43,25,20,0.42)_44%,rgba(31,21,17,0.88)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f5eadf_48%,#f1ece5_100%)]",
    softPanel: "bg-[#f3e2cf]",
    cardAccent: "bg-[#fff9f1]",
    divider: "border-terracotta/16",
    accentText: "text-terracotta",
    accentBorder: "border-terracotta/20",
    iconText: "text-terracotta",
    chip: "bg-terracotta/12 text-terracotta ring-1 ring-terracotta/18",
    openBadge: "bg-[#f3e2cf] text-terracotta ring-1 ring-terracotta/16",
    cta: "bg-terracotta text-cream hover:bg-[#974c38]",
    glow: "bg-honey/25",
    imageUrl: "/theme-art/candlelit-table.png",
    imageAlt: "Illustrated candlelit dinner table with linen, candles, wine, and warm terracotta light"
  },
  {
    id: "sage garden",
    label: "Sage Garden",
    description: "Fresh greens for relaxed hosting.",
    primaryAccent: "#68735f",
    secondaryAccent: "#8aa17b",
    subtleTint: "#eef2e9",
    borderAccent: "#68735f",
    swatch: "bg-gradient-to-br from-[#faf7f2] via-[#cbd9c1] to-[#68735f]",
    heroGradient:
      "bg-[linear-gradient(135deg,#68735f_0%,#8aa17b_58%,#c9a66b_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(31,43,32,0.12)_0%,rgba(42,57,41,0.38)_48%,rgba(25,32,25,0.82)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#eef2e9_52%,#f1ece5_100%)]",
    softPanel: "bg-sage/16",
    cardAccent: "bg-[#f8fbf4]",
    divider: "border-olive/16",
    accentText: "text-olive",
    accentBorder: "border-olive/18",
    iconText: "text-olive",
    chip: "bg-sage/18 text-olive ring-1 ring-olive/15",
    openBadge: "bg-sage/12 text-olive ring-1 ring-olive/14",
    cta: "bg-olive text-cream hover:bg-[#556149]",
    glow: "bg-sage/25",
    imageUrl: "/theme-art/sage-garden.png",
    imageAlt: "Illustrated sage green table with herbs, ceramic bowls, open windows, and fresh ingredients"
  },
  {
    id: "wine night",
    label: "Wine Room",
    description: "Dark, cozy, and a little moody.",
    primaryAccent: "#6f2f3a",
    secondaryAccent: "#8b6849",
    subtleTint: "#f2e8e3",
    borderAccent: "#6f2f3a",
    swatch: "bg-gradient-to-br from-[#272321] via-[#6f2f3a] to-[#8b6849]",
    heroGradient:
      "bg-[linear-gradient(135deg,#211f1e_0%,#6f2f3a_52%,#8b6849_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(12,10,10,0.22)_0%,rgba(32,18,22,0.54)_48%,rgba(11,10,10,0.9)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f3ece6_48%,#f1ece5_100%)]",
    softPanel: "bg-[#f2e8e3]",
    cardAccent: "bg-[#fff8f2]",
    divider: "border-[#6f2f3a]/18",
    accentText: "text-[#6f2f3a]",
    accentBorder: "border-[#6f2f3a]/20",
    iconText: "text-[#6f2f3a]",
    chip: "bg-[#6f2f3a]/10 text-[#6f2f3a] ring-1 ring-[#6f2f3a]/16",
    openBadge: "bg-[#6f2f3a]/8 text-[#6f2f3a] ring-1 ring-[#6f2f3a]/12",
    cta: "bg-[#6f2f3a] text-cream hover:bg-[#5e2731]",
    glow: "bg-[#6f2f3a]/18",
    imageUrl: "/theme-art/wine-room.png",
    imageAlt: "Illustrated low-lit wine room table with a wine bottle, glass, candle, wood, and burgundy tones"
  },
  {
    id: "sunny brunch",
    label: "Sunday Brunch",
    description: "Light, easy, and morning-ready.",
    primaryAccent: "#b8892d",
    secondaryAccent: "#8aa17b",
    subtleTint: "#f8efd9",
    borderAccent: "#b8892d",
    swatch: "bg-gradient-to-br from-[#fff9ed] via-[#e8c979] to-[#8aa17b]",
    heroGradient:
      "bg-[linear-gradient(135deg,#8a7a58_0%,#c9a66b_48%,#8aa17b_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(79,57,28,0.08)_0%,rgba(110,78,33,0.3)_46%,rgba(56,44,29,0.78)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f5efe4_50%,#f1ece5_100%)]",
    softPanel: "bg-honey/16",
    cardAccent: "bg-[#fffaf0]",
    divider: "border-honey/24",
    accentText: "text-[#735b2e]",
    accentBorder: "border-honey/24",
    iconText: "text-olive",
    chip: "bg-honey/16 text-[#735b2e] ring-1 ring-honey/18",
    openBadge: "bg-honey/12 text-[#735b2e] ring-1 ring-honey/16",
    cta: "bg-[#735b2e] text-cream hover:bg-[#5f4924]",
    glow: "bg-honey/25",
    imageUrl: "/theme-art/sunday-brunch.png",
    imageAlt: "Illustrated Sunday brunch table with morning light, coffee, pastries, fruit, flowers, and honey"
  },
  {
    id: "game table",
    label: "Table Games",
    description: "Deep evergreen, warm oak, and relaxed nights around the table.",
    primaryAccent: "#1f4a3d",
    secondaryAccent: "#9a7047",
    subtleTint: "#edf2ec",
    borderAccent: "#1f4a3d",
    swatch: "bg-gradient-to-br from-[#1f2521] via-[#1f4a3d] to-[#9a7047]",
    heroGradient:
      "bg-[linear-gradient(135deg,#1f2521_0%,#1f4a3d_58%,#9a7047_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(13,22,17,0.18)_0%,rgba(20,43,35,0.46)_46%,rgba(12,18,15,0.86)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#eef2e9_48%,#f1ece5_100%)]",
    softPanel: "bg-[#edf2ec]",
    cardAccent: "bg-[#f8fbf6]",
    divider: "border-[#1f4a3d]/16",
    accentText: "text-[#1f4a3d]",
    accentBorder: "border-[#1f4a3d]/18",
    iconText: "text-[#1f4a3d]",
    chip: "bg-[#1f4a3d]/10 text-[#1f4a3d] ring-1 ring-[#1f4a3d]/14",
    openBadge: "bg-[#1f4a3d]/8 text-[#1f4a3d] ring-1 ring-[#1f4a3d]/12",
    cta: "bg-[#1f4a3d] text-cream hover:bg-[#193c32]",
    glow: "bg-olive/20",
    imageUrl: "/theme-art/table-games.png",
    imageAlt: "Illustrated late-night table with a board game, cards, dice, snacks, drinks, evergreen, and oak"
  },
  {
    id: "outdoor picnic",
    label: "Outdoor Picnic",
    description: "Fresh air, soft sunshine, and easy afternoons outdoors.",
    primaryAccent: "#6f7f4f",
    secondaryAccent: "#c8644f",
    subtleTint: "#f4f0df",
    borderAccent: "#6f7f4f",
    swatch: "bg-gradient-to-br from-[#fff8e8] via-[#d7dfb0] to-[#c8644f]",
    heroGradient:
      "bg-[linear-gradient(135deg,#fff8e8_0%,#d7dfb0_54%,#c8644f_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(82,94,52,0.06)_0%,rgba(105,122,72,0.28)_48%,rgba(48,59,35,0.72)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f5f0df_52%,#eef3e4_100%)]",
    softPanel: "bg-[#f4f0df]",
    cardAccent: "bg-[#fffaf0]",
    divider: "border-[#6f7f4f]/18",
    accentText: "text-[#6f7f4f]",
    accentBorder: "border-[#6f7f4f]/20",
    iconText: "text-[#6f7f4f]",
    chip: "bg-[#6f7f4f]/12 text-[#5a6841] ring-1 ring-[#6f7f4f]/18",
    openBadge: "bg-[#f4f0df] text-[#5a6841] ring-1 ring-[#6f7f4f]/16",
    cta: "bg-[#6f7f4f] text-cream hover:bg-[#5a6841]",
    glow: "bg-[#c8644f]/18",
    imageUrl: "/theme-art/outdoor-picnic.png",
    imageAlt: "Illustrated outdoor picnic with fresh greens, natural linen, warm sunlight, soft picnic reds, and light wood tones"
  },
  {
    id: "fall feast",
    label: "Fall Feast",
    description: "Warm autumn dinner with candles and harvest dishes.",
    primaryAccent: "#8f4f2e",
    secondaryAccent: "#bd7a3e",
    subtleTint: "#f2e4d0",
    borderAccent: "#8f4f2e",
    swatch: "bg-gradient-to-br from-[#f6ead6] via-[#bd7a3e] to-[#8f4f2e]",
    heroGradient:
      "bg-[linear-gradient(135deg,#3b2b22_0%,#8f4f2e_52%,#bd7a3e_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(43,29,21,0.14)_0%,rgba(73,43,28,0.42)_48%,rgba(35,24,19,0.84)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f4eadc_50%,#f1ece5_100%)]",
    softPanel: "bg-[#f2e4d0]",
    cardAccent: "bg-[#fff8ef]",
    divider: "border-[#8f4f2e]/18",
    accentText: "text-[#8f4f2e]",
    accentBorder: "border-[#8f4f2e]/20",
    iconText: "text-[#8f4f2e]",
    chip: "bg-[#8f4f2e]/11 text-[#7a4329] ring-1 ring-[#8f4f2e]/18",
    openBadge: "bg-[#f2e4d0] text-[#7a4329] ring-1 ring-[#8f4f2e]/15",
    cta: "bg-[#8f4f2e] text-cream hover:bg-[#7a4329]",
    glow: "bg-[#bd7a3e]/20",
    imageUrl: "/theme-art/fall-feast.png",
    imageAlt: "Illustrated fall feast table with roast turkey, candles, autumn leaves, pears, and warm brick tones"
  },
  {
    id: "pizza night",
    label: "Pizza Night",
    description: "Casual pizza night with warm brick and city light.",
    primaryAccent: "#a84f32",
    secondaryAccent: "#6d7654",
    subtleTint: "#f1e5d8",
    borderAccent: "#a84f32",
    swatch: "bg-gradient-to-br from-[#f6e7d7] via-[#a84f32] to-[#6d7654]",
    heroGradient:
      "bg-[linear-gradient(135deg,#312820_0%,#a84f32_54%,#6d7654_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(30,24,20,0.16)_0%,rgba(94,47,34,0.42)_46%,rgba(28,23,19,0.84)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f3e8dc_50%,#f1ece5_100%)]",
    softPanel: "bg-[#f1e5d8]",
    cardAccent: "bg-[#fff8f1]",
    divider: "border-[#a84f32]/18",
    accentText: "text-[#a84f32]",
    accentBorder: "border-[#a84f32]/20",
    iconText: "text-[#a84f32]",
    chip: "bg-[#a84f32]/10 text-[#8f442c] ring-1 ring-[#a84f32]/16",
    openBadge: "bg-[#f1e5d8] text-[#8f442c] ring-1 ring-[#a84f32]/14",
    cta: "bg-[#a84f32] text-cream hover:bg-[#8f442c]",
    glow: "bg-[#6d7654]/18",
    imageUrl: "/theme-art/pizza-night.png",
    imageAlt: "Illustrated pizza night table with two pizzas, herbs, brick wall, candles, and Brooklyn apartment details"
  },
  {
    id: "pasta night",
    label: "Pasta Night",
    description: "Easy pasta dinner with warm olive and tomato tones.",
    primaryAccent: "#8c5f2f",
    secondaryAccent: "#657255",
    subtleTint: "#f2e7d4",
    borderAccent: "#8c5f2f",
    swatch: "bg-gradient-to-br from-[#f7ead5] via-[#c78945] to-[#657255]",
    heroGradient:
      "bg-[linear-gradient(135deg,#54412f_0%,#8c5f2f_52%,#657255_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(45,34,23,0.12)_0%,rgba(89,62,35,0.38)_46%,rgba(38,31,23,0.82)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f4ead8_52%,#f1ece5_100%)]",
    softPanel: "bg-[#f2e7d4]",
    cardAccent: "bg-[#fff8ee]",
    divider: "border-[#8c5f2f]/18",
    accentText: "text-[#8c5f2f]",
    accentBorder: "border-[#8c5f2f]/20",
    iconText: "text-[#657255]",
    chip: "bg-[#8c5f2f]/10 text-[#79512a] ring-1 ring-[#8c5f2f]/16",
    openBadge: "bg-[#f2e7d4] text-[#79512a] ring-1 ring-[#8c5f2f]/14",
    cta: "bg-[#8c5f2f] text-cream hover:bg-[#79512a]",
    glow: "bg-[#657255]/18",
    imageUrl: "/theme-art/pasta-night.png",
    imageAlt: "Illustrated pasta night table with spaghetti, ravioli, olive branches, cookbooks, and warm apartment light"
  },
  {
    id: "cocktail hour",
    label: "Cocktail Hour",
    description: "Golden cocktail hour with garden lights and small bites.",
    primaryAccent: "#a56a27",
    secondaryAccent: "#6f7d53",
    subtleTint: "#f5e7d1",
    borderAccent: "#a56a27",
    swatch: "bg-gradient-to-br from-[#fff2dc] via-[#d99a45] to-[#6f7d53]",
    heroGradient:
      "bg-[linear-gradient(135deg,#4d3825_0%,#a56a27_50%,#6f7d53_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(56,39,24,0.1)_0%,rgba(111,72,34,0.34)_46%,rgba(43,35,24,0.78)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f5ead8_50%,#f1ece5_100%)]",
    softPanel: "bg-[#f5e7d1]",
    cardAccent: "bg-[#fff9ef]",
    divider: "border-[#a56a27]/20",
    accentText: "text-[#8a581f]",
    accentBorder: "border-[#a56a27]/20",
    iconText: "text-[#6f7d53]",
    chip: "bg-[#a56a27]/11 text-[#8a581f] ring-1 ring-[#a56a27]/16",
    openBadge: "bg-[#f5e7d1] text-[#8a581f] ring-1 ring-[#a56a27]/14",
    cta: "bg-[#8a581f] text-cream hover:bg-[#724819]",
    glow: "bg-[#d99a45]/22",
    imageUrl: "/theme-art/cocktail-hour.png",
    imageAlt: "Illustrated cocktail hour table with cocktails, olives, candles, string lights, and warm garden greenery"
  },
  {
    id: "taco night",
    label: "Taco Night",
    description: "Bright taco spread with patio lights and colorful toppings.",
    primaryAccent: "#b35d2b",
    secondaryAccent: "#3f6f48",
    subtleTint: "#f4e5cf",
    borderAccent: "#b35d2b",
    swatch: "bg-gradient-to-br from-[#ffe7c8] via-[#d58332] to-[#3f6f48]",
    heroGradient:
      "bg-[linear-gradient(135deg,#4a2f1e_0%,#b35d2b_52%,#3f6f48_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(53,34,20,0.1)_0%,rgba(115,62,31,0.36)_46%,rgba(35,31,20,0.8)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f5e8d9_50%,#f1ece5_100%)]",
    softPanel: "bg-[#f4e5cf]",
    cardAccent: "bg-[#fff8ef]",
    divider: "border-[#b35d2b]/18",
    accentText: "text-[#9a4e24]",
    accentBorder: "border-[#b35d2b]/20",
    iconText: "text-[#3f6f48]",
    chip: "bg-[#b35d2b]/11 text-[#9a4e24] ring-1 ring-[#b35d2b]/16",
    openBadge: "bg-[#f4e5cf] text-[#9a4e24] ring-1 ring-[#b35d2b]/14",
    cta: "bg-[#9a4e24] text-cream hover:bg-[#82411e]",
    glow: "bg-[#3f6f48]/18",
    imageUrl: "/theme-art/taco-night.png",
    imageAlt: "Illustrated taco night table with tacos, chips, salsa, margaritas, patio lights, and potted plants"
  },
  {
    id: "backyard bbq",
    label: "Backyard BBQ",
    description: "Sunny backyard table with grill smoke and easy sides.",
    primaryAccent: "#57713d",
    secondaryAccent: "#c18a38",
    subtleTint: "#eef1dc",
    borderAccent: "#57713d",
    swatch: "bg-gradient-to-br from-[#fff2d0] via-[#b9c77d] to-[#57713d]",
    heroGradient:
      "bg-[linear-gradient(135deg,#f4deb3_0%,#8da65a_52%,#57713d_100%)]",
    heroOverlay: "bg-[linear-gradient(180deg,rgba(59,76,34,0.05)_0%,rgba(81,105,50,0.26)_48%,rgba(38,54,26,0.72)_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f1f0df_52%,#edf2df_100%)]",
    softPanel: "bg-[#eef1dc]",
    cardAccent: "bg-[#fff9eb]",
    divider: "border-[#57713d]/18",
    accentText: "text-[#57713d]",
    accentBorder: "border-[#57713d]/20",
    iconText: "text-[#57713d]",
    chip: "bg-[#57713d]/12 text-[#4a6034] ring-1 ring-[#57713d]/18",
    openBadge: "bg-[#eef1dc] text-[#4a6034] ring-1 ring-[#57713d]/16",
    cta: "bg-[#57713d] text-cream hover:bg-[#4a6034]",
    glow: "bg-[#c18a38]/20",
    imageUrl: "/theme-art/backyard-bbq.png",
    imageAlt: "Illustrated backyard barbecue with grill, burgers, skewers, lemonade, string lights, and sunny garden greenery"
  }
];

export const coverStyles = eventThemes.map((theme) => theme.id);

export function getEventTheme(coverStyle?: string) {
  return eventThemes.find((theme) => theme.id === coverStyle) ?? eventThemes[0];
}
