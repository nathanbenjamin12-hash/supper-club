"use client";

import { useState } from "react";
import { ArrowUp, CheckCircle2, ClipboardList, RefreshCw } from "lucide-react";
import type { ChecklistItem, DinnerEvent, Guest } from "@/types/events";
import { getEventTheme } from "@/lib/themes";
import { categoryLabels, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";

function isMoneyItem(item: ChecklistItem) {
  return (item.itemType ?? "bring") === "money";
}

function guestOwnsItem(item: ChecklistItem, guest?: Guest) {
  if (!guest) {
    return false;
  }

  return isMoneyItem(item)
    ? item.moneyClaims?.some((claim) => claim.guestId === guest.id) ?? false
    : item.claimedByGuestId === guest.id;
}

function itemIsAvailable(item: ChecklistItem, guest?: Guest) {
  if (guestOwnsItem(item, guest)) {
    return false;
  }

  if (isMoneyItem(item)) {
    return (item.moneyClaims?.length ?? 0) < (item.totalSpots ?? 1);
  }

  return !item.claimedByGuestId;
}

function itemIsClaimedBySomeoneElse(item: ChecklistItem, guest?: Guest) {
  if (guestOwnsItem(item, guest)) {
    return false;
  }

  if (isMoneyItem(item)) {
    return (item.moneyClaims?.length ?? 0) >= (item.totalSpots ?? 1);
  }

  return Boolean(item.claimedByGuestId);
}

function itemDetail(item: ChecklistItem) {
  if (isMoneyItem(item)) {
    const claimedSpots = item.moneyClaims?.length ?? 0;
    const totalSpots = item.totalSpots ?? 1;
    return `${Math.max(totalSpots - claimedSpots, 0)} of ${totalSpots} spots left`;
  }

  return categoryLabels[item.category];
}

function claimedDetail(item: ChecklistItem) {
  if (isMoneyItem(item)) {
    const names = item.moneyClaims?.map((claim) => claim.guestName).join(", ");
    return names ? `Claimed by ${names}` : "Already claimed";
  }

  return item.claimedByName ? `${item.claimedByName} is bringing this` : "Already claimed";
}

export function GuestContributionCard({
  event,
  items,
  currentGuest,
  selectionMode = false,
  selectedItemIds = [],
  message,
  onToggleSelection,
  onSaveClaims,
  onBackToTop
}: {
  event?: DinnerEvent;
  items: ChecklistItem[];
  currentGuest?: Guest;
  selectionMode?: boolean;
  selectedItemIds?: string[];
  message?: string;
  onToggleSelection?: (item: ChecklistItem) => void;
  onSaveClaims?: (itemIds: string[]) => void | Promise<void>;
  onBackToTop?: () => void;
}) {
  const theme = getEventTheme(event?.coverStyle);
  const [isEditingClaims, setIsEditingClaims] = useState(false);
  const [draftItemIds, setDraftItemIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const ownClaims = items.filter((item) => guestOwnsItem(item, currentGuest));
  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
  const availableItems = items.filter((item) => itemIsAvailable(item, currentGuest));
  const claimedItems = items.filter((item) => itemIsClaimedBySomeoneElse(item, currentGuest));
  const editableItems = items.filter((item) => guestOwnsItem(item, currentGuest) || itemIsAvailable(item, currentGuest));
  const selectionItems = selectionMode && currentGuest ? editableItems : availableItems;
  const ownClaimIds = ownClaims.map((item) => item.id);

  function itemIsSelected(item: ChecklistItem) {
    return selectedItemIds.includes(item.id);
  }

  function draftItemIsSelected(item: ChecklistItem) {
    return draftItemIds.includes(item.id);
  }

  function toggleDraftItem(item: ChecklistItem) {
    setDraftItemIds((currentIds) =>
      currentIds.includes(item.id)
        ? currentIds.filter((itemId) => itemId !== item.id)
        : [...currentIds, item.id]
    );
  }

  function startEditingClaims() {
    setDraftItemIds(ownClaimIds);
    setIsEditingClaims(true);
  }

  function cancelEditingClaims() {
    setDraftItemIds(ownClaimIds);
    setIsEditingClaims(false);
  }

  async function saveClaimChanges() {
    setIsSaving(true);

    try {
      await onSaveClaims?.(draftItemIds);
      setIsEditingClaims(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className={cn("border", theme.accentBorder)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
          What can you bring?
        </CardTitle>
        <p className="text-sm text-ink/60">
          {selectionMode
            ? "Choose anything you'd like to bring before sending your RSVP."
            : "See what is still open, then manage the items you're bringing."}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {message ? (
          <p className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
            {message}
          </p>
        ) : null}

        {selectionMode ? (
          <>
            {selectedItems.length > 0 ? (
              <div className={cn("rounded-lg p-4", theme.softPanel)}>
                <p className="flex items-center gap-2 text-sm font-semibold text-olive">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Selected to bring:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/70">
                  {selectedItems.map((item) => (
                    <li key={item.id}>{item.title}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selectionItems.length > 0 ? (
              <section className="space-y-3" aria-labelledby="available-contributions-heading">
                <h3 id="available-contributions-heading" className="text-lg font-semibold">
                  {currentGuest ? "Your options" : "Available to claim"}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectionItems.map((item) => {
                    const selected = itemIsSelected(item);

                    return (
                      <div key={item.id} className="rounded-lg border border-ink/8 bg-cream p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold">{item.title}</p>
                            <p className="mt-1 text-sm text-ink/60">{itemDetail(item)}</p>
                          </div>
                          <Badge tone={selected ? "claimed" : "open"}>{selected ? "Selected" : "Open"}</Badge>
                        </div>
                        <Button
                          type="button"
                          variant={selected ? "secondary" : "default"}
                          className={cn("mt-3 w-full", !selected && theme.cta)}
                          aria-pressed={selected}
                          onClick={() => onToggleSelection?.(item)}
                        >
                          {selected ? "Remove from RSVP" : "Select this"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : (
              <EmptyState title="Everything is claimed" description="The board is full for now." />
            )}
          </>
        ) : (
          <>
            {!isEditingClaims ? (
              <div className={cn("rounded-lg p-4", theme.softPanel)}>
                <p className="flex items-center gap-2 text-sm font-semibold text-olive">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  You&apos;re bringing:
                </p>
                {ownClaims.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/70">
                    {ownClaims.map((item) => (
                      <li key={item.id}>{item.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-ink/65">Nothing yet.</p>
                )}
                {editableItems.length > 0 ? (
                  <div className="mt-3">
                    <Button type="button" variant="secondary" size="sm" onClick={startEditingClaims}>
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      Change what I&apos;m bringing
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <section className="space-y-3" aria-labelledby="edit-contributions-heading">
                <div>
                  <h3 id="edit-contributions-heading" className="text-lg font-semibold">
                    Change what I&apos;m bringing
                  </h3>
                  <p className="mt-1 text-sm text-ink/60">
                    Select or unselect anything available, then save once.
                  </p>
                </div>

                {editableItems.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {editableItems.map((item) => {
                      const selected = draftItemIsSelected(item);

                      return (
                        <div key={item.id} className="rounded-lg border border-ink/8 bg-cream p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold">{item.title}</p>
                              <p className="mt-1 text-sm text-ink/60">{itemDetail(item)}</p>
                            </div>
                            <Badge tone={selected ? "claimed" : "open"}>{selected ? "Selected" : "Open"}</Badge>
                          </div>
                          <Button
                            type="button"
                            variant={selected ? "secondary" : "default"}
                            className={cn("mt-3 w-full", !selected && theme.cta)}
                            aria-pressed={selected}
                            onClick={() => toggleDraftItem(item)}
                          >
                            {selected ? "Remove from list" : "Select this"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState title="Everything is claimed" description="The board is full for now." />
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="default"
                    className={cn(theme.cta)}
                    onClick={saveClaimChanges}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save changes"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={cancelEditingClaims} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              </section>
            )}
          </>
        )}

        {claimedItems.length > 0 ? (
          <section className="space-y-3" aria-labelledby="claimed-contributions-heading">
            <h3 id="claimed-contributions-heading" className="text-lg font-semibold">
              Already claimed
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {claimedItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-olive/18 bg-cream p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-ink/60">{claimedDetail(item)}</p>
                    </div>
                    <Badge tone="claimed">Claimed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {!selectionMode && !isEditingClaims && onBackToTop ? (
          <Button type="button" variant="ghost" size="sm" onClick={onBackToTop}>
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            Back to top
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
