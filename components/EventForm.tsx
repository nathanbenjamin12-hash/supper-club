"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ListPlus,
  MapPin,
  Trash2,
  Utensils,
  UserRound
} from "lucide-react";
import type {
  ChecklistCategory,
  ChecklistItemDraft,
  DinnerEvent,
  EventDraft,
  EventType
} from "@/types/events";
import {
  categoryLabels,
  categoryOrder,
  cleanOptional,
  cn,
  eventTypeLabels,
  normalizeVenmoHandle
} from "@/lib/utils";
import { coverStyles, eventThemes, getEventTheme } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TemplatePicker } from "@/components/TemplatePicker";

const contributionPresets: { label: string; category: ChecklistCategory }[] = [
  { label: "Wine", category: "drinks" },
  { label: "Dessert", category: "desserts" },
  { label: "Appetizer", category: "appetizers" },
  { label: "Side dish", category: "sides" },
  { label: "Main dish", category: "mains" },
  { label: "Salad", category: "sides" },
  { label: "Ice", category: "supplies" },
  { label: "Drinks", category: "drinks" },
  { label: "Board game", category: "games" },
  { label: "Custom", category: "other" }
];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(value: string) {
  if (!value) {
    return "Choose a date";
  }

  const parsed = new Date(`${value}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "Choose a date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}

export function EventForm({
  event,
  submitLabel,
  onSubmit
}: {
  event?: DinnerEvent;
  submitLabel: string;
  onSubmit: (draft: EventDraft, starterItems?: ChecklistItemDraft[]) => void;
}) {
  const allowStarterItems = !event;
  const [title, setTitle] = useState(event?.title ?? "");
  const [hostName, setHostName] = useState(event?.hostName ?? "");
  const [date, setDate] = useState(event?.date ?? todayDate());
  const [time, setTime] = useState(event?.time ?? "7:00 PM");
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [eventType, setEventType] = useState<EventType>(event?.eventType ?? "dinner_party");
  const [coverStyle, setCoverStyle] = useState(event?.coverStyle ?? coverStyles[0]);
  const [customItems, setCustomItems] = useState<ChecklistItemDraft[]>([]);
  const [customItemPreset, setCustomItemPreset] = useState(contributionPresets[0].label);
  const [customItemTitle, setCustomItemTitle] = useState("");
  const [customItemCategory, setCustomItemCategory] = useState<ChecklistCategory>("other");
  const [customItemQuantity, setCustomItemQuantity] = useState("");
  const [customItemDescription, setCustomItemDescription] = useState("");
  const [error, setError] = useState("");

  const missingFields = useMemo(() => {
    const missing = [];
    if (!title.trim()) missing.push("event title");
    if (!hostName.trim()) missing.push("host name");
    if (!date.trim()) missing.push("date");
    if (!time.trim()) missing.push("time");
    if (!location.trim()) missing.push("location");
    return missing;
  }, [date, hostName, location, time, title]);
  const selectedTheme = getEventTheme(coverStyle);
  const selectedPreset = contributionPresets.find((preset) => preset.label === customItemPreset);
  const isCustomPreset = customItemPreset === "Custom";

  function handleAddCustomItem() {
    const itemTitle = isCustomPreset ? customItemTitle.trim() : customItemPreset;
    const itemCategory = isCustomPreset ? customItemCategory : selectedPreset?.category ?? "other";

    if (!itemTitle) {
      setError("Add a custom item name before adding it to the board.");
      return;
    }

    const quantity = customItemQuantity ? Number(customItemQuantity) : undefined;

    if (quantity !== undefined && (Number.isNaN(quantity) || quantity < 1)) {
      setError("Use a quantity of 1 or more.");
      return;
    }

    setCustomItems((items) => [
      ...items,
      {
        title: itemTitle,
        category: itemCategory,
        itemType: "bring",
        quantity,
        description: cleanOptional(customItemDescription),
        isRequired: true
      }
    ]);
    setCustomItemTitle("");
    setCustomItemQuantity("");
    setCustomItemDescription("");
    setError("");
  }

  function handleCustomPresetChange(value: string) {
    const preset = contributionPresets.find((candidate) => candidate.label === value);
    setCustomItemPreset(value);
    if (preset && preset.label !== "Custom") {
      setCustomItemCategory(preset.category);
    }
  }

  function removeCustomItem(indexToRemove: number) {
    setCustomItems((items) => items.filter((_, index) => index !== indexToRemove));
  }

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (missingFields.length > 0) {
      setError(`Add ${missingFields.join(", ")} to keep the invite useful.`);
      return;
    }

    const starterItems = eventType === "custom" ? customItems : [];
    const existingVenmoHandle = event?.venmoHandle ?? normalizeVenmoHandle(event?.venmoUrl);

    setError("");
    onSubmit({
      title: title.trim(),
      hostName: hostName.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      description: cleanOptional(description),
      eventType,
      coverStyle,
      pitchInEnabled: event?.pitchInEnabled ?? false,
      recommendedContributionAmount: event?.recommendedContributionAmount,
      venmoHandle: existingVenmoHandle,
      venmoUrl: undefined
    }, starterItems);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-olive" aria-hidden="true" />
            Invite details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            Event title
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Pasta night at mine"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Host name
            <span className="relative">
              <UserRound
                className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35"
                aria-hidden="true"
              />
              <Input
                value={hostName}
                onChange={(event) => setHostName(event.target.value)}
                placeholder="Nathan"
                className="pl-10"
                required
              />
            </span>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Date
              <span className="relative block h-11 overflow-hidden rounded-md">
                <CalendarDays
                  className="pointer-events-none absolute left-3 top-3 z-10 h-5 w-5 text-ink/35"
                  aria-hidden="true"
                />
                <span className="pointer-events-none flex h-11 w-full items-center rounded-md border border-ink/10 bg-cream px-3 pl-10 text-left text-base font-semibold text-ink shadow-sm sm:text-sm">
                  {formatDisplayDate(date)}
                </span>
                <Input
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  type="date"
                  className="absolute inset-0 h-11 cursor-pointer opacity-0"
                  aria-label="Date"
                  required
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Start time
              <Input
                value={time}
                onChange={(event) => setTime(event.target.value)}
                placeholder="7:00 PM"
                required
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Location
            <span className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35"
                aria-hidden="true"
              />
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="123 Main St"
                className="pl-10"
                required
              />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Description
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A relaxed dinner. Bring wine, dessert, or a game if you would like."
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Starter checklist</CardTitle>
          <p className="text-sm text-ink/60">
            Pick a template and Supper Club will pre-fill the first batch of items.
          </p>
        </CardHeader>
        <CardContent>
          <TemplatePicker value={eventType} onChange={setEventType} />
          {eventType === "custom" && allowStarterItems ? (
            <div className="mt-5 rounded-lg bg-stone/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">Build your empty board</p>
                  <p className="mt-1 text-sm text-ink/60">
                    Add any food, drinks, games, or supplies you already know you need.
                  </p>
                </div>
                <span className="rounded-md bg-cream px-3 py-1 text-xs font-semibold text-ink/60 ring-1 ring-ink/8">
                  {customItems.length}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_170px_96px]">
                  <Select
                    value={customItemPreset}
                    onChange={(event) => handleCustomPresetChange(event.target.value)}
                    aria-label="Contribution item"
                  >
                    {contributionPresets.map((preset) => (
                      <option key={preset.label} value={preset.label}>
                        {preset.label}
                      </option>
                    ))}
                  </Select>
                  {isCustomPreset ? (
                    <Select
                      value={customItemCategory}
                      onChange={(event) =>
                        setCustomItemCategory(event.target.value as ChecklistCategory)
                      }
                    >
                      {categoryOrder.map((category) => (
                        <option key={category} value={category}>
                          {categoryLabels[category]}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <div className="flex h-11 items-center rounded-md bg-cream px-3 text-sm font-semibold text-ink/60 shadow-sm ring-1 ring-ink/10">
                      {categoryLabels[selectedPreset?.category ?? "other"]}
                    </div>
                  )}
                  <Input
                    value={customItemQuantity}
                    onChange={(event) => setCustomItemQuantity(event.target.value)}
                    type="number"
                    min="1"
                    placeholder="Qty"
                  />
                </div>
                {isCustomPreset ? (
                  <Input
                    value={customItemTitle}
                    onChange={(event) => setCustomItemTitle(event.target.value)}
                    placeholder="Type the custom item name"
                  />
                ) : null}
                <Textarea
                  value={customItemDescription}
                  onChange={(event) => setCustomItemDescription(event.target.value)}
                  placeholder="Optional note"
                  className="min-h-20"
                />
                <Button type="button" variant="secondary" onClick={handleAddCustomItem}>
                  <ListPlus className="h-4 w-4" aria-hidden="true" />
                  Add to starter board
                </Button>
              </div>

              {customItems.length > 0 ? (
                <div className="mt-4 grid gap-2">
                  {customItems.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-md bg-cream p-3 text-sm shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{item.title}</p>
                        <p className="text-ink/55">
                          {categoryLabels[item.category]}
                          {item.quantity ? ` | x${item.quantity}` : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomItem(index)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cover style</CardTitle>
          <p className="text-sm text-ink/60">
            This theme now carries through the invite, dashboard, contributions, and accents.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eventThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setCoverStyle(theme.id)}
                className={cn(
                  "relative min-h-32 overflow-hidden rounded-lg border bg-cream p-4 text-left transition hover:border-olive/30",
                  coverStyle === theme.id
                    ? `${theme.accentBorder} shadow-subtle ring-2 ring-olive/15`
                    : "border-ink/10 hover:border-ink/20"
                )}
              >
                <span className={cn("absolute inset-x-0 top-0 h-3", theme.swatch)} />
                <span className={cn("mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold", theme.chip)}>
                  {coverStyle === theme.id ? "Selected" : "Theme"}
                </span>
                <span className="mt-4 block font-semibold">{theme.label}</span>
                <span className="mt-1 block text-sm leading-5 text-ink/60">
                  {theme.description}
                </span>
              </button>
            ))}
          </div>
          <p className={cn("mt-4 rounded-lg p-3 text-sm font-semibold", selectedTheme.softPanel, selectedTheme.accentText)}>
            Current template: {eventTypeLabels[eventType]} | Current theme: {selectedTheme.label}
          </p>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-lg bg-terracotta/10 p-3 text-sm font-semibold text-terracotta">
          {error}
        </div>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto" variant="default">
        {submitLabel}
      </Button>
    </form>
  );
}
