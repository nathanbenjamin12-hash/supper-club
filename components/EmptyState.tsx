import { Sparkles } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-ink/15 bg-white/60 p-5 text-center">
      <Sparkles className="mx-auto h-6 w-6 text-clay" aria-hidden="true" />
      <p className="mt-2 font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm text-ink/60">{description}</p> : null}
    </div>
  );
}
