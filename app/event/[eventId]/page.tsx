"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, ClipboardList, Send, UsersRound } from "lucide-react";
import { ChecklistBoard } from "@/components/ChecklistBoard";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/EventHero";
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
  importSharedEventBundle
} from "@/lib/eventApi";
import { decodeInviteBundle } from "@/lib/inviteLinks";
import { getEventTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function PublicEventPage() {
  const params = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [currentGuest, setCurrentGuest] = useState<Guest | undefined>();
  const [showContributions, setShowContributions] = useState(false);
  const [rsvpCompletionMessage, setRsvpCompletionMessage] = useState("");
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

    setCurrentGuest(response.guest);
    setBundle(response.bundle);
    setShowContributions(false);
    setRsvpCompletionMessage("");
    setMessage("");
    return response.guest;
  }

  function handleContributionChoice(showContributions: boolean) {
    setShowContributions(showContributions);
    setMessage("");
    if (showContributions) {
      setRsvpCompletionMessage("");
    }
  }

  function handleCompleteRsvp(nextMessage: string) {
    setRsvpCompletionMessage(nextMessage);
    setShowContributions(false);
    setMessage("");
  }

  function handleContributionComplete() {
    handleCompleteRsvp("You're all set. Thanks for contributing.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleClaim(item: ChecklistItem, note?: string) {
    if (!currentGuest) {
      return;
    }

    const previousMoneyClaimCount = item.moneyClaims?.length ?? 0;
    const response = await claimSharedChecklistItem(eventId, item.id, currentGuest.id, note);
    const updated = response?.item;

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
  const contributionFlowIsActive =
    showContributions && currentGuest?.rsvpStatus === "yes" && !rsvpCompletionMessage;

  return (
    <main className={cn("min-h-screen", theme.pageBackground)}>
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10",
          contributionFlowIsActive && "pb-28 lg:pb-10"
        )}
      >
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

            {contributionFlowIsActive ? (
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
                <CardContent className="pb-28 lg:pb-5">
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
                  <div className="mt-5 hidden justify-end border-t border-ink/8 pt-4 lg:flex">
                    <Button type="button" className={cn(theme.cta)} onClick={handleContributionComplete}>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Send RSVP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <aside className="space-y-5">
            <RSVPCard
              event={bundle.event}
              onSubmit={handleRsvp}
              onContributionChoice={handleContributionChoice}
              completionMessage={rsvpCompletionMessage}
              onComplete={handleCompleteRsvp}
            />
            {contributionFlowIsActive ? (
              <PitchInCard event={bundle.event} />
            ) : null}
          </aside>
        </div>
      </div>
      {contributionFlowIsActive ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 p-3 shadow-soft backdrop-blur lg:hidden">
          <div className="mx-auto max-w-6xl">
            <Button type="button" className={cn("w-full", theme.cta)} onClick={handleContributionComplete}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send RSVP
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
