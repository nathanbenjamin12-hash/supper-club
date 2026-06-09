"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  ClipboardList,
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
import { ShareInviteCard } from "@/components/ShareInviteCard";
import { StatCard } from "@/components/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ChecklistCategory, ChecklistItem, ChecklistItemDraft, EventBundle } from "@/types/events";
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
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ChecklistCategory>("other");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [formMessage, setFormMessage] = useState("");

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

  const stats = useMemo(() => {
    const guests = bundle?.guests ?? [];
    return {
      yes: guests.filter((guest) => guest.rsvpStatus === "yes").length,
      maybe: guests.filter((guest) => guest.rsvpStatus === "maybe").length,
      no: guests.filter((guest) => guest.rsvpStatus === "no").length
    };
  }, [bundle]);

  const missingItems = bundle?.checklistItems.filter((item) => item.isRequired && !item.claimedByGuestId) ?? [];

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setFormMessage("Add a title before adding the item.");
      return;
    }

    addChecklistItem(eventId, {
      title: title.trim(),
      category,
      quantity: quantity ? Number(quantity) : undefined,
      description: description.trim() || undefined,
      isRequired: true
    });
    setTitle("");
    setQuantity("");
    setDescription("");
    setFormMessage("Added to the board.");
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
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/event/${eventId}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "bg-white/55 backdrop-blur"
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Public invite
          </Link>
          <Link
            href={`/event/${eventId}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Edit event
          </Link>
        </div>

      <div className="mb-6">
        <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>Host dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold">Your party plan</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <EventHero event={bundle.event} />

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="I'm in" value={stats.yes} icon={<UsersRound className="h-5 w-5" aria-hidden="true" />} />
            <StatCard label="Maybe" value={stats.maybe} icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />} />
            <StatCard label="Can't make it" value={stats.no} icon={<UsersRound className="h-5 w-5" aria-hidden="true" />} />
          </div>

          <Card className={cn("border", theme.accentBorder)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                Checklist management
              </CardTitle>
              <p className="text-sm text-ink/60">
                Add, edit, delete, and track what is still needed.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleAdd} className={cn("rounded-lg p-4", theme.softPanel)}>
                <div className="grid gap-3 sm:grid-cols-[1fr_170px_100px]">
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Vegetarian side"
                  />
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
                  {formMessage ? <p className={cn("text-sm font-semibold", theme.accentText)}>{formMessage}</p> : null}
                </div>
              </form>

              <ChecklistBoard
                items={bundle.checklistItems}
                hostControls
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-5">
          <ShareInviteCard eventId={eventId} />
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
                      <p className="text-ink/55">{categoryLabels[item.category]}</p>
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
              <CardTitle className="flex items-center gap-2">
                <Salad className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                Dietary restrictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DietarySummary guests={bundle.guests} />
            </CardContent>
          </Card>

          <Card className={cn("border", theme.accentBorder)}>
            <CardHeader>
              <CardTitle>Guest contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <GuestList guests={bundle.guests} checklistItems={bundle.checklistItems} />
            </CardContent>
          </Card>
        </aside>
      </div>
      </div>
    </main>
  );
}
