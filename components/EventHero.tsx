import Image from "next/image";
import { CalendarDays, MapPin, UserRound } from "lucide-react";
import type { DinnerEvent } from "@/types/events";
import { cn, eventTypeLabels, formatEventDate } from "@/lib/utils";
import { getEventTheme } from "@/lib/themes";
import { Badge } from "@/components/ui/badge";

export function EventHero({ event }: { event: DinnerEvent }) {
  const theme = getEventTheme(event.coverStyle);

  return (
    <section className={cn("overflow-hidden rounded-lg bg-cream shadow-soft ring-1 ring-ink/8", theme.accentBorder)}>
      <div className={cn("relative isolate min-h-[26rem] overflow-hidden p-5 text-cream sm:min-h-[30rem] sm:p-8", theme.heroGradient)}>
        <Image
          src={theme.imageUrl}
          alt={theme.imageAlt}
          fill
          sizes="(min-width: 1024px) 760px, 100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/82 via-ink/42 to-ink/12" />
        <div className="absolute right-5 top-5 hidden rounded-md border border-cream/25 bg-cream/12 px-4 py-3 text-sm font-semibold text-cream shadow-subtle backdrop-blur sm:block">
          {theme.label}
        </div>
        <Badge className="bg-cream/90 text-ink ring-cream/30" tone="neutral">
          {eventTypeLabels[event.eventType]}
        </Badge>
        <div className="mt-28 max-w-2xl sm:mt-36">
          <p className="flex items-center gap-2 text-sm font-semibold text-cream/85">
            <UserRound className="h-4 w-4" aria-hidden="true" />
            Hosted by {event.hostName}
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] sm:text-7xl">
            {event.title}
          </h1>
        </div>
      </div>
      <div className={cn("grid gap-4 p-5 sm:grid-cols-3 sm:p-6", theme.softPanel)}>
        <div className="flex gap-3">
          <CalendarDays className={cn("mt-0.5 h-5 w-5", theme.iconText)} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">{formatEventDate(event.date)}</p>
            <p className="text-sm text-ink/60">{event.time || "Time TBD"}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin className={cn("mt-0.5 h-5 w-5", theme.iconText)} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">Location</p>
            <p className="text-sm text-ink/60">{event.location || "Location coming soon"}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <UserRound className={cn("mt-0.5 h-5 w-5", theme.iconText)} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">Host</p>
            <p className="text-sm text-ink/60">{event.hostName}</p>
          </div>
        </div>
      </div>
      {event.description ? (
        <div className="border-t border-ink/8 px-5 py-4 text-ink/75 sm:px-6">
          {event.description}
        </div>
      ) : null}
    </section>
  );
}
