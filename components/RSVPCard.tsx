"use client";

import { useState } from "react";
import { CheckCircle2, Heart, RefreshCw, Send, Utensils } from "lucide-react";
import type { ChecklistItem, DinnerEvent, Guest, GuestDraft, RSVPStatus } from "@/types/events";
import { getEventTheme } from "@/lib/themes";
import { cn, cleanOptional, normalizeVenmoHandle, rsvpLabels, venmoPaymentUrl, venmoProfileUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const statuses: RSVPStatus[] = ["yes", "maybe", "no"];
type ContributionChoice = "bring" | "later";

export function RSVPCard({
  event,
  currentGuest,
  claimedItems = [],
  selectedItems = [],
  onSubmit,
  onUpdate,
  onUpdateModeChange,
  onContributionChoice,
  onClearContributionSelection,
  onEditContributions,
  statusMessage,
  deferSubmitButton = false,
  formId
}: {
  event?: DinnerEvent;
  currentGuest?: Guest;
  claimedItems?: ChecklistItem[];
  selectedItems?: ChecklistItem[];
  onSubmit: (guest: GuestDraft) => Guest | undefined | Promise<Guest | undefined>;
  onUpdate?: (
    guest: GuestDraft,
    options?: { saveContributionSelection?: boolean }
  ) => Guest | undefined | Promise<Guest | undefined>;
  onUpdateModeChange?: (isUpdating: boolean) => void;
  onContributionChoice?: (showContributions: boolean, choice?: ContributionChoice) => void;
  onClearContributionSelection?: () => void;
  onEditContributions?: () => void;
  statusMessage?: string;
  deferSubmitButton?: boolean;
  formId?: string;
}) {
  const theme = getEventTheme(event?.coverStyle);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RSVPStatus | undefined>();
  const [contact, setContact] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState<RSVPStatus | undefined>();
  const [contributionChoice, setContributionChoice] = useState<ContributionChoice | undefined>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateRsvpStatus, setUpdateRsvpStatus] = useState<RSVPStatus | undefined>();
  const [updateContact, setUpdateContact] = useState("");
  const [updateDietaryRestrictions, setUpdateDietaryRestrictions] = useState("");

  const savedStatus = currentGuest?.rsvpStatus ?? submittedStatus;
  const venmoHandle = normalizeVenmoHandle(event?.venmoHandle ?? event?.venmoUrl);
  const claimedMoneyItems = claimedItems.filter((item) => (item.itemType ?? "bring") === "money");
  const savedMessage: Record<RSVPStatus, string> = {
    yes: "You're in!",
    maybe: "Thanks — we let the host know you're a maybe.",
    no: "Thanks — we let the host know you can't make it."
  };

  function updateStatus(nextStatus: RSVPStatus) {
    setStatus(nextStatus);
    setError("");
    setMessage(nextStatus === "yes" ? "You're in! Want to contribute?" : "");
    setContributionChoice(undefined);
    onContributionChoice?.(false);
    onClearContributionSelection?.();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!status) {
      setError("Choose whether you can make it.");
      return;
    }

    if (!name.trim()) {
      setError("Add your name so the host knows who is coming.");
      return;
    }

    const created = await onSubmit({
      name: name.trim(),
      rsvpStatus: status,
      email: contact.includes("@") ? cleanOptional(contact) : undefined,
      phone: contact.includes("@") ? undefined : cleanOptional(contact),
      dietaryRestrictions: status === "yes" ? cleanOptional(dietaryRestrictions) : undefined,
      allergies: undefined,
      noteToHost: undefined
    });

    if (!created) {
      setError("Something went wrong. Try again.");
      return;
    }

    setError("");
    setSubmittedStatus(status);
    setContributionChoice(undefined);
    onContributionChoice?.(false);
    onClearContributionSelection?.();
  }

  function chooseContribution(choice: ContributionChoice) {
    const wantsToBring = choice === "bring";

    setContributionChoice(choice);
    setMessage(
      wantsToBring
        ? "Pick anything you'd like to bring, then send your RSVP."
        : "No pressure. You can still send your RSVP now or pick something if you want."
    );
    onContributionChoice?.(true, choice);
  }

  function startUpdate() {
    if (!currentGuest) {
      return;
    }

    setUpdateRsvpStatus(currentGuest.rsvpStatus);
    setUpdateContact(currentGuest.email ?? currentGuest.phone ?? "");
    setUpdateDietaryRestrictions(currentGuest.dietaryRestrictions ?? "");
    setContributionChoice(undefined);
    onContributionChoice?.(false);
    onClearContributionSelection?.();
    onUpdateModeChange?.(true);
    setError("");
    setIsUpdating(true);
  }

  function updateResponseStatus(nextStatus: RSVPStatus) {
    setUpdateRsvpStatus(nextStatus);
    setError("");
    setMessage(nextStatus === "yes" ? "You're in! Want to contribute?" : "");
    setContributionChoice(undefined);
    onContributionChoice?.(false);
    onClearContributionSelection?.();
  }

  async function handleUpdateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentGuest || !onUpdate) {
      setError("Something went wrong. Try again.");
      return;
    }

    if (!updateRsvpStatus) {
      setError("Choose whether you can make it.");
      return;
    }

    const updated = await onUpdate(
      {
        name: currentGuest.name,
        rsvpStatus: updateRsvpStatus,
        email: updateContact.includes("@") ? cleanOptional(updateContact) : undefined,
        phone: updateContact.includes("@") ? undefined : cleanOptional(updateContact),
        dietaryRestrictions: updateRsvpStatus === "yes" ? cleanOptional(updateDietaryRestrictions) : undefined,
        allergies: undefined,
        noteToHost: undefined
      },
      { saveContributionSelection: updateRsvpStatus === "yes" && Boolean(contributionChoice) }
    );

    if (!updated) {
      setError("Something went wrong. Try again.");
      return;
    }

    setError("");
    setSubmittedStatus(updated.rsvpStatus);
    setIsUpdating(false);
  }

  if (currentGuest && isUpdating) {
    return (
      <Card className={cn("overflow-hidden border", theme.accentBorder)}>
        <div className={cn("h-2", theme.swatch)} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
            Update response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id={formId} onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {statuses.map((candidate) => (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => updateResponseStatus(candidate)}
                  className={cn(
                    "min-h-12 rounded-lg px-2 text-sm font-semibold transition",
                    updateRsvpStatus === candidate
                      ? theme.cta
                      : "bg-stone/70 text-ink hover:bg-cream"
                  )}
                >
                  {rsvpLabels[candidate]}
                </button>
              ))}
            </div>

            {updateRsvpStatus === "yes" ? (
              <div className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {message || "You're in! Want to contribute?"}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant={contributionChoice === "bring" ? "default" : "secondary"}
                    className={cn(contributionChoice === "bring" && theme.cta)}
                    aria-pressed={contributionChoice === "bring"}
                    onClick={() => chooseContribution("bring")}
                  >
                    I&apos;ll bring something
                  </Button>
                  <Button
                    type="button"
                    variant={contributionChoice === "later" ? "default" : "secondary"}
                    className={cn(contributionChoice === "later" && theme.cta)}
                    aria-pressed={contributionChoice === "later"}
                    onClick={() => chooseContribution("later")}
                  >
                    Maybe later
                  </Button>
                </div>
              </div>
            ) : null}

            <label className="grid gap-2 text-sm font-semibold">
              Email or phone
              <Input
                value={updateContact}
                onChange={(event) => setUpdateContact(event.target.value)}
                placeholder="Optional"
              />
            </label>

            {updateRsvpStatus === "yes" ? (
              <div className="rounded-lg bg-stone/70 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Utensils className={cn("h-4 w-4", theme.iconText)} aria-hidden="true" />
                  Anything the group should know?
                </p>
                <div className="mt-3 grid gap-3">
                  <Input
                    value={updateDietaryRestrictions}
                    onChange={(event) => setUpdateDietaryRestrictions(event.target.value)}
                    placeholder="Dietary restrictions or allergies"
                  />
                </div>
              </div>
            ) : null}

            {selectedItems.length > 0 ? (
              <div className="rounded-lg border border-ink/8 bg-cream p-3">
                <p className="text-sm font-semibold">Selected to bring:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/70">
                  {selectedItems.map((item) => (
                    <li key={item.id}>{item.title}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {error ? <p className="text-sm font-semibold text-terracotta">{error}</p> : null}
            {!deferSubmitButton ? (
              <Button type="submit" className={cn("w-full", theme.cta)} variant="default">
                <Send className="h-4 w-4" aria-hidden="true" />
                Save changes
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>
    );
  }

  if (savedStatus) {
    return (
      <Card className={cn("overflow-hidden border", theme.accentBorder)}>
        <div className={cn("h-2", theme.swatch)} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
            {savedStatus === "yes" ? "You're in!" : "RSVP saved"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
            {savedMessage[savedStatus]}
          </p>
          {statusMessage ? (
            <p className="rounded-lg border border-ink/8 bg-cream p-3 text-sm font-semibold text-ink/70">
              {statusMessage}
            </p>
          ) : null}
          {savedStatus === "yes" ? (
            <div className="rounded-lg border border-ink/8 bg-cream p-3">
              <p className="text-sm font-semibold">You&apos;re bringing:</p>
              {claimedItems.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/70">
                  {claimedItems.map((item) => (
                    <li key={item.id}>{item.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-ink/65">Nothing yet.</p>
              )}
              {venmoHandle && claimedMoneyItems.length > 0 ? (
                <div className="mt-3 space-y-2 rounded-lg bg-stone/70 p-3 text-sm text-ink/70">
                  {claimedMoneyItems.map((item) => {
                    const paymentUrl =
                      venmoPaymentUrl(venmoHandle, item.amountPerPerson, item.title) ??
                      venmoProfileUrl(venmoHandle);

                    return paymentUrl ? (
                      <p key={item.id}>
                        Venmo{" "}
                        <a
                          href={paymentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={cn("font-semibold underline underline-offset-2", theme.accentText)}
                        >
                          @{venmoHandle}
                        </a>{" "}
                        {item.amountPerPerson ? `$${item.amountPerPerson} ` : ""}
                        for {item.title}
                      </p>
                    ) : null;
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
          {currentGuest ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button type="button" variant="secondary" onClick={startUpdate}>
                Update response
              </Button>
              {savedStatus === "yes" && onEditContributions ? (
                <Button type="button" variant="secondary" onClick={onEditContributions}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Change what I&apos;m bringing
                </Button>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden border", theme.accentBorder)}>
      <div className={cn("h-2", theme.swatch)} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
          Can you make it?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id={formId} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {statuses.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => {
                  updateStatus(candidate);
                }}
                className={cn(
                  "min-h-12 rounded-lg px-2 text-sm font-semibold transition",
                  status === candidate
                    ? theme.cta
                    : "bg-stone/70 text-ink hover:bg-cream"
                )}
              >
                {rsvpLabels[candidate]}
              </button>
            ))}
          </div>

          {status === "yes" ? (
            <div className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {message || "You're in! Want to contribute?"}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={contributionChoice === "bring" ? "default" : "secondary"}
                  className={cn(contributionChoice === "bring" && theme.cta)}
                  aria-pressed={contributionChoice === "bring"}
                  onClick={() => chooseContribution("bring")}
                >
                  I&apos;ll bring something
                </Button>
                <Button
                  type="button"
                  variant={contributionChoice === "later" ? "default" : "secondary"}
                  className={cn(contributionChoice === "later" && theme.cta)}
                  aria-pressed={contributionChoice === "later"}
                  onClick={() => chooseContribution("later")}
                >
                  Maybe later
                </Button>
              </div>
            </div>
          ) : null}

          <label className="grid gap-2 text-sm font-semibold">
            Your name
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Email or phone
            <Input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Optional"
            />
          </label>

          {status === "yes" ? (
            <div className="rounded-lg bg-stone/70 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Utensils className={cn("h-4 w-4", theme.iconText)} aria-hidden="true" />
                Anything the group should know?
              </p>
              <div className="mt-3 grid gap-3">
                <Input
                  value={dietaryRestrictions}
                  onChange={(event) => setDietaryRestrictions(event.target.value)}
                  placeholder="Dietary restrictions or allergies"
                />
              </div>
            </div>
          ) : null}

          {selectedItems.length > 0 ? (
            <div className="rounded-lg border border-ink/8 bg-cream p-3">
              <p className="text-sm font-semibold">Selected to bring:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/70">
                {selectedItems.map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {error ? <p className="text-sm font-semibold text-terracotta">{error}</p> : null}
          {!deferSubmitButton ? (
            <Button type="submit" className={cn("w-full", theme.cta)} variant="default">
              <Send className="h-4 w-4" aria-hidden="true" />
              Send RSVP
            </Button>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
