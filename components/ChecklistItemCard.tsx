"use client";

import { useState } from "react";
import { CheckCircle2, Pencil, Save, Trash2, X } from "lucide-react";
import type {
  ChecklistCategory,
  ChecklistItem,
  ChecklistItemDraft,
  Guest
} from "@/types/events";
import { categoryLabels, categoryOrder, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ChecklistItemCard({
  item,
  currentGuest,
  hostControls = false,
  onClaim,
  onDelete,
  onEdit,
  onBlockedClaim
}: {
  item: ChecklistItem;
  currentGuest?: Guest;
  hostControls?: boolean;
  onClaim?: (item: ChecklistItem, note?: string) => void;
  onDelete?: (item: ChecklistItem) => void;
  onEdit?: (item: ChecklistItem, draft: ChecklistItemDraft) => void;
  onBlockedClaim?: () => void;
}) {
  const [claimNote, setClaimNote] = useState(item.claimNote ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [category, setCategory] = useState<ChecklistCategory>(item.category);
  const [quantity, setQuantity] = useState(item.quantity?.toString() ?? "");
  const [isRequired, setIsRequired] = useState(item.isRequired);

  const claimed = Boolean(item.claimedByGuestId);
  const claimedByCurrentGuest = currentGuest?.id === item.claimedByGuestId;

  function handleClaim() {
    if (!currentGuest) {
      onBlockedClaim?.();
      return;
    }

    if (claimed && !claimedByCurrentGuest) {
      return;
    }

    onClaim?.(item, claimNote);
  }

  function handleSave() {
    if (!title.trim()) {
      return;
    }

    onEdit?.(item, {
      title: title.trim(),
      category,
      description: description.trim() || undefined,
      quantity: quantity ? Number(quantity) : undefined,
      isRequired
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border border-clay/25 bg-clay/6 p-4">
        <div className="grid gap-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value as ChecklistCategory)}
            >
              {categoryOrder.map((candidate) => (
                <option key={candidate} value={candidate}>
                  {categoryLabels[candidate]}
                </option>
              ))}
            </Select>
            <Input
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              type="number"
              min="1"
              placeholder="Qty"
            />
          </div>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="min-h-20"
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(event) => setIsRequired(event.target.checked)}
              className="h-4 w-4 rounded border-ink/20"
            />
            Needed for the party
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm",
        claimed ? "border-sage/20" : "border-ink/8"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{item.title}</p>
            {item.quantity ? <Badge tone="neutral">x{item.quantity}</Badge> : null}
            {!item.isRequired ? <Badge tone="neutral">nice to have</Badge> : null}
          </div>
          {item.description ? <p className="mt-1 text-sm text-ink/60">{item.description}</p> : null}
        </div>
        <Badge tone={claimed ? "claimed" : "open"}>{claimed ? "Claimed" : "Open"}</Badge>
      </div>

      <div className="mt-3 rounded-lg bg-oat/45 p-3 text-sm">
        {claimed ? (
          <p className="font-medium text-sage">
            <CheckCircle2 className="mr-1 inline h-4 w-4" aria-hidden="true" />
            {item.claimedByName} is bringing this
          </p>
        ) : (
          <p className="font-medium text-clay">Still needed</p>
        )}
        {item.claimNote ? <p className="mt-1 text-ink/65">{item.claimNote}</p> : null}
      </div>

      {!hostControls && onClaim ? (
        <div className="mt-3 grid gap-2">
          {(!claimed || claimedByCurrentGuest) && (
            <Input
              value={claimNote}
              onChange={(event) => setClaimNote(event.target.value)}
              placeholder="Add a note, like 'bringing brownies'"
            />
          )}
          <Button
            type="button"
            variant={claimedByCurrentGuest ? "secondary" : "sage"}
            onClick={handleClaim}
            disabled={claimed && !claimedByCurrentGuest}
          >
            {claimedByCurrentGuest ? "Update note" : "I'll bring this"}
          </Button>
        </div>
      ) : null}

      {hostControls ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => onDelete?.(item)}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      ) : null}
    </div>
  );
}
