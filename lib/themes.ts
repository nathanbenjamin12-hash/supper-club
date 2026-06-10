export type EventTheme = {
  id: string;
  label: string;
  description: string;
  swatch: string;
  heroGradient: string;
  pageBackground: string;
  softPanel: string;
  accentText: string;
  accentBorder: string;
  iconText: string;
  chip: string;
  cta: string;
  glow: string;
  imageUrl: string;
  imageAlt: string;
};

export const eventThemes: EventTheme[] = [
  {
    id: "tomato tablecloth",
    label: "Candlelit Table",
    description: "Warm ivory, terracotta, and candlelight for intimate dinners.",
    swatch: "bg-gradient-to-br from-cream via-clay to-terracotta",
    heroGradient:
      "bg-[linear-gradient(135deg,#4f433a_0%,#7a5143_48%,#c9a66b_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f1ece5_100%)]",
    softPanel: "bg-clay/55",
    accentText: "text-terracotta",
    accentBorder: "border-terracotta/18",
    iconText: "text-olive",
    chip: "bg-terracotta/10 text-terracotta ring-1 ring-terracotta/15",
    cta: "bg-olive text-cream hover:bg-[#556149]",
    glow: "bg-honey/25",
    imageUrl:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "A candlelit dinner table set for guests"
  },
  {
    id: "sage garden",
    label: "Sage Garden",
    description: "Soft greens, herbs, and unfussy outdoor hosting.",
    swatch: "bg-gradient-to-br from-cream via-sage to-olive",
    heroGradient:
      "bg-[linear-gradient(135deg,#68735f_0%,#8aa17b_58%,#c9a66b_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#eef2e9_52%,#f1ece5_100%)]",
    softPanel: "bg-sage/14",
    accentText: "text-olive",
    accentBorder: "border-olive/18",
    iconText: "text-olive",
    chip: "bg-sage/18 text-olive ring-1 ring-olive/15",
    cta: "bg-olive text-cream hover:bg-[#556149]",
    glow: "bg-sage/25",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "A quiet restaurant table with dinner service"
  },
  {
    id: "wine night",
    label: "Wine Room",
    description: "Deep charcoal, clay, and a restrained terracotta accent.",
    swatch: "bg-gradient-to-br from-ink via-terracotta to-clay",
    heroGradient:
      "bg-[linear-gradient(135deg,#2a2623_0%,#6f4b40_52%,#b86a4f_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f3ece6_48%,#f1ece5_100%)]",
    softPanel: "bg-terracotta/10",
    accentText: "text-terracotta",
    accentBorder: "border-terracotta/18",
    iconText: "text-terracotta",
    chip: "bg-terracotta/10 text-terracotta ring-1 ring-terracotta/15",
    cta: "bg-olive text-cream hover:bg-[#556149]",
    glow: "bg-terracotta/20",
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Wine glasses arranged for an evening gathering"
  },
  {
    id: "sunny brunch",
    label: "Sunday Brunch",
    description: "Honey, stone, and morning light without feeling bright.",
    swatch: "bg-gradient-to-br from-cream via-honey to-sage",
    heroGradient:
      "bg-[linear-gradient(135deg,#8a7a58_0%,#c9a66b_48%,#8aa17b_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#f5efe4_50%,#f1ece5_100%)]",
    softPanel: "bg-honey/14",
    accentText: "text-[#735b2e]",
    accentBorder: "border-honey/24",
    iconText: "text-olive",
    chip: "bg-honey/16 text-[#735b2e] ring-1 ring-honey/18",
    cta: "bg-olive text-cream hover:bg-[#556149]",
    glow: "bg-honey/25",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "A warmly lit dining room ready for service"
  },
  {
    id: "game table",
    label: "Table Games",
    description: "Charcoal, sage, and good snacks for lingering after dinner.",
    swatch: "bg-gradient-to-br from-ink via-olive to-sage",
    heroGradient:
      "bg-[linear-gradient(135deg,#2a2623_0%,#68735f_58%,#8aa17b_100%)]",
    pageBackground:
      "bg-[linear-gradient(180deg,#faf7f2_0%,#eef2e9_48%,#f1ece5_100%)]",
    softPanel: "bg-olive/10",
    accentText: "text-ink",
    accentBorder: "border-ink/12",
    iconText: "text-olive",
    chip: "bg-ink/8 text-ink ring-1 ring-ink/12",
    cta: "bg-olive text-cream hover:bg-[#556149]",
    glow: "bg-olive/20",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Shared dishes on a table ready for guests"
  }
];

export const coverStyles = eventThemes.map((theme) => theme.id);

export function getEventTheme(coverStyle?: string) {
  return eventThemes.find((theme) => theme.id === coverStyle) ?? eventThemes[0];
}
