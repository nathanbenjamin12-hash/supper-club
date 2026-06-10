"use client";

import { useState } from "react";
import { CheckCircle2, DollarSign, ExternalLink, Pencil, Save, Trash2, X } from "lucide-react";
import type {
  ChecklistCategory,
  ChecklistItemType,
  ChecklistItem,
  ChecklistItemDraft,
  DinnerEvent,
  Guest
} from "@/types/events";
import { categoryLabels, categoryOrder, cn, venmoProfileUrl } from "@/lib/utils";
import { getEventTheme } from "@/lib/themes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ChecklistItemCard({
  item,
  event,
  currentGuest,
  hostControls = false,
  onClaim,
  onDelete,
  onEdit,
  onBlockedClaim
}: {
  item: ChecklistItem;
  event?: DinnerEvent;
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
  const [itemType, setItemType] = useState<ChecklistItemType>(item.itemType ?? "bring");
  const [description, setDescription] = useState(item.description ?? "");
  const [category, setCategory] = useState<ChecklistCategory>(item.category);
  const [quantity, setQuantity] = useState(item.quantity?.toString() ?? "");
  const [amountPerPerson, setAmountPerPerson] = useState(item.amountPerPerson?.toString() ?? "");
  const [totalSpots, setTotalSpots] = useState(item.totalSpots?.toString() ?? "");
  const [isRequired, setIsRequired] = useState(item.isRequired);
  const [editError, setEditError] = useState("");

  const theme = getEventTheme(event?.coverStyle);
  const moneyClaims = item.moneyClaims ?? [];
  const isMoneyItem = (item.itemType ?? "bring") === "money";
  const totalMoneySpots = item.totalSpots ?? 1;
  const claimedMoneySpots = moneyClaims.length;
  const moneySpotsLeft = Math.max(totalMoneySpots - claimedMoneySpots, 0);
  const currentGuestMoneyClaim = currentGuest
    ? moneyClaims.find((claim) => claim.guestId === currentGuest.id)
    : undefined;
  const moneyItemIsFull = claimedMoneySpots >= totalMoneySpots;
  const paymentUrl = currentGuestMoneyClaim ? venmoProfileUrl(event?.venmoHandle ?? event?.venmoUrl) : undefined;
  const claimed = isMoneyItem ? moneyItemIsFull : Boolean(item.claimedByGuestId);
  const claimedByCurrentGuest = currentGuest?.id === item.claimedByGuestId;

  function handleClaim() {
    if (!currentGuest) {
      onBlockedClaim?.();
      return;
    }

    if (isMoneyItem) {
      if (currentGuestMoneyClaim || moneyItemIsFull) {
        return;
      }

      onClaim?.(item, claimNote);
      return;
    }

    if (claimed && !claimedByCurrentGuest) {
      return;
    }

    onClaim?.(item, claimNote);
  }

  function handleSave() {
    if (!title.trim()) {
      setEditError("Add a title before saving.");
      return;
    }

    const amount = amountPerPerson ? Number(amountPerPerson) : undefined;
    const spots = totalSpots ? Number(totalSpots) : undefined;

    if (itemType === "money") {
      if (amount === undefined || Number.isNaN(amount) || amount <= 0) {
        setEditError("Add an amount per person greater than $0.");
        return;
      }

      if (
        spots === undefined ||
        Number.isNaN(spots) ||
        spots < Math.max(1, claimedMoneySpots) ||
        !Number.isInteger(spots)
      ) {
        setEditError("Available spots must cover the spots already claimed.");
        return;
      }
    }

    setEditError("");

    onEdit?.(item, {
      title: title.trim(),
      category,
      itemType,
      description: description.trim() || undefined,
      quantity: itemType === "bring" && quantity ? Number(quantity) : undefined,
      amountPerPerson: itemType === "money" ? amount : undefined,
      totalSpots: itemType === "money" ? spots : undefined,
      isRequired
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border border-olive/18 bg-stone/70 p-4">
        <div className="grid gap-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          <Select
            value={itemType}
            onChange={(event) => setItemType(event.target.value as ChecklistItemType)}
          >
            <option value="bring">Bring item</option>
            <option value="money">Pitch-in money</option>
          </Select>
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
              disabled={itemType === "money"}
            />
          </div>
          {itemType === "money" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={amountPerPerson}
                onChange={(event) => setAmountPerPerson(event.target.value)}
                type="number"
                min="1"
                step="1"
                placeholder="Amount per person"
              />
              <Input
                value={totalSpots}
                onChange={(event) => setTotalSpots(event.target.value)}
                type="number"
                min={Math.max(1, claimedMoneySpots)}
                step="1"
                placeholder="Available spots"
              />
            </div>
          ) : null}
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
            Needed for the gathering
          </label>
          {editError ? <p className="text-sm font-semibold text-terracotta">{editError}</p> : null}
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
        "rounded-lg border bg-cream p-4 shadow-sm",
        claimed ? "border-olive/18" : "border-ink/8"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{item.title}</p>
            {isMoneyItem && item.amountPerPerson ? (
              <Badge tone="neutral">${item.amountPerPerson} each</Badge>
            ) : null}
            {!isMoneyItem && item.quantity ? <Badge tone="neutral">x{item.quantity}</Badge> : null}
            {!item.isRequired ? <Badge tone="neutral">nice to have</Badge> : null}
          </div>
          {item.description ? <p className="mt-1 text-sm text-ink/60">{item.description}</p> : null}
        </div>
        <Badge tone={claimed ? "claimed" : "open"}>
          {isMoneyItem ? `${claimedMoneySpots}/${totalMoneySpots}` : claimed ? "Claimed" : "Open"}
        </Badge>
      </div>

      <div className="mt-3 rounded-lg bg-stone/70 p-3 text-sm">
        {isMoneyItem ? (
          <div>
            <p className={cn("font-medium", moneyItemIsFull ? "text-olive" : "text-terracotta")}>
              <DollarSign className="mr-1 inline h-4 w-4" aria-hidden="true" />
              {claimedMoneySpots} of {totalMoneySpots} claimed
            </p>
            <p className="mt-1 text-ink/65">
              {moneySpotsLeft > 0
                ? `${moneySpotsLeft} ${moneySpotsLeft === 1 ? "spot" : "spots"} left`
                : "All spots claimed"}
            </p>
            {moneyClaims.length > 0 ? (
              <p className="mt-1 text-ink/65">
                Claimed by {moneyClaims.map((claim) => claim.guestName).join(", ")}
              </p>
            ) : null}
          </div>
        ) : claimed ? (
          <p className="font-medium text-olive">
            <CheckCircle2 className="mr-1 inline h-4 w-4" aria-hidden="true" />
            {item.claimedByName} is bringing this
          </p>
        ) : (
          <p className="font-medium text-terracotta">Still needed</p>
        )}
        {item.claimNote ? <p className="mt-1 text-ink/65">{item.claimNote}</p> : null}
      </div>

      {!hostControls && onClaim ? (
        <div className="mt-3 grid gap-2">
          {(!claimed || claimedByCurrentGuest) && !currentGuestMoneyClaim && (
            <Input
              value={claimNote}
              onChange={(event) => setClaimNote(event.target.value)}
              placeholder={isMoneyItem ? "Optional note" : "Add a note, like 'bringing brownies'"}
            />
          )}
          {paymentUrl ? (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition",
                theme.cta
              )}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Pay with Venmo
            </a>
          ) : null}
          <Button
            type="button"
            variant={claimedByCurrentGuest || currentGuestMoneyClaim ? "secondary" : "default"}
            className={claimedByCurrentGuest || currentGuestMoneyClaim ? undefined : theme.cta}
            onClick={handleClaim}
            disabled={
              isMoneyItem
                ? Boolean(currentGuestMoneyClaim) || moneyItemIsFull
                : claimed && !claimedByCurrentGuest
            }
          >
            {isMoneyItem
              ? currentGuestMoneyClaim
                ? "Spot claimed"
                : moneyItemIsFull
                  ? "All spots claimed"
                  : "I'll chip in"
              : claimedByCurrentGuest
                ? "Update note"
                : "I'll bring this"}
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
