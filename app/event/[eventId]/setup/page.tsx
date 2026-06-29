"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AtSign, ClipboardList, DollarSign, Home, ListPlus } from "lucide-react";
import { ChecklistBoard } from "@/components/ChecklistBoard";
import { EmptyState } from "@/components/EmptyState";
import { HostFlowNav } from "@/components/HostFlowNav";
import { PitchInCard } from "@/components/PitchInCard";
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
  DinnerEvent,
  EventDraft,
  EventBundle
} from "@/types/events";
import {
  addSharedChecklistItem,
  deleteSharedChecklistItem,
  getSharedEventBundle,
  updateSharedEvent,
  updateSharedChecklistItem
} from "@/lib/eventApi";
import { getEventTheme } from "@/lib/themes";
import { categoryLabels, categoryOrder, cn, normalizeVenmoHandle } from "@/lib/utils";

const categoryItemPlaceholders: Record<ChecklistCategory, string> = {
  appetizers: "Cheese board",
  mains: "Lasagna",
  sides: "Caesar salad",
  desserts: "Brownies",
  drinks: "Red wine",
  supplies: "Ice",
  games: "Checkers",
  other: "Folding chairs"
};

export default function EventSetupPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const [bundle, setBundle] = useState<EventBundle | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [itemType, setItemType] = useState<ChecklistItemType>("bring");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ChecklistCategory | "">("");
  const [quantity, setQuantity] = useState("");
  const [amountPerPerson, setAmountPerPerson] = useState("");
  const [totalSpots, setTotalSpots] = useState("");
  const [description, setDescription] = useState("");
  const [venmoHandle, setVenmoHandle] = useState("");
  const [formMessage, setFormMessage] = useState("");

  async function reload() {
    setBundle(await getSharedEventBundle(eventId));
  }

  function isMoneyItem(item: ChecklistItem | ChecklistItemDraft) {
    return (item.itemType ?? "bring") === "money";
  }

  function eventToDraft(event: DinnerEvent, overrides: Partial<EventDraft> = {}): EventDraft {
    return {
      title: event.title,
      hostName: event.hostName,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      eventType: event.eventType,
      coverStyle: event.coverStyle,
      pitchInEnabled: event.pitchInEnabled,
      recommendedContributionAmount: event.recommendedContributionAmount,
      venmoHandle: event.venmoHandle ?? normalizeVenmoHandle(event.venmoUrl),
      venmoUrl: undefined,
      ...overrides
    };
  }

  async function savePitchInEventConfig(
    checklistItems: Array<ChecklistItem | ChecklistItemDraft>,
    handleValue = venmoHandle
  ) {
    if (!bundle) {
      return;
    }

    const pitchInEnabled = checklistItems.some(isMoneyItem);
    const event = await updateSharedEvent(
      eventId,
      eventToDraft(bundle.event, {
        pitchInEnabled,
        recommendedContributionAmount: undefined,
        venmoHandle: normalizeVenmoHandle(handleValue),
        venmoUrl: undefined
      })
    );

    if (event) {
      setBundle((currentBundle) => (currentBundle ? { ...currentBundle, event } : currentBundle));
    }
  }

  useEffect(() => {
    let active = true;

    async function loadBundle() {
      const nextBundle = await getSharedEventBundle(eventId);

      if (!active) {
        return;
      }

      setBundle(nextBundle);
      setVenmoHandle(nextBundle?.event.venmoHandle ?? normalizeVenmoHandle(nextBundle?.event.venmoUrl) ?? "");
      setLoaded(true);
    }

    void loadBundle();

    return () => {
      active = false;
    };
  }, [eventId]);

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

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
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

      const addedItem = await addSharedChecklistItem(eventId, {
        title: title.trim(),
        category: "other",
        itemType: "money",
        amountPerPerson: amount,
        totalSpots: spots,
        description: description.trim() || undefined,
        isRequired: true
      });

      if (addedItem && bundle) {
        await savePitchInEventConfig([...bundle.checklistItems, addedItem], venmoHandle);
      }
    } else {
      await addSharedChecklistItem(eventId, {
        title: title.trim(),
        category: category || "other",
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
    await reload();
  }

  async function handleDelete(item: ChecklistItem) {
    const nextChecklistItems = bundle?.checklistItems.filter((candidate) => candidate.id !== item.id) ?? [];
    await deleteSharedChecklistItem(eventId, item.id);
    await savePitchInEventConfig(nextChecklistItems);
    await reload();
  }

  async function handleEdit(item: ChecklistItem, draft: ChecklistItemDraft) {
    const nextChecklistItems =
      bundle?.checklistItems.map((candidate) =>
        candidate.id === item.id ? { ...candidate, ...draft, itemType: draft.itemType ?? "bring" } : candidate
      ) ?? [];

    await updateSharedChecklistItem(eventId, item.id, draft);
    await savePitchInEventConfig(nextChecklistItems);
    await reload();
  }

  async function handleSaveVenmoHandle() {
    await savePitchInEventConfig(bundle?.checklistItems ?? [], venmoHandle);
    setFormMessage("Venmo handle saved.");
    await reload();
  }

  if (loaded && !bundle) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Event not found"
          description="This setup page needs a valid event link."
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
  const pitchInItems = bundle.checklistItems.filter(isMoneyItem);
  const itemNamePlaceholder =
    itemType === "money" ? "Pitch in for dinner" : category ? categoryItemPlaceholders[category] : "Item name";

  return (
    <main className={cn("min-h-screen", theme.pageBackground)}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <HostFlowNav
          eventId={eventId}
          currentStep="contributions"
          backHref={`/event/${eventId}/edit`}
          backLabel="Back to Event Setup"
        />

        <section aria-labelledby="setup-contributions-heading" className="space-y-6">
          <Card className={cn("overflow-hidden border", theme.accentBorder)}>
            <div className={cn("h-2", theme.swatch)} />
            <CardHeader className="space-y-4">
              <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", theme.accentText)}>
                Setup Contributions
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle id="setup-contributions-heading" className="text-3xl sm:text-4xl">
                    Get the board ready
                  </CardTitle>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
                    Add, edit, delete, and track what guests can bring or pitch in before you invite them.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:min-w-56">
                  <Link
                    href={`/event/${eventId}/host`}
                    className={cn(buttonVariants({ variant: "default" }), theme.cta, "w-full")}
                  >
                    <Home className="h-4 w-4" aria-hidden="true" />
                    Go to Event
                  </Link>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <Card className={cn("border", theme.accentBorder)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
                    Checklist before sharing
                  </CardTitle>
                  <p className="text-sm text-ink/60">
                    Shape the food, drinks, supplies, and pitch-in spots guests will see.
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
                          itemType === "bring" ? theme.cta : "bg-cream text-ink ring-1 ring-ink/10"
                        )}
                      >
                        Bring item
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemType("money")}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm font-semibold transition",
                          itemType === "money" ? theme.cta : "bg-cream text-ink ring-1 ring-ink/10"
                        )}
                      >
                        Pitch-in money
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_170px_100px]">
                      <Input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder={itemNamePlaceholder}
                      />
                      {itemType === "bring" ? (
                        <>
                          <Select
                            value={category}
                            onChange={(event) => setCategory(event.target.value as ChecklistCategory | "")}
                          >
                            <option value="" disabled>
                              Category
                            </option>
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
                    {itemType === "money" ? (
                      <label className="mt-3 grid gap-2 text-sm font-semibold">
                        Venmo handle
                        <span className="relative">
                          <AtSign
                            className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35"
                            aria-hidden="true"
                          />
                          <Input
                            value={venmoHandle}
                            onChange={(event) => setVenmoHandle(event.target.value)}
                            placeholder="james-smith"
                            className="pl-10"
                          />
                        </span>
                      </label>
                    ) : null}
                    <Textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Optional description"
                      className="mt-3 min-h-20"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button type="submit" variant="default" className={cn(theme.cta)}>
                        <ListPlus className="h-4 w-4" aria-hidden="true" />
                        Add item
                      </Button>
                      {itemType === "money" ? (
                        <Button type="button" variant="secondary" onClick={handleSaveVenmoHandle}>
                          Save Venmo handle
                        </Button>
                      ) : null}
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
              <PitchInCard event={bundle.event} hostView enabled={pitchInItems.length > 0} />

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
      </div>
    </main>
  );
}
