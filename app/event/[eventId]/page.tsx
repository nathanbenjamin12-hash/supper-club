"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUp, Send, UsersRound } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/EventHero";
import { GuestContributionCard } from "@/components/GuestContributionCard";
import { GuestList } from "@/components/GuestList";
import { PitchInCard } from "@/components/PitchInCard";
import { RSVPCard } from "@/components/RSVPCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ChecklistItem, EventBundle, Guest, GuestDraft } from "@/types/events";
import {
  claimSharedChecklistItem,
  createSharedGuest,
  getSharedEventBundle,
  importSharedEventBundle,
  releaseSharedChecklistItemClaim,
  updateSharedGuest
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

function isMoneyItem(item: ChecklistItem) {
  return (item.itemType ?? "bring") === "money";
}

function claimedSlotCount(item: ChecklistItem) {
  return isMoneyItem(item) ? item.moneyClaims?.length ?? 0 : item.claimedByGuestId ? 1 : 0;
}

function totalSlotCount(item: ChecklistItem) {
  return isMoneyItem(item) ? item.totalSpots ?? 1 : 1;
}

type ContributionChoice = "bring" | "later";

export default function PublicEventPage() {
  const params = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [currentGuest, setCurrentGuest] = useState<Guest | undefined>();
  const [showContributions, setShowContributions] = useState(false);
  const [selectedContributionIds, setSelectedContributionIds] = useState<string[]>([]);
  const [isUpdatingResponse, setIsUpdatingResponse] = useState(false);
  const [isEditingContributions, setIsEditingContributions] = useState(false);
  const [deferContributionSubmit, setDeferContributionSubmit] = useState(false);
  const [guestListExpanded, setGuestListExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const inviteParam = searchParams.get("invite");

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

  function guestClaimIds(checklistItems: ChecklistItem[], guest: Guest) {
    return checklistItems.filter((item) => guestOwnsItem(item, guest)).map((item) => item.id);
  }

  async function saveContributionSelection(guest: Guest, startingBundle: EventBundle, nextItemIds: string[]) {
    const currentClaimIds = guestClaimIds(startingBundle.checklistItems, guest);
    const nextClaimIds = Array.from(new Set(nextItemIds));
    const releaseIds = currentClaimIds.filter((itemId) => !nextClaimIds.includes(itemId));
    const claimIds = nextClaimIds.filter((itemId) => !currentClaimIds.includes(itemId));
    let nextBundle = startingBundle;
    let blockedClaimCount = 0;

    for (const itemId of releaseIds) {
      const response = await releaseSharedChecklistItemClaim(eventId, itemId, guest.id);

      if (response?.bundle) {
        nextBundle = response.bundle;
      }
    }

    for (const itemId of claimIds) {
      const response = await claimSharedChecklistItem(eventId, itemId, guest.id);

      if (response?.bundle) {
        nextBundle = response.bundle;
      }

      if (!response?.item || !guestOwnsItem(response.item, guest)) {
        blockedClaimCount += 1;
      }
    }

    return { bundle: nextBundle, blockedClaimCount };
  }

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
    setShowContributions(false);
    setIsEditingContributions(false);
    setDeferContributionSubmit(false);
    setSelectedContributionIds([]);
    setMessage(
      selectedContributionIds.length > 0 && claimedCount < selectedContributionIds.length
        ? "Some selected items were claimed before your RSVP was sent."
        : ""
    );
    return savedGuest;
  }

  async function handleUpdateRsvp(
    draft: GuestDraft,
    options?: { saveContributionSelection?: boolean }
  ) {
    if (!currentGuest) {
      return undefined;
    }

    const response = await updateSharedGuest(eventId, currentGuest.id, draft);

    if (!response) {
      return undefined;
    }

    let nextBundle = response.bundle;
    let blockedClaimCount = 0;

    if (draft.rsvpStatus !== "yes") {
      const result = await saveContributionSelection(response.guest, nextBundle, []);
      nextBundle = result.bundle;
      blockedClaimCount = result.blockedClaimCount;
    } else if (options?.saveContributionSelection) {
      const result = await saveContributionSelection(response.guest, nextBundle, selectedContributionIds);
      nextBundle = result.bundle;
      blockedClaimCount = result.blockedClaimCount;
    }

    const savedGuest = nextBundle.guests.find((guest) => guest.id === response.guest.id) ?? response.guest;

    setCurrentGuest(savedGuest);
    setBundle(nextBundle);
    setShowContributions(false);
    setIsEditingContributions(false);
    setDeferContributionSubmit(false);
    setIsUpdatingResponse(false);
    setSelectedContributionIds([]);
    setMessage(
      blockedClaimCount > 0
        ? "Some selected items were claimed before your changes were saved."
        : ""
    );

    return savedGuest;
  }

  function handleContributionChoice(showContributions: boolean, choice?: ContributionChoice) {
    setShowContributions(showContributions);
    setIsEditingContributions(false);
    setDeferContributionSubmit(showContributions && choice === "bring");
    setMessage("");
    if (!showContributions) {
      setSelectedContributionIds([]);
      return;
    }

    if (isUpdatingResponse && currentGuest && bundle) {
      setSelectedContributionIds(guestClaimIds(bundle.checklistItems, currentGuest));
    }
  }

  function handleUpdateModeChange(isUpdating: boolean) {
    setIsUpdatingResponse(isUpdating);
    setShowContributions(false);
    setIsEditingContributions(false);
    setDeferContributionSubmit(false);
    setSelectedContributionIds([]);
    setMessage("");
  }

  function handleEditContributions() {
    setIsEditingContributions(true);
    setShowContributions(false);
    setIsUpdatingResponse(false);
    setDeferContributionSubmit(false);
    setSelectedContributionIds([]);
    setMessage("");
  }

  function handleCancelContributionEditing() {
    setIsEditingContributions(false);
    setMessage("");
  }

  function handleToggleContributionSelection(item: ChecklistItem) {
    setSelectedContributionIds((currentIds) =>
      currentIds.includes(item.id)
        ? currentIds.filter((itemId) => itemId !== item.id)
        : [...currentIds, item.id]
    );
  }

  async function handleSaveContributionChanges(nextItemIds: string[]) {
    if (!currentGuest || !bundle) {
      return;
    }

    const { bundle: nextBundle, blockedClaimCount } = await saveContributionSelection(
      currentGuest,
      bundle,
      nextItemIds
    );

    setBundle(nextBundle);
    setIsEditingContributions(false);
    setMessage(
      blockedClaimCount > 0
        ? "Some selected items were claimed before your changes were saved."
        : "Your contribution choices were saved."
    );
  }

  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  const maybeGuests = bundle.guests.filter((guest) => guest.rsvpStatus === "maybe");
  const guestNotes = bundle.guests
    .filter((guest) => guest.rsvpStatus === "yes" || guest.rsvpStatus === "maybe")
    .map((guest) => ({
      id: guest.id,
      name: guest.name,
      note: guest.dietaryRestrictions?.trim() ?? ""
    }))
    .filter((guestNote) => guestNote.note.length > 0);
  const bringItems = bundle.checklistItems.filter((item) => !isMoneyItem(item));
  const moneyItems = bundle.checklistItems.filter(isMoneyItem);
  const claimedBringItems = bringItems.reduce((total, item) => total + claimedSlotCount(item), 0);
  const totalBringItems = bringItems.reduce((total, item) => total + totalSlotCount(item), 0);
  const claimedPitchInSpots = moneyItems.reduce((total, item) => total + claimedSlotCount(item), 0);
  const totalPitchInSpots = moneyItems.reduce((total, item) => total + totalSlotCount(item), 0);
  const theme = getEventTheme(bundle.event.coverStyle);
  const isHostPreview = searchParams.get("preview") === "host";
  const claimedItems = currentGuest
    ? bundle.checklistItems.filter((item) => guestOwnsItem(item, currentGuest))
    : [];
  const selectedItems = bundle.checklistItems.filter((item) => selectedContributionIds.includes(item.id));
  const shouldShowContributionSelection = showContributions && (!currentGuest || isUpdatingResponse);
  const shouldShowContributionEditor =
    Boolean(currentGuest && !isUpdatingResponse && isEditingContributions && currentGuest.rsvpStatus === "yes");
  const shouldShowContributionOptions = shouldShowContributionSelection || shouldShowContributionEditor;
  const shouldDeferContributionSubmit = shouldShowContributionSelection && deferContributionSubmit;
  const rsvpFormId = "guest-rsvp-form";

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
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <EventHero event={bundle.event} />

            <Card className={cn("border", theme.accentBorder)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersRound className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                  Who&apos;s coming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={cn("rounded-lg p-3", theme.softPanel)}>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">Going</p>
                    <p className="mt-1 text-2xl font-semibold">{yesGuests.length}</p>
                  </div>
                  {maybeGuests.length > 0 ? (
                    <div className={cn("rounded-lg p-3", theme.softPanel)}>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">Maybe</p>
                      <p className="mt-1 text-2xl font-semibold">{maybeGuests.length}</p>
                    </div>
                  ) : null}
                  <div className={cn("rounded-lg p-3", theme.softPanel)}>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
                      Contributions
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      {claimedBringItems}/{totalBringItems}
                    </p>
                    <p className="mt-1 text-sm text-ink/60">items claimed</p>
                  </div>
                  {bundle.event.pitchInEnabled ? (
                    <div className={cn("rounded-lg p-3", theme.softPanel)}>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">Pitch-in</p>
                      <p className="mt-1 text-2xl font-semibold">
                        {claimedPitchInSpots}/{totalPitchInSpots}
                      </p>
                      <p className="mt-1 text-sm text-ink/60">spots claimed</p>
                    </div>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setGuestListExpanded((expanded) => !expanded)}
                >
                  {guestListExpanded ? "Hide guest list" : "View guest list"}
                </Button>

                {guestListExpanded ? (
                  <GuestList
                    guests={bundle.guests}
                    checklistItems={bundle.checklistItems}
                    showDietaryDetails={false}
                  />
                ) : null}
              </CardContent>
            </Card>

            <RSVPCard
              event={bundle.event}
              currentGuest={currentGuest}
              claimedItems={claimedItems}
              selectedItems={selectedItems}
              onSubmit={handleRsvp}
              onUpdate={handleUpdateRsvp}
              onUpdateModeChange={handleUpdateModeChange}
              onContributionChoice={handleContributionChoice}
              onClearContributionSelection={() => setSelectedContributionIds([])}
              onEditContributions={currentGuest?.rsvpStatus === "yes" ? handleEditContributions : undefined}
              statusMessage={message}
              deferSubmitButton={shouldDeferContributionSubmit}
              formId={rsvpFormId}
            />

            {guestNotes.length > 0 ? (
              <Card className={cn("border", theme.accentBorder)}>
                <CardHeader>
                  <CardTitle>Guest notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {guestNotes.map((guestNote) => (
                    <div key={guestNote.id} className={cn("rounded-lg p-3", theme.softPanel)}>
                      <p className="font-semibold">{guestNote.name}</p>
                      <p className="mt-1 text-sm text-ink/70">{guestNote.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {shouldShowContributionOptions ? (
              <GuestContributionCard
                event={bundle.event}
                items={bundle.checklistItems}
                currentGuest={currentGuest}
                selectionMode={shouldShowContributionSelection}
                selectedItemIds={selectedContributionIds}
                message={message}
                onToggleSelection={handleToggleContributionSelection}
                onSaveClaims={handleSaveContributionChanges}
                onCancelEditing={handleCancelContributionEditing}
              />
            ) : null}

            {shouldDeferContributionSubmit ? (
              <Button type="submit" form={rsvpFormId} className={cn("w-full", theme.cta)} variant="default">
                <Send className="h-4 w-4" aria-hidden="true" />
                {isUpdatingResponse ? "Save changes" : "Send RSVP"}
              </Button>
            ) : null}
          </div>

          <aside className="space-y-5">
            {shouldShowContributionOptions ? (
              <PitchInCard event={bundle.event} />
            ) : null}
          </aside>
        </div>

        {currentGuest ? (
          <div className="mt-6 flex justify-center">
            <Button type="button" variant="ghost" size="sm" onClick={handleBackToTop}>
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Back to top
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
