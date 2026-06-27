"use client";

import { useState } from "react";
import { ArrowUp, CheckCircle2, Heart, Send, Utensils } from "lucide-react";
import type { ChecklistItem, DinnerEvent, Guest, GuestDraft, RSVPStatus } from "@/types/events";
import { getEventTheme } from "@/lib/themes";
import { cn, cleanOptional, rsvpLabels } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const statuses: RSVPStatus[] = ["yes", "maybe", "no"];

export function RSVPCard({
  event,
  currentGuest,
  claimedItems = [],
  selectedItems = [],
  onSubmit,
  onBackToTop,
  onContributionChoice,
  onClearContributionSelection
}: {
  event?: DinnerEvent;
  currentGuest?: Guest;
  claimedItems?: ChecklistItem[];
  selectedItems?: ChecklistItem[];
  onSubmit: (guest: GuestDraft) => Guest | undefined | Promise<Guest | undefined>;
  onBackToTop?: () => void;
  onContributionChoice?: (showContributions: boolean) => void;
  onClearContributionSelection?: () => void;
}) {
  const theme = getEventTheme(event?.coverStyle);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RSVPStatus | undefined>();
  const [contact, setContact] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [noteToHost, setNoteToHost] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState<RSVPStatus | undefined>();
  const [contributionChoice, setContributionChoice] = useState<"bring" | "later" | undefined>();

  const savedStatus = currentGuest?.rsvpStatus ?? submittedStatus;
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
      noteToHost: cleanOptional(noteToHost)
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

  function chooseContribution(showContributions: boolean) {
    setContributionChoice(showContributions ? "bring" : "later");
    setMessage(
      showContributions
        ? "Pick anything you'd like to bring, then send your RSVP."
        : "No pressure. You can still send your RSVP now or pick something if you want."
    );
    onContributionChoice?.(true);
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
          {savedStatus === "yes" && claimedItems.length > 0 ? (
            <div className="rounded-lg border border-ink/8 bg-cream p-3">
              <p className="text-sm font-semibold">You&apos;re bringing:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/70">
                {claimedItems.map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {savedStatus !== "yes" && onBackToTop ? (
            <Button type="button" variant="ghost" size="sm" onClick={onBackToTop}>
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Back to top
            </Button>
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {!contributionChoice ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="default"
                    className={cn(theme.cta)}
                    onClick={() => chooseContribution(true)}
                  >
                    I&apos;ll bring something
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => chooseContribution(false)}>
                    Maybe later
                  </Button>
                </div>
              ) : null}
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

          <div className="rounded-lg bg-stone/70 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Utensils className={cn("h-4 w-4", theme.iconText)} aria-hidden="true" />
              Anything the host should know?
            </p>
            <div className="mt-3 grid gap-3">
              {status === "yes" ? (
                <Input
                  value={dietaryRestrictions}
                  onChange={(event) => setDietaryRestrictions(event.target.value)}
                  placeholder="Dietary restrictions"
                />
              ) : null}
              <Textarea
                value={noteToHost}
                onChange={(event) => setNoteToHost(event.target.value)}
                placeholder="Note to host"
                className="min-h-20"
              />
            </div>
          </div>

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
          <Button type="submit" className={cn("w-full", theme.cta)} variant="default">
            <Send className="h-4 w-4" aria-hidden="true" />
            Send RSVP
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
