import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  className,
  iconClassName
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-ink/8 bg-cream p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink/60">{label}</p>
        {icon ? <span className={cn("text-olive", iconClassName)}>{icon}</span> : null}
      </div>
      <p className="mt-2 font-display text-4xl font-semibold text-ink">{value}</p>
    </div>
  );
}
