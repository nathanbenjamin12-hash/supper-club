import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "yes" | "maybe" | "no" | "open" | "claimed";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-stone text-ink ring-1 ring-ink/8",
  yes: "bg-sage/18 text-olive ring-1 ring-olive/15",
  maybe: "bg-honey/18 text-[#735b2e] ring-1 ring-honey/20",
  no: "bg-terracotta/12 text-terracotta ring-1 ring-terracotta/15",
  open: "bg-clay/70 text-ink ring-1 ring-ink/8",
  claimed: "bg-sage/18 text-olive ring-1 ring-olive/15"
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
