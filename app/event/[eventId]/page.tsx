"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, UsersRound } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/EventHero";
import { GuestContributionCard } from "@/components/GuestContributionCard";
import { GuestList } from "@/components/GuestList";
import { PitchInCard } from "@/components/PitchInCard";
import { RSVPCard } from "@/components/RSVPCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { ChecklistItem, EventBundle, Guest, GuestDraft } from "@/types/events";
import {
  claimSharedChecklistItem,
  createSharedGuest,
  getSharedEventBundle,
  importSharedEventBundle,
  releaseSharedChecklistItemClaim
} from "@/lib/eventApi";
import { decodeInviteBundle } from "@/lib/inviteLinks";
import { getEventTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

function currentGuestStorageKey(eventId: string) {
  return `supperclub.currentGuest.${eventId}`;
}

function guestOwnsItem(item: ChecklistItem, guest?: Guest) {
  if (!guest) {
    return false;
  }

  return (item.itemType ?? "bring") === "money"
    ? item.moneyClaims?.some((claim) => claim.guestId === guest.id) ?? false
    : item.claimedByGuestId === guest.id;
}

export default function PublicEventPage() {
  const params = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [currentGuest, setCurrentGuest] = useState<Guest | undefined>();
  const [showContributions, setShowContributions] = useState(false);
  const [selectedContributionIds, setSelectedContributionIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const inviteParam = searchParams.get("invite");

  async function reload() {
    setBundle(await getSharedEventBundle(eventId));
  }

  useEffect(() => {
    let active = true;

    async function loadBundle() {
      let nextBundle = await getSharedEventBundle(eventId);
      const inviteBundle = decodeInviteBundle(inviteParam, eventId);

      if (!nextBundle && inviteBundle) {
        nextBundle = await importSharedEventBundle(inviteBundle);
      }

      if (!active) {
        return;
      }

      setBundle(nextBundle);
      if (nextBundle) {
        const storedGuestId = window.localStorage.getItem(currentGuestStorageKey(eventId));
        const storedGuest = nextBundle.guests.find((guest) => guest.id === storedGuestId);

        if (storedGuest) {
          setCurrentGuest(storedGuest);
        } else if (storedGuestId) {
          window.localStorage.removeItem(currentGuestStorageKey(eventId));
        }
      }
      setLoaded(true);
    }

    void loadBundle();

    return () => {
      active = false;
    };
  }, [eventId, inviteParam]);

  async function handleRsvp(draft: GuestDraft) {
    const response = await createSharedGuest(eventId, draft);

    if (!response) {
      return undefined;
    }

    let nextBundle = response.bundle;
    let claimedCount = 0;

    if (draft.rsvpStatus === "yes" && selectedContributionIds.length > 0) {
      for (const itemId of selectedContributionIds) {
        const claimResponse = await claimSharedChecklistItem(eventId, itemId, response.guest.id);

        if (claimResponse?.bundle) {
          nextBundle = claimResponse.bundle;
          const claimedItem = claimResponse.item;
          const guestClaimedItem =
            (claimedItem.itemType ?? "bring") === "money"
              ? claimedItem.moneyClaims?.some((claim) => claim.guestId === response.guest.id) ?? false
              : claimedItem.claimedByGuestId === response.guest.id;

          if (guestClaimedItem) {
            claimedCount += 1;
          }
        }
      }
    }

    const savedGuest = nextBundle.guests.find((guest) => guest.id === response.guest.id) ?? response.guest;

    setCurrentGuest(savedGuest);
    window.localStorage.setItem(currentGuestStorageKey(eventId), response.guest.id);
    setBundle(nextBundle);
    setShowContributions(draft.rsvpStatus === "yes");
    setSelectedContributionIds([]);
    setMessage(
      selectedContributionIds.length > 0 && claimedCount < selectedContributionIds.length
        ? "Some selected items were claimed before your RSVP was sent."
        : ""
    );
    return savedGuest;
  }

  function handleContributionChoice(showContributions: boolean) {
    setShowContributions(showContributions);
    setMessage("");
    if (!showContributions) {
      setSelectedContributionIds([]);
    }
  }

  function handleToggleContributionSelection(item: ChecklistItem) {
    setSelectedContributionIds((currentIds) =>
      currentIds.includes(item.id)
        ? currentIds.filter((itemId) => itemId !== item.id)
        : [...currentIds, item.id]
    );
  }

  function handleStartNewRsvp() {
    window.localStorage.removeItem(currentGuestStorageKey(eventId));
    setCurrentGuest(undefined);
    setShowContributions(false);
    setSelectedContributionIds([]);
    setMessage("");
  }

  async function handleClaim(item: ChecklistItem, note?: string) {
    if (!currentGuest) {
      return;
    }

    const previousMoneyClaimCount = item.moneyClaims?.length ?? 0;
    const response = await claimSharedChecklistItem(eventId, item.id, currentGuest.id, note);
    const updated = response?.item;
    const nextBundle = response?.bundle;

    if ((item.itemType ?? "bring") === "money") {
      const nextMoneyClaimCount = updated?.moneyClaims?.length ?? previousMoneyClaimCount;
      const alreadyClaimed = item.moneyClaims?.some((claim) => claim.guestId === currentGuest.id);

      if (nextMoneyClaimCount > previousMoneyClaimCount) {
        setMessage("Spot claimed. The board is updated.");
      } else if (alreadyClaimed) {
        setMessage("You already claimed a spot for that.");
      } else {
        setMessage("All pitch-in spots are claimed.");
      }
    } else {
      setMessage(
        updated?.claimedByGuestId === currentGuest.id
          ? "Perfect. The board is updated."
          : "Looks like someone claimed that first."
      );
    }
    if (nextBundle) {
      setBundle(nextBundle);
    } else {
      await reload();
    }
  }

  async function handleRemoveClaim(item: ChecklistItem) {
    if (!currentGuest) {
      return;
    }

    const response = await releaseSharedChecklistItemClaim(eventId, item.id, currentGuest.id);

    setMessage("Your claim was removed.");
    if (response?.bundle) {
      setBundle(response.bundle);
    } else {
      await reload();
    }
  }

  if (loaded && !bundle) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Invite not found"
          description="Check the link or ask the host to send it again."
        />
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-5")}>
          Go home
        </Link>
      </main>
    );
  }

  if (!bundle) {
    return null;
  }

  const yesGuests = bundle.guests.filter((guest) => guest.rsvpStatus === "yes");
  const theme = getEventTheme(bundle.event.coverStyle);
  const isHostPreview = searchParams.get("preview") === "host";
  const claimedItems = currentGuest
    ? bundle.checklistItems.filter((item) => guestOwnsItem(item, currentGuest))
    : [];
  const selectedItems = bundle.checklistItems.filter((item) => selectedContributionIds.includes(item.id));
  const shouldShowContributionOptions = showContributions || currentGuest?.rsvpStatus === "yes";

  return (
    <main className={cn("min-h-screen", theme.pageBackground)}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {isHostPreview ? (
          <Link
            href={`/event/${eventId}/host`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-5 bg-cream/65 backdrop-blur"
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Event Home
          </Link>
        ) : (
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-5 bg-cream/65 backdrop-blur"
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Supper Club
          </Link>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <EventHero event={bundle.event} />

            <Card className={cn("border", theme.accentBorder)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersRound className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                  Who&apos;s coming
                </CardTitle>
                <p className="text-sm text-ink/60">
                  {yesGuests.length} {yesGuests.length === 1 ? "person is" : "people are"} in so far.
                </p>
              </CardHeader>
              <CardContent>
                <GuestList guests={bundle.guests} checklistItems={bundle.checklistItems} />
              </CardContent>
            </Card>

            <RSVPCard
              event={bundle.event}
              currentGuest={currentGuest}
              claimedItems={claimedItems}
              selectedItems={selectedItems}
              onSubmit={handleRsvp}
              onStartNewRsvp={handleStartNewRsvp}
              onContributionChoice={handleContributionChoice}
              onClearContributionSelection={() => setSelectedContributionIds([])}
            />

            {shouldShowContributionOptions ? (
              <GuestContributionCard
                event={bundle.event}
                items={bundle.checklistItems}
                currentGuest={currentGuest}
                selectionMode={!currentGuest}
                selectedItemIds={selectedContributionIds}
                message={message}
                onToggleSelection={handleToggleContributionSelection}
                onClaim={handleClaim}
                onRemoveClaim={handleRemoveClaim}
                onBlockedClaim={() => setMessage("Send your RSVP first, then you can claim an item.")}
              />
            ) : null}
          </div>

          <aside className="space-y-5">
            {shouldShowContributionOptions ? (
              <PitchInCard event={bundle.event} />
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
