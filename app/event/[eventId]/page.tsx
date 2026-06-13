"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, ClipboardList, MessageCircleHeart, Utensils, UsersRound } from "lucide-react";
import { ChecklistBoard } from "@/components/ChecklistBoard";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/EventHero";
import { GuestList } from "@/components/GuestList";
import { HostFlowNav } from "@/components/HostFlowNav";
import { PitchInCard } from "@/components/PitchInCard";
import { RSVPCard } from "@/components/RSVPCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { ChecklistItem, EventBundle, Guest, GuestDraft } from "@/types/events";
import { claimChecklistItem, createGuest, getEventBundle } from "@/lib/events";
import { getEventTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function PublicEventPage() {
  const params = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [currentGuest, setCurrentGuest] = useState<Guest | undefined>();
  const [showContributions, setShowContributions] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  function reload() {
    setBundle(getEventBundle(eventId));
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBundle(getEventBundle(eventId));
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [eventId]);

  function handleRsvp(draft: GuestDraft) {
    const guest = createGuest(eventId, draft);
    setCurrentGuest(guest);
    setShowContributions(false);
    reload();
    return guest;
  }

  function handleClaim(item: ChecklistItem, note?: string) {
    if (!currentGuest) {
      return;
    }

    const previousMoneyClaimCount = item.moneyClaims?.length ?? 0;
    const updated = claimChecklistItem(item.id, currentGuest.id, note);

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
    reload();
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

  return (
    <main className={cn("min-h-screen", theme.pageBackground)}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {isHostPreview ? (
          <HostFlowNav
            eventId={eventId}
            currentStep="preview"
            backHref={`/event/${eventId}/host`}
            backLabel="Back to Setup & Share"
          />
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

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
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

            {showContributions && currentGuest?.rsvpStatus === "yes" ? (
              <Card className={cn("border", theme.accentBorder)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                    Pick a contribution
                  </CardTitle>
                  <p className="text-sm text-ink/60">
                    Claim an open item or chip in for a shared cost.
                  </p>
                </CardHeader>
                <CardContent>
                  {message ? (
                    <p className={cn("mb-4 rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
                      {message}
                    </p>
                  ) : null}
                  <ChecklistBoard
                    items={bundle.checklistItems}
                    event={bundle.event}
                    currentGuest={currentGuest}
                    onClaim={handleClaim}
                    onBlockedClaim={() => setMessage("Send your RSVP first, then you can claim an item.")}
                  />
                </CardContent>
              </Card>
            ) : null}
          </div>

          <aside className="space-y-5">
            <RSVPCard
              event={bundle.event}
              onSubmit={handleRsvp}
              onContributionChoice={setShowContributions}
            />
            {showContributions && currentGuest?.rsvpStatus === "yes" ? (
              <PitchInCard event={bundle.event} />
            ) : null}
            <Card className={cn("border", theme.accentBorder)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                  Dietary note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-ink/65">
                  Share restrictions, allergies, or a note when you RSVP so {bundle.event.hostName}
                  can plan with everyone in mind.
                </p>
              </CardContent>
            </Card>
            <Card className={cn("border", theme.accentBorder)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleHeart className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                  Host note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-ink/65">
                  Public invite links are open to anyone with the link for this MVP.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
