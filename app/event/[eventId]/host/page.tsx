"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  Check,
  ClipboardList,
  Copy,
  DollarSign,
  Eye,
  ListPlus,
  Salad,
  UsersRound
} from "lucide-react";
import { ChecklistBoard } from "@/components/ChecklistBoard";
import { DietarySummary } from "@/components/DietarySummary";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/EventHero";
import { GuestList } from "@/components/GuestList";
import { PitchInCard } from "@/components/PitchInCard";
import { StatCard } from "@/components/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  ChecklistCategory,
  ChecklistItem,
  ChecklistItemDraft,
  ChecklistItemType,
  EventBundle
} from "@/types/events";
import {
  addChecklistItem,
  deleteChecklistItem,
  getEventBundle,
  updateChecklistItem
} from "@/lib/events";
import { getEventTheme } from "@/lib/themes";
import { categoryLabels, categoryOrder, cn } from "@/lib/utils";

export default function HostDashboardPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [itemType, setItemType] = useState<ChecklistItemType>("bring");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ChecklistCategory>("other");
  const [quantity, setQuantity] = useState("");
  const [amountPerPerson, setAmountPerPerson] = useState("");
  const [totalSpots, setTotalSpots] = useState("");
  const [description, setDescription] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  function reload() {
    setBundle(getEventBundle(eventId));
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

  async function handleCopyInviteLink() {
    const inviteUrl = `${window.location.origin}/event/${eventId}`;

    try {
      if (copyInviteLinkWithFallback(inviteUrl)) {
        setCopyMessage("Invite link copied.");
        return;
      }

      if (!navigator.clipboard?.writeText) {
        throw new Error("Copy failed");
      }

      try {
        await navigator.clipboard.writeText(inviteUrl);
      } catch {
        if (!copyInviteLinkWithFallback(inviteUrl)) {
          throw new Error("Copy failed");
        }
      }

      setCopyMessage("Invite link copied.");
    } catch {
      setCopyMessage("Copy failed. Preview the invite and copy the URL.");
    }
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

  const missingItems =
    bundle?.checklistItems.filter((item) => {
      if (!item.isRequired) {
        return false;
      }

      if ((item.itemType ?? "bring") === "money") {
        return (item.moneyClaims?.length ?? 0) < (item.totalSpots ?? 1);
      }

      return !item.claimedByGuestId;
    }) ?? [];

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setFormMessage(
        itemType === "money"
          ? "Add a title for the pitch-in contribution."
          : "Add a title before adding the item."
      );
      return;
    }

    if (itemType === "money") {
      const amount = Number(amountPerPerson);
      const spots = Number(totalSpots);

      if (!amountPerPerson || Number.isNaN(amount) || amount <= 0) {
        setFormMessage("Add an amount per person greater than $0.");
        return;
      }

      if (!totalSpots || Number.isNaN(spots) || spots < 1 || !Number.isInteger(spots)) {
        setFormMessage("Add the number of available pitch-in spots.");
        return;
      }

      addChecklistItem(eventId, {
        title: title.trim(),
        category: "other",
        itemType: "money",
        amountPerPerson: amount,
        totalSpots: spots,
        description: description.trim() || undefined,
        isRequired: true
      });
    } else {
      addChecklistItem(eventId, {
        title: title.trim(),
        category,
        itemType: "bring",
        quantity: quantity ? Number(quantity) : undefined,
        description: description.trim() || undefined,
        isRequired: true
      });
    }

    setTitle("");
    setQuantity("");
    setAmountPerPerson("");
    setTotalSpots("");
    setDescription("");
    setFormMessage(itemType === "money" ? "Pitch-in contribution added." : "Added to the board.");
    reload();
  }

  function handleDelete(item: ChecklistItem) {
    deleteChecklistItem(item.id);
    reload();
  }

  function handleEdit(item: ChecklistItem, draft: ChecklistItemDraft) {
    updateChecklistItem(item.id, draft);
    reload();
  }

  if (loaded && !bundle) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Event not found"
          description="This host dashboard needs a valid event link."
        />
        <Link href="/" className={cn(buttonVariants({ variant: "clay" }), "mt-5")}>
          Go home
        </Link>
      </main>
    );
  }

  if (!bundle) {
    return null;
  }

  const theme = getEventTheme(bundle.event.coverStyle);

  return (
    <main className={cn("min-h-screen", theme.pageBackground)}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-5 flex justify-end">
          <Link
            href={`/event/${eventId}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Edit event
          </Link>
        </div>

        <section aria-labelledby="setup-share-heading" className="space-y-6">
          <Card className={cn("overflow-hidden border", theme.accentBorder)}>
            <div className={cn("h-2", theme.swatch)} />
            <CardHeader className="space-y-4">
              <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>
                Setup &amp; Share
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle id="setup-share-heading" className="text-3xl sm:text-4xl">
                    Your invite is ready
                  </CardTitle>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
                    Preview the guest experience, make final checklist edits, then share your invite.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:min-w-56">
                  <Link
                    href={`/event/${eventId}`}
                    className={cn(buttonVariants({ variant: "default" }), theme.cta, "w-full")}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    Preview Invite
                  </Link>
                  <Button type="button" variant="secondary" onClick={handleCopyInviteLink}>
                    {copyMessage ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                    Copy Invite Link
                  </Button>
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
                    Checklist before sharing
                  </CardTitle>
                  <p className="text-sm text-ink/60">
                    Add, edit, delete, and track what is still needed.
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <form onSubmit={handleAdd} className={cn("rounded-lg p-4", theme.softPanel)}>
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setItemType("bring")}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm font-semibold transition",
                          itemType === "bring" ? theme.cta : "bg-white text-ink ring-1 ring-ink/10"
                        )}
                      >
                        Bring item
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemType("money")}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm font-semibold transition",
                          itemType === "money" ? theme.cta : "bg-white text-ink ring-1 ring-ink/10"
                        )}
                      >
                        Pitch-in money
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_170px_100px]">
                      <Input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder={itemType === "money" ? "Pitch in for dinner" : "Vegetarian side"}
                      />
                      {itemType === "bring" ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          <span className="relative">
                            <DollarSign
                              className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35"
                              aria-hidden="true"
                            />
                            <Input
                              value={amountPerPerson}
                              onChange={(event) => setAmountPerPerson(event.target.value)}
                              type="number"
                              min="1"
                              step="1"
                              placeholder="Amount"
                              className="pl-10"
                            />
                          </span>
                          <Input
                            value={totalSpots}
                            onChange={(event) => setTotalSpots(event.target.value)}
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Spots"
                          />
                        </>
                      )}
                    </div>
                    <Textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Optional description"
                      className="mt-3 min-h-20"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button type="submit" variant="clay">
                        <ListPlus className="h-4 w-4" aria-hidden="true" />
                        Add item
                      </Button>
                      {formMessage ? (
                        <p className={cn("text-sm font-semibold", theme.accentText)}>{formMessage}</p>
                      ) : null}
                    </div>
                  </form>

                  <ChecklistBoard
                    items={bundle.checklistItems}
                    event={bundle.event}
                    hostControls
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
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
                          <p className="text-ink/55">
                            {(item.itemType ?? "bring") === "money"
                              ? `${Math.max((item.totalSpots ?? 1) - (item.moneyClaims?.length ?? 0), 0)} spots left`
                              : categoryLabels[item.category]}
                          </p>
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

        <section aria-labelledby="guest-activity-heading" className="mt-8 space-y-5">
          <div>
            <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>
              Guest Activity / Event Management
            </p>
            <h2 id="guest-activity-heading" className="mt-2 text-3xl font-semibold">
              Guest Activity
            </h2>
          </div>

          {bundle.guests.length === 0 ? (
            <EmptyState title="No RSVPs yet. Once guests respond, you'll see who's coming and what they're bringing." />
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
