"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { EventForm } from "@/components/EventForm";
import { buttonVariants } from "@/components/ui/button";
import type { DinnerEvent, EventDraft } from "@/types/events";
import { getSharedEvent, updateSharedEvent } from "@/lib/eventApi";
import { cn } from "@/lib/utils";

export default function EditEventPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const router = useRouter();
  const [event, setEvent] = useState<DinnerEvent | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadEvent() {
      const nextEvent = await getSharedEvent(eventId);

      if (!active) {
        return;
      }

      setEvent(nextEvent);
      setLoaded(true);
    }

    void loadEvent();

    return () => {
      active = false;
    };
  }, [eventId]);

  async function handleUpdate(draft: EventDraft) {
    await updateSharedEvent(eventId, draft);
    router.push(`/event/${eventId}/host`);
  }

  if (loaded && !event) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Event not found"
          description="Check the event home link before editing."
        />
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-5")}>
          Go home
        </Link>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href={`/event/${eventId}/host`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-5")}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Event Home
      </Link>
      <div className="mb-8">
        <p className="eyebrow">Edit</p>
        <h1 className="mt-2 text-5xl font-semibold leading-tight sm:text-6xl">Refine the invite</h1>
        <p className="mt-3 max-w-2xl text-ink/65">
          Update the details guests see on the public invite page.
        </p>
      </div>
      <EventForm event={event} submitLabel="Save changes" onSubmit={handleUpdate} />
    </main>
  );
}
