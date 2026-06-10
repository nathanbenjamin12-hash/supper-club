import { Leaf } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-ink/12 bg-cream/70 p-5 text-center">
      <Leaf className="mx-auto h-6 w-6 text-olive" aria-hidden="true" />
      <p className="mt-2 font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm text-ink/60">{description}</p> : null}
    </div>
  );
}
