"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  Check,
  ClipboardList,
  Copy,
  Eye,
  Salad,
  Share2,
  UsersRound
} from "lucide-react";
import { DietarySummary } from "@/components/DietarySummary";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/EventHero";
import { GuestList } from "@/components/GuestList";
import { HostFlowNav } from "@/components/HostFlowNav";
import { PitchInCard } from "@/components/PitchInCard";
import { StatCard } from "@/components/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChecklistItem, EventBundle } from "@/types/events";
import { getEventBundle } from "@/lib/events";
import { createInviteUrl } from "@/lib/inviteLinks";
import { getEventTheme } from "@/lib/themes";
import { categoryLabels, cn } from "@/lib/utils";

export default function HostDashboardPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  function getInviteUrl() {
    return bundle ? createInviteUrl(window.location.origin, bundle) : `${window.location.origin}/event/${eventId}`;
  }

  function copyInviteLinkWithFallback(inviteUrl: string) {
    const textarea = document.createElement("textarea");
    textarea.value = inviteUrl;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }

  async function copyInviteUrl(inviteUrl: string) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(inviteUrl);
        return true;
      } catch {
        return copyInviteLinkWithFallback(inviteUrl);
      }
    }

    return copyInviteLinkWithFallback(inviteUrl);
  }

  async function handleCopyInviteLink() {
    const copied = await copyInviteUrl(getInviteUrl());
    setCopyMessage(copied ? "Invite link copied." : "Copy failed. Preview the invite and copy the URL.");
  }

  async function handleInvitePeople() {
    const inviteUrl = getInviteUrl();
    const shareText = `You're invited to ${bundle?.event.title ?? "Supper Club"}. RSVP and see what to bring here: ${inviteUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: bundle?.event.title ?? "Supper Club",
          text: shareText,
          url: inviteUrl
        });
        setCopyMessage("Invite shared.");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    const copied = await copyInviteUrl(inviteUrl);
    setCopyMessage(copied ? "Invite link copied." : "Copy failed. Preview the invite and copy the URL.");
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBundle(getEventBundle(eventId));
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [eventId]);

  const stats = useMemo(() => {
    const guests = bundle?.guests ?? [];
    return {
      yes: guests.filter((guest) => guest.rsvpStatus === "yes").length,
      maybe: guests.filter((guest) => guest.rsvpStatus === "maybe").length,
      no: guests.filter((guest) => guest.rsvpStatus === "no").length
    };
  }, [bundle]);

  const requiredItems = useMemo(
    () => bundle?.checklistItems.filter((item) => item.isRequired) ?? [],
    [bundle]
  );

  const missingItems = requiredItems.filter((item) => {
    if ((item.itemType ?? "bring") === "money") {
      return (item.moneyClaims?.length ?? 0) < (item.totalSpots ?? 1);
    }

    return !item.claimedByGuestId;
  });

  const checklistSummary = requiredItems.reduce(
    (summary, item) => {
      if ((item.itemType ?? "bring") === "money") {
        const totalSpots = item.totalSpots ?? 1;
        const claimedSpots = item.moneyClaims?.length ?? 0;

        return {
          totalSlots: summary.totalSlots + totalSpots,
          claimedSlots: summary.claimedSlots + claimedSpots,
          pitchInTotal: summary.pitchInTotal + totalSpots,
          pitchInClaimed: summary.pitchInClaimed + claimedSpots
        };
      }

      return {
        ...summary,
        totalSlots: summary.totalSlots + 1,
        claimedSlots: summary.claimedSlots + (item.claimedByGuestId ? 1 : 0)
      };
    },
    { totalSlots: 0, claimedSlots: 0, pitchInTotal: 0, pitchInClaimed: 0 }
  );

  function getMissingItemDetail(item: ChecklistItem) {
    if ((item.itemType ?? "bring") === "money") {
      return `${Math.max((item.totalSpots ?? 1) - (item.moneyClaims?.length ?? 0), 0)} spots left`;
    }

    return categoryLabels[item.category];
  }

  if (loaded && !bundle) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Event not found"
          description="This event home needs a valid host link."
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

  const theme = getEventTheme(bundle.event.coverStyle);
  const pitchInValue =
    checklistSummary.pitchInTotal > 0
      ? `${checklistSummary.pitchInClaimed}/${checklistSummary.pitchInTotal}`
      : "0";

  return (
    <main className={cn("min-h-screen", theme.pageBackground)}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <HostFlowNav
          eventId={eventId}
          currentStep="event"
          backHref={`/event/${eventId}/setup`}
          backLabel="Back to Setup Contributions"
        />

        <section aria-labelledby="event-home-heading" className="space-y-6">
          <Card className={cn("overflow-hidden border", theme.accentBorder)}>
            <div className={cn("h-2", theme.swatch)} />
            <CardHeader className="space-y-4">
              <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>
                Event Home
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle id="event-home-heading" className="text-3xl sm:text-4xl">
                    {bundle.event.title}
                  </CardTitle>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
                    Keep the invite link, checklist, pitch-in spots, and guest responses in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:min-w-56">
                  <Button
                    type="button"
                    variant="default"
                    className={cn(theme.cta, "w-full")}
                    onClick={handleInvitePeople}
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    Invite People
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCopyInviteLink}>
                    {copyMessage ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                    Copy Invite Link
                  </Button>
                  <Link
                    href={`/event/${eventId}?preview=host`}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    Preview Invite
                  </Link>
                </div>
              </div>
              {copyMessage ? (
                <p className={cn("text-sm font-semibold", theme.accentText)}>{copyMessage}</p>
              ) : null}
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <EventHero event={bundle.event} />

              <Card className={cn("border", theme.accentBorder)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                    Checklist &amp; contributions
                  </CardTitle>
                  <p className="text-sm text-ink/60">
                    A quick read on what is open, claimed, and ready for guests.
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <StatCard
                      label="Open needs"
                      value={Math.max(checklistSummary.totalSlots - checklistSummary.claimedSlots, 0)}
                    />
                    <StatCard
                      label="Claimed"
                      value={`${checklistSummary.claimedSlots}/${checklistSummary.totalSlots}`}
                    />
                    <StatCard label="Pitch-in spots" value={pitchInValue} />
                  </div>
                  <Link
                    href={`/event/${eventId}/setup`}
                    className={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
                  >
                    Edit checklist
                  </Link>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-5">
              <PitchInCard event={bundle.event} hostView />

              <Card className={cn("border", theme.accentBorder)}>
                <CardHeader>
                  <CardTitle>Still needed</CardTitle>
                </CardHeader>
                <CardContent>
                  {missingItems.length > 0 ? (
                    <div className="space-y-2">
                      {missingItems.map((item) => (
                        <div key={item.id} className={cn("rounded-lg p-3 text-sm", theme.softPanel)}>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-ink/55">{getMissingItemDetail(item)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="Everything is claimed" description="A very tidy board." />
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>

        <section aria-labelledby="guest-responses-heading" className="mt-8 space-y-5">
          <div>
            <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>
              Guest Responses
            </p>
            <h2 id="guest-responses-heading" className="mt-2 text-3xl font-semibold">
              Guest responses
            </h2>
          </div>

          {bundle.guests.length === 0 ? (
            <EmptyState title="Guest responses will appear here once people start replying." />
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard
                  label="In"
                  value={stats.yes}
                  icon={<UsersRound className="h-5 w-5" aria-hidden="true" />}
                />
                <StatCard
                  label="Maybe"
                  value={stats.maybe}
                  icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
                />
                <StatCard
                  label="Can't make it"
                  value={stats.no}
                  icon={<UsersRound className="h-5 w-5" aria-hidden="true" />}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <Card className={cn("border", theme.accentBorder)}>
                  <CardHeader>
                    <CardTitle>Who&apos;s coming</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GuestList guests={bundle.guests} checklistItems={bundle.checklistItems} />
                  </CardContent>
                </Card>

                <aside>
                  <Card className={cn("border", theme.accentBorder)}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Salad className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                        Dietary restrictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DietarySummary guests={bundle.guests} />
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
