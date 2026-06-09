import Link from "next/link";
import {
  CalendarCheck2,
  ClipboardList,
  Gamepad2,
  PartyPopper,
  Salad,
  Sparkles,
  Wine
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Beautiful invites",
    text: "Send a mobile-friendly party page with the details people actually need.",
    icon: PartyPopper
  },
  {
    title: "Potluck checklist",
    text: "Let guests claim dishes, drinks, games, and supplies without a spreadsheet.",
    icon: ClipboardList
  },
  {
    title: "Dietary restrictions",
    text: "Collect restrictions and allergies gently, then see them in one host view.",
    icon: Salad
  },
  {
    title: "Games & supplies",
    text: "Coordinate the practical stuff too: ice, chairs, cards, score pads, and more.",
    icon: Gamepad2
  }
];

export default function LandingPage() {
  return (
    <main>
      <section className="surface-grid">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:py-20">
          <div className="flex flex-col justify-center">
            <Badge className="w-fit" tone="neutral">
              <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              Shared party planning, minus the chaos
            </Badge>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-7xl">
              Plan dinner parties without the group chat chaos.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              Send a beautiful invite, collect RSVPs, coordinate food, track dietary
              restrictions, and see who&apos;s bringing what.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/create" className={cn(buttonVariants({ variant: "clay" }), "h-12")}>
                <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
                Create an invite
              </Link>
              <Link href="/event/sample-dinner-party" className={cn(buttonVariants({ variant: "secondary" }), "h-12")}>
                View sample
              </Link>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-tomato via-clay to-marigold p-6 text-white">
              <Badge className="bg-white/90 text-ink" tone="neutral">
                Saturday, July 18
              </Badge>
              <h2 className="mt-16 text-4xl font-semibold leading-tight">
                Pasta Night at Nathan&apos;s
              </h2>
              <p className="mt-2 text-white/85">7:00 PM | Philadelphia</p>
            </div>
            <CardContent className="space-y-4 pt-5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-sage/12 p-3">
                  <p className="text-2xl font-semibold">8</p>
                  <p className="text-xs font-semibold text-ink/55">In</p>
                </div>
                <div className="rounded-lg bg-marigold/18 p-3">
                  <p className="text-2xl font-semibold">3</p>
                  <p className="text-xs font-semibold text-ink/55">Maybe</p>
                </div>
                <div className="rounded-lg bg-wine/10 p-3">
                  <p className="text-2xl font-semibold">2</p>
                  <p className="text-xs font-semibold text-ink/55">Out</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ["Red wine", "Sarah"],
                  ["Caesar salad", "Emma"],
                  ["Dessert", "Still needed"],
                  ["Board game", "Still needed"]
                ].map(([item, owner]) => (
                  <div key={item} className="flex items-center justify-between rounded-lg bg-oat/50 p-3">
                    <span className="font-semibold">{item}</span>
                    <span className="text-sm text-ink/60">{owner}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-ink/65">{feature.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 rounded-lg bg-ink p-6 text-cream sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <Wine className="h-8 w-8 text-marigold" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold">Start with one invite.</h2>
            <p className="mt-2 max-w-2xl text-cream/70">
              SupperClub keeps the RSVP, potluck, games, and dietary details in one
              friendly shared board.
            </p>
          </div>
          <Link href="/create" className={cn(buttonVariants({ variant: "secondary" }), "h-12")}>
            Create an invite
          </Link>
        </div>
      </section>
    </main>
  );
}
