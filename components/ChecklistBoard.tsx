import type { ChecklistItem, DinnerEvent, Guest } from "@/types/events";
import { categoryOrder } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { ChecklistSection } from "@/components/ChecklistSection";

export function ChecklistBoard({
  items,
  event,
  currentGuest,
  hostControls = false,
  onClaim,
  onDelete,
  onEdit,
  onBlockedClaim
}: {
  items: ChecklistItem[];
  event?: DinnerEvent;
  currentGuest?: Guest;
  hostControls?: boolean;
  onClaim?: Parameters<typeof ChecklistSection>[0]["onClaim"];
  onDelete?: Parameters<typeof ChecklistSection>[0]["onDelete"];
  onEdit?: Parameters<typeof ChecklistSection>[0]["onEdit"];
  onBlockedClaim?: () => void;
}) {
  const moneyItems = items.filter((item) => (item.itemType ?? "bring") === "money");
  const bringItems = items.filter((item) => (item.itemType ?? "bring") !== "money");

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing needed here yet."
        description="The host can add food, drinks, supplies, or games."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {moneyItems.length > 0 ? (
        <ChecklistSection
          category="other"
          label="Pitch-ins"
          items={moneyItems}
          event={event}
          currentGuest={currentGuest}
          hostControls={hostControls}
          onClaim={onClaim}
          onDelete={onDelete}
          onEdit={onEdit}
          onBlockedClaim={onBlockedClaim}
        />
      ) : null}
      {categoryOrder.map((category) => {
        const categoryItems = bringItems.filter((item) => item.category === category);

        if (categoryItems.length === 0 && !hostControls) {
          return null;
        }

        return (
          <ChecklistSection
            key={category}
            category={category}
            items={categoryItems}
            event={event}
            currentGuest={currentGuest}
            hostControls={hostControls}
            onClaim={onClaim}
            onDelete={onDelete}
            onEdit={onEdit}
            onBlockedClaim={onBlockedClaim}
          />
        );
      })}
    </div>
  );
}
