"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, RefreshCw, X } from "lucide-react";
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
  message,
  onClaim,
  onRemoveClaim,
  onBlockedClaim,
  onComplete
}: {
  event?: DinnerEvent;
  items: ChecklistItem[];
  currentGuest?: Guest;
  message?: string;
  onClaim: (item: ChecklistItem) => void;
  onRemoveClaim: (item: ChecklistItem) => void;
  onBlockedClaim: () => void;
  onComplete?: () => void;
}) {
  const theme = getEventTheme(event?.coverStyle);
  const [isChangingClaim, setIsChangingClaim] = useState(false);
  const ownClaim = items.find((item) => guestOwnsItem(item, currentGuest));
  const availableItems = items.filter((item) => itemIsAvailable(item, currentGuest));
  const claimedItems = items.filter((item) => itemIsClaimedBySomeoneElse(item, currentGuest));
  const canClaim = currentGuest?.rsvpStatus === "yes";

  function handleClaim(item: ChecklistItem) {
    if (!canClaim) {
      onBlockedClaim();
      return;
    }

    setIsChangingClaim(false);
    onClaim(item);
  }

  function handleRemoveClaim(item: ChecklistItem) {
    setIsChangingClaim(false);
    onRemoveClaim(item);
  }

  return (
    <Card className={cn("border", theme.accentBorder)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
          What can you bring?
        </CardTitle>
        <p className="text-sm text-ink/60">
          See what is still open, then claim one item once your RSVP is in.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {message ? (
          <p className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
            {message}
          </p>
        ) : null}

        {ownClaim ? (
          <div className={cn("rounded-lg p-4", theme.softPanel)}>
            <p className="flex items-center gap-2 text-sm font-semibold text-olive">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              You&apos;re bringing: {ownClaim.title}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsChangingClaim((value) => !value)}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Change
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveClaim(ownClaim)}>
                <X className="h-4 w-4" aria-hidden="true" />
                Remove claim
              </Button>
            </div>
          </div>
        ) : null}

        {availableItems.length > 0 && (!ownClaim || isChangingClaim) ? (
          <section className="space-y-3" aria-labelledby="available-contributions-heading">
            <h3 id="available-contributions-heading" className="text-lg font-semibold">
              Available to claim
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {availableItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-ink/8 bg-cream p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-ink/60">{itemDetail(item)}</p>
                    </div>
                    <Badge tone="open">Open</Badge>
                  </div>
                  <Button
                    type="button"
                    variant={canClaim ? "default" : "secondary"}
                    className={cn("mt-3 w-full", canClaim && theme.cta)}
                    onClick={() => handleClaim(item)}
                  >
                    {canClaim ? "Claim this" : "RSVP to claim"}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {availableItems.length === 0 && !ownClaim ? (
          <EmptyState title="Everything is claimed" description="The board is full for now." />
        ) : null}

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

        {ownClaim && !isChangingClaim && onComplete ? (
          <div className="flex justify-end border-t border-ink/8 pt-4">
            <Button type="button" className={cn(theme.cta)} onClick={onComplete}>
              Done
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
