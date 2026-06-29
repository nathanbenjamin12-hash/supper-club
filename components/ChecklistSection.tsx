import type { ChecklistItem, DinnerEvent, Guest } from "@/types/events";
import { categoryLabels } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { ChecklistItemCard } from "@/components/ChecklistItemCard";

export function ChecklistSection({
  category,
  label,
  items,
  event,
  currentGuest,
  hostControls,
  onClaim,
  onDelete,
  onEdit,
  onBlockedClaim
}: {
  category: keyof typeof categoryLabels;
  label?: string;
  items: ChecklistItem[];
  event?: DinnerEvent;
  currentGuest?: Guest;
  hostControls?: boolean;
  onClaim?: Parameters<typeof ChecklistItemCard>[0]["onClaim"];
  onDelete?: Parameters<typeof ChecklistItemCard>[0]["onDelete"];
  onEdit?: Parameters<typeof ChecklistItemCard>[0]["onEdit"];
  onBlockedClaim?: () => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{label ?? categoryLabels[category]}</h3>
        <span className="rounded-md bg-cream px-3 py-1 text-xs font-semibold text-ink/60 ring-1 ring-ink/8">
          {items.length}
        </span>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-3">
          {items.map((item) => (
            <ChecklistItemCard
              key={item.id}
              item={item}
              event={event}
              currentGuest={currentGuest}
              hostControls={hostControls}
              onClaim={onClaim}
              onDelete={onDelete}
              onEdit={onEdit}
              onBlockedClaim={onBlockedClaim}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing needed here yet." />
      )}
    </section>
  );
}
