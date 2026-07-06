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
    imageUrl: "/theme-art/candlelit-table.svg",
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
    imageUrl: "/theme-art/sage-garden.svg",
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
    imageUrl: "/theme-art/wine-room.svg",
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
    imageUrl: "/theme-art/sunday-brunch.svg",
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
    imageUrl: "/theme-art/table-games.svg",
    imageAlt: "Illustrated late-night table with a board game, cards, dice, snacks, drinks, evergreen, and oak"
  }
];

export const coverStyles = eventThemes.map((theme) => theme.id);

export function getEventTheme(coverStyle?: string) {
  return eventThemes.find((theme) => theme.id === coverStyle) ?? eventThemes[0];
}
