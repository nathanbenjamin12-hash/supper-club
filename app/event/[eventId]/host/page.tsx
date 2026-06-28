"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Copy,
  Eye,
  Pencil,
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
import { getSharedEventBundle } from "@/lib/eventApi";
import { createInviteUrl } from "@/lib/inviteLinks";
import { getEventTheme } from "@/lib/themes";
import { categoryLabels, cn } from "@/lib/utils";

export default function HostDashboardPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [guestResponsesExpanded, setGuestResponsesExpanded] = useState(false);
  const [contributionsExpanded, setContributionsExpanded] = useState(false);

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
    let active = true;

    async function loadBundle() {
      const nextBundle = await getSharedEventBundle(eventId);

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

  function isMoneyItem(item: ChecklistItem) {
    return (item.itemType ?? "bring") === "money";
  }

  function claimedSlotCount(item: ChecklistItem) {
    return isMoneyItem(item) ? item.moneyClaims?.length ?? 0 : item.claimedByGuestId ? 1 : 0;
  }

  function totalSlotCount(item: ChecklistItem) {
    return isMoneyItem(item) ? item.totalSpots ?? 1 : 1;
  }

  const bringItems = requiredItems.filter((item) => !isMoneyItem(item));
  const pitchInItems = requiredItems.filter(isMoneyItem);
  const stillNeededItems = bringItems.filter((item) => !item.claimedByGuestId);
  const claimedItems = bringItems.filter((item) => item.claimedByGuestId);

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

  function getClaimedItemDetail(item: ChecklistItem) {
    return item.claimedByName ? `Claimed by ${item.claimedByName}` : categoryLabels[item.category];
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

        <div className="space-y-8">
          <section aria-labelledby="event-section-heading" className="space-y-4">
            <EventHero event={bundle.event} />
            <div className="flex justify-end">
              <Link
                href={`/event/${eventId}/edit`}
                className={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit details
              </Link>
            </div>
            <h1 id="event-section-heading" className="sr-only">
              Event
            </h1>
          </section>

          <section aria-labelledby="invite-guests-heading">
            <Card className={cn("overflow-hidden border", theme.accentBorder)}>
              <div className={cn("h-2", theme.swatch)} />
              <CardHeader>
                <CardTitle id="invite-guests-heading">Invite guests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button
                    type="button"
                    variant="default"
                    className={cn(theme.cta, "w-full")}
                    onClick={handleInvitePeople}
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    Invite people
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCopyInviteLink}>
                    {copyMessage ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                    Copy invite link
                  </Button>
                  <Link
                    href={`/event/${eventId}?preview=host`}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    Preview invite
                  </Link>
                </div>
                {copyMessage ? (
                  <p className={cn("text-sm font-semibold", theme.accentText)}>{copyMessage}</p>
                ) : null}
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="guests-heading" className="space-y-5">
            <div>
              <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>
                Guests
              </p>
              <h2 id="guests-heading" className="mt-2 text-3xl font-semibold">
                Guest responses
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Going"
                value={stats.yes}
                icon={<UsersRound className="h-5 w-5" aria-hidden="true" />}
              />
              <StatCard
                label="Maybe"
                value={stats.maybe}
                icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
              />
              <StatCard
                label="Not attending"
                value={stats.no}
                icon={<UsersRound className="h-5 w-5" aria-hidden="true" />}
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setGuestResponsesExpanded((expanded) => !expanded)}
            >
              {guestResponsesExpanded ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
              {guestResponsesExpanded ? "Hide guest responses" : "View guest responses"}
            </Button>

            {guestResponsesExpanded ? (
              bundle.guests.length === 0 ? (
                <EmptyState title="Guest responses will appear here once people start replying." />
              ) : (
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                  <Card className={cn("border", theme.accentBorder)}>
                    <CardHeader>
                      <CardTitle>Guest list</CardTitle>
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
              )
            ) : null}
          </section>

          <section aria-labelledby="contributions-heading" className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>
                  Contributions
                </p>
                <h2 id="contributions-heading" className="mt-2 text-3xl font-semibold">
                  Contributions
                </h2>
              </div>
              <Link
                href={`/event/${eventId}/setup`}
                className={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Edit checklist
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Items claimed" value={`${claimedItems.length}/${bringItems.length}`} />
              <StatCard label="Still needed" value={stillNeededItems.length} />
              {bundle.event.pitchInEnabled ? (
                <StatCard label="Pitch-in spots" value={pitchInValue} />
              ) : null}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setContributionsExpanded((expanded) => !expanded)}
            >
              {contributionsExpanded ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
              {contributionsExpanded ? "Hide contributions" : "View contributions"}
            </Button>

            {contributionsExpanded ? (
              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6">
                  <Card className={cn("border", theme.accentBorder)}>
                    <CardHeader>
                      <CardTitle>Still needed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stillNeededItems.length > 0 ? (
                        <div className="space-y-2">
                          {stillNeededItems.map((item) => (
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

                  <Card className={cn("border", theme.accentBorder)}>
                    <CardHeader>
                      <CardTitle>Claimed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {claimedItems.length > 0 ? (
                        <div className="space-y-2">
                          {claimedItems.map((item) => (
                            <div key={item.id} className={cn("rounded-lg p-3 text-sm", theme.softPanel)}>
                              <p className="font-semibold">{item.title}</p>
                              <p className="text-ink/55">{getClaimedItemDetail(item)}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState title="No claimed items yet" description="Guest claims will show up here." />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {bundle.event.pitchInEnabled ? (
                  <aside className="space-y-5">
                    <PitchInCard event={bundle.event} hostView />
                    {pitchInItems.length > 0 ? (
                      <Card className={cn("border", theme.accentBorder)}>
                        <CardHeader>
                          <CardTitle>Pitch-in progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {pitchInItems.map((item) => (
                              <div key={item.id} className={cn("rounded-lg p-3 text-sm", theme.softPanel)}>
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-ink/55">
                                  {claimedSlotCount(item)}/{totalSlotCount(item)} spots claimed
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : null}
                  </aside>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
