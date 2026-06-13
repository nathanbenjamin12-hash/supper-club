"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Heart, Send, Utensils } from "lucide-react";
import type { DinnerEvent, Guest, GuestDraft, RSVPStatus } from "@/types/events";
import { getEventTheme } from "@/lib/themes";
import { cn, cleanOptional, rsvpLabels } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const statuses: RSVPStatus[] = ["yes", "maybe", "no"];

export function RSVPCard({
  event,
  onSubmit,
  onContributionChoice,
  completionMessage,
  onComplete
}: {
  event?: DinnerEvent;
  onSubmit: (guest: GuestDraft) => Guest | undefined;
  onContributionChoice?: (showContributions: boolean) => void;
  completionMessage?: string;
  onComplete?: (message: string) => void;
}) {
  const theme = getEventTheme(event?.coverStyle);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RSVPStatus>("yes");
  const [contact, setContact] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [noteToHost, setNoteToHost] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState<RSVPStatus | undefined>();
  const [contributionChoice, setContributionChoice] = useState<"bring" | "later" | undefined>();
  const [localCompletionMessage, setLocalCompletionMessage] = useState("");
  const finalMessage = completionMessage || localCompletionMessage;

  const submitLabels: Record<RSVPStatus, string> = {
    yes: "Confirm I'm in",
    maybe: "Send maybe",
    no: "Send regrets"
  };

  function completeFlow(nextMessage: string) {
    setLocalCompletionMessage(nextMessage);
    setMessage("");
    onContributionChoice?.(false);
    onComplete?.(nextMessage);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Add your name so the host knows who is coming.");
      return;
    }

    const created = onSubmit({
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
    if (status === "yes") {
      setMessage("You're in! Want to contribute?");
      return;
    }

    completeFlow(
      status === "maybe"
        ? "Thanks — we let the host know you're a maybe."
        : "Thanks — we let the host know you can't make it."
    );
  }

  function chooseContribution(showContributions: boolean) {
    if (!showContributions) {
      setContributionChoice("later");
      completeFlow("You're all set.");
      return;
    }

    setContributionChoice("bring");
    setMessage("Pick anything you'd like to bring, then send your RSVP.");
    onContributionChoice?.(showContributions);
  }

  if (finalMessage) {
    return (
      <Card className={cn("sticky top-20 overflow-hidden border", theme.accentBorder)}>
        <div className={cn("h-2", theme.swatch)} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
            RSVP saved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
            {finalMessage}
          </p>
          {event ? (
            <Link
              href={`/event/${event.id}`}
              className={cn(buttonVariants({ variant: "default" }), "w-full", theme.cta)}
            >
              Back to invite
            </Link>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (submittedStatus === "yes") {
    return (
      <Card className={cn("sticky top-20 overflow-hidden border", theme.accentBorder)}>
        <div className={cn("h-2", theme.swatch)} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
            You&apos;re in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {message}
            </p>
            {contributionChoice === "bring" ? (
              <p className="mt-2 text-xs font-medium text-ink/60">
                Claim one or more open items below. Your RSVP is already saved.
              </p>
            ) : (
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
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("sticky top-20 overflow-hidden border", theme.accentBorder)}>
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
                  setStatus(candidate);
                  setError("");
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

          {error ? <p className="text-sm font-semibold text-terracotta">{error}</p> : null}
          <Button type="submit" className={cn("w-full", theme.cta)} variant="default">
            <Send className="h-4 w-4" aria-hidden="true" />
            {submitLabels[status]}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
