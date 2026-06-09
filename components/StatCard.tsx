import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-ink/8 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink/60">{label}</p>
        {icon ? <span className="text-clay">{icon}</span> : null}
      </div>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
