import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "yes" | "maybe" | "no" | "open" | "claimed";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-white text-ink ring-1 ring-ink/10",
  yes: "bg-sage/15 text-sage ring-1 ring-sage/20",
  maybe: "bg-marigold/18 text-[#865f16] ring-1 ring-marigold/20",
  no: "bg-wine/12 text-wine ring-1 ring-wine/15",
  open: "bg-clay/12 text-clay ring-1 ring-clay/20",
  claimed: "bg-sage/15 text-sage ring-1 ring-sage/20"
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
