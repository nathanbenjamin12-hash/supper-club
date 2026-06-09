import { CalendarDays, MapPin, Sparkles, UserRound } from "lucide-react";
import type { DinnerEvent } from "@/types/events";
import { cn, eventTypeLabels, formatEventDate } from "@/lib/utils";
import { getEventTheme } from "@/lib/themes";
import { Badge } from "@/components/ui/badge";

export function EventHero({ event }: { event: DinnerEvent }) {
  const theme = getEventTheme(event.coverStyle);

  return (
    <section className={cn("overflow-hidden rounded-lg border bg-white shadow-soft", theme.accentBorder)}>
      <div className={cn("relative isolate min-h-52 overflow-hidden p-5 text-white sm:min-h-64 sm:p-8", theme.heroGradient)}>
        <div className={cn("absolute -right-12 -top-12 -z-10 h-48 w-48 rounded-full blur-3xl", theme.glow)} />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-black/18 to-transparent" />
        <div className="absolute right-5 top-5 hidden rotate-3 rounded-lg border border-white/25 bg-white/12 px-4 py-3 text-sm font-semibold text-white shadow-soft backdrop-blur sm:block">
          {theme.label}
        </div>
        <Badge className="bg-white/90 text-ink" tone="neutral">
          {eventTypeLabels[event.eventType]}
        </Badge>
        <div className="mt-16 max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Hosted by {event.hostName}
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-6xl">
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
