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
};

export const eventThemes: EventTheme[] = [
  {
    id: "tomato tablecloth",
    label: "Tomato Table",
    description: "Bold red-orange, golden candlelight, classic dinner party energy.",
    swatch: "bg-gradient-to-br from-tomato via-clay to-marigold",
    heroGradient:
      "bg-[radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.34),transparent_15rem),linear-gradient(135deg,#ef6a4c_0%,#d75b35_48%,#e8ad3f_100%)]",
    pageBackground:
      "bg-[radial-gradient(circle_at_12%_8%,rgba(239,106,76,0.28),transparent_22rem),radial-gradient(circle_at_92%_22%,rgba(232,173,63,0.25),transparent_20rem),linear-gradient(135deg,#fff5eb_0%,#fdf3e5_50%,#f2f6ea_100%)]",
    softPanel: "bg-clay/10",
    accentText: "text-clay",
    accentBorder: "border-clay/30",
    iconText: "text-clay",
    chip: "bg-clay/12 text-clay ring-1 ring-clay/25",
    cta: "bg-clay text-white hover:bg-[#bd4829]",
    glow: "bg-marigold/45"
  },
  {
    id: "sage garden",
    label: "Sage Garden",
    description: "Fresh greens, herb garden calm, outdoor supper feel.",
    swatch: "bg-gradient-to-br from-sage via-[#9aae74] to-marigold",
    heroGradient:
      "bg-[radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.34),transparent_14rem),linear-gradient(135deg,#5f825f_0%,#8ba56b_48%,#e2b84a_100%)]",
    pageBackground:
      "bg-[radial-gradient(circle_at_12%_8%,rgba(111,143,114,0.28),transparent_22rem),radial-gradient(circle_at_92%_22%,rgba(232,173,63,0.18),transparent_20rem),linear-gradient(135deg,#f6faee_0%,#edf5e7_48%,#fff4e2_100%)]",
    softPanel: "bg-sage/12",
    accentText: "text-sage",
    accentBorder: "border-sage/30",
    iconText: "text-sage",
    chip: "bg-sage/14 text-sage ring-1 ring-sage/25",
    cta: "bg-sage text-white hover:bg-[#58745b]",
    glow: "bg-sage/45"
  },
  {
    id: "wine night",
    label: "Wine Night",
    description: "Deep berry, candlelit, a little dramatic in the best way.",
    swatch: "bg-gradient-to-br from-wine via-clay to-[#39232c]",
    heroGradient:
      "bg-[radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.2),transparent_13rem),linear-gradient(135deg,#8f3d5a_0%,#6f293f_48%,#2e2028_100%)]",
    pageBackground:
      "bg-[radial-gradient(circle_at_12%_8%,rgba(143,61,90,0.22),transparent_22rem),radial-gradient(circle_at_92%_22%,rgba(215,91,53,0.18),transparent_20rem),linear-gradient(135deg,#fff1f4_0%,#f7e9ef_48%,#f5efe8_100%)]",
    softPanel: "bg-wine/10",
    accentText: "text-wine",
    accentBorder: "border-wine/30",
    iconText: "text-wine",
    chip: "bg-wine/12 text-wine ring-1 ring-wine/25",
    cta: "bg-wine text-white hover:bg-[#743047]",
    glow: "bg-wine/40"
  },
  {
    id: "sunny brunch",
    label: "Sunny Brunch",
    description: "Golden, bright, citrusy, and easygoing.",
    swatch: "bg-gradient-to-br from-marigold via-[#f3ca78] to-tomato",
    heroGradient:
      "bg-[radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.38),transparent_14rem),linear-gradient(135deg,#e8ad3f_0%,#f0c96b_44%,#ef6a4c_100%)]",
    pageBackground:
      "bg-[radial-gradient(circle_at_12%_8%,rgba(232,173,63,0.28),transparent_22rem),radial-gradient(circle_at_92%_22%,rgba(239,106,76,0.18),transparent_20rem),linear-gradient(135deg,#fff9e8_0%,#fff0cf_48%,#f9ede4_100%)]",
    softPanel: "bg-marigold/18",
    accentText: "text-[#865f16]",
    accentBorder: "border-marigold/40",
    iconText: "text-[#b97816]",
    chip: "bg-marigold/20 text-[#865f16] ring-1 ring-marigold/30",
    cta: "bg-[#c27d19] text-white hover:bg-[#a96711]",
    glow: "bg-marigold/50"
  },
  {
    id: "game table",
    label: "Game Table",
    description: "Emerald, ink, and berry for cards, snacks, and a little chaos.",
    swatch: "bg-gradient-to-br from-sage via-ink to-wine",
    heroGradient:
      "bg-[radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.2),transparent_13rem),linear-gradient(135deg,#6f8f72_0%,#25211d_52%,#8f3d5a_100%)]",
    pageBackground:
      "bg-[radial-gradient(circle_at_12%_8%,rgba(111,143,114,0.22),transparent_22rem),radial-gradient(circle_at_92%_22%,rgba(143,61,90,0.2),transparent_20rem),linear-gradient(135deg,#f1f7ed_0%,#f5f1e9_46%,#f5eaf0_100%)]",
    softPanel: "bg-ink/10",
    accentText: "text-ink",
    accentBorder: "border-ink/25",
    iconText: "text-ink",
    chip: "bg-ink/10 text-ink ring-1 ring-ink/20",
    cta: "bg-ink text-cream hover:bg-[#3a3029]",
    glow: "bg-wine/35"
  }
];

export const coverStyles = eventThemes.map((theme) => theme.id);

export function getEventTheme(coverStyle?: string) {
  return eventThemes.find((theme) => theme.id === coverStyle) ?? eventThemes[0];
}
