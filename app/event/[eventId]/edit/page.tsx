"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { EventForm } from "@/components/EventForm";
import { buttonVariants } from "@/components/ui/button";
import type { DinnerEvent, EventDraft } from "@/types/events";
import { getEvent, updateEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

export default function EditEventPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const router = useRouter();
  const [event, setEvent] = useState<DinnerEvent | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEvent(getEvent(eventId));
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [eventId]);

  function handleUpdate(draft: EventDraft) {
    updateEvent(eventId, draft);
    router.push(`/event/${eventId}/host`);
  }

  if (loaded && !event) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Event not found"
          description="Check the dashboard link before editing."
        />
        <Link href="/" className={cn(buttonVariants({ variant: "clay" }), "mt-5")}>
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
        Dashboard
      </Link>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Edit</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Tune the invite</h1>
        <p className="mt-3 max-w-2xl text-ink/65">
          Update the details guests see on the public invite page.
        </p>
      </div>
      <EventForm event={event} submitLabel="Save changes" onSubmit={handleUpdate} />
    </main>
  );
}
