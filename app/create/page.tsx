"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EventForm } from "@/components/EventForm";
import { createEvent } from "@/lib/events";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChecklistItemDraft, EventDraft } from "@/types/events";

export default function CreateEventPage() {
  const router = useRouter();

  function handleCreate(draft: EventDraft, starterItems?: ChecklistItemDraft[]) {
    const event = createEvent(draft, starterItems);
    router.push(`/event/${event.id}/host`);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-5")}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Home
      </Link>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Create</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Make a party board</h1>
        <p className="mt-3 max-w-2xl text-ink/65">
          Add the basics, choose a starter checklist, and you&apos;ll get a shareable
          invite link for guests.
        </p>
      </div>
      <EventForm submitLabel="Create invite" onSubmit={handleCreate} />
    </main>
  );
}
