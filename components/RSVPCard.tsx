"use client";

import { useState } from "react";
import { Heart, Send, Utensils } from "lucide-react";
import type { DinnerEvent, Guest, GuestDraft, RSVPStatus } from "@/types/events";
import { getEventTheme } from "@/lib/themes";
import { cn, cleanOptional, rsvpLabels } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const statuses: RSVPStatus[] = ["yes", "maybe", "no"];

export function RSVPCard({
  event,
  onSubmit
}: {
  event?: DinnerEvent;
  onSubmit: (guest: GuestDraft) => Guest | undefined;
}) {
  const theme = getEventTheme(event?.coverStyle);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RSVPStatus>("yes");
  const [contact, setContact] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [noteToHost, setNoteToHost] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      dietaryRestrictions: cleanOptional(dietaryRestrictions),
      allergies: cleanOptional(allergies),
      noteToHost: cleanOptional(noteToHost)
    });

    if (!created) {
      setError("Something went sideways. Try that again.");
      return;
    }

    setError("");
    setMessage(
      status === "no"
        ? "Thanks for letting the host know."
        : "You're on the list! Want to bring something?"
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
                onClick={() => setStatus(candidate)}
                className={cn(
                  "min-h-12 rounded-lg px-2 text-sm font-semibold transition",
                  status === candidate
                    ? theme.cta
                    : "bg-oat/50 text-ink hover:bg-white"
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

          <div className="rounded-lg bg-oat/55 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Utensils className={cn("h-4 w-4", theme.iconText)} aria-hidden="true" />
              Anything the host should know?
            </p>
            <div className="mt-3 grid gap-3">
              <Input
                value={dietaryRestrictions}
                onChange={(event) => setDietaryRestrictions(event.target.value)}
                placeholder="Dietary restrictions"
              />
              <Input
                value={allergies}
                onChange={(event) => setAllergies(event.target.value)}
                placeholder="Allergies"
              />
              <Textarea
                value={noteToHost}
                onChange={(event) => setNoteToHost(event.target.value)}
                placeholder="Note to host"
                className="min-h-20"
              />
            </div>
          </div>

          {error ? <p className="text-sm font-semibold text-wine">{error}</p> : null}
          {message ? (
            <p className={cn("rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
              {message}
            </p>
          ) : null}

          <Button type="submit" className={cn("w-full", theme.cta)} variant="default">
            <Send className="h-4 w-4" aria-hidden="true" />
            Send RSVP
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
