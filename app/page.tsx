import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck2,
  ClipboardList,
  HandCoins,
  Leaf,
  Salad,
  Utensils,
  Wine
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const heroImage =
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1800&q=85";

const features = [
  {
    title: "Elegant invites",
    text: "Share the essential details in a guest experience that feels considered from the first tap.",
    icon: Utensils
  },
  {
    title: "RSVPs with context",
    text: "Collect responses, dietary notes, allergies, and host notes without chasing the group chat.",
    icon: Salad
  },
  {
    title: "Thoughtful contributions",
    text: "Let guests claim dishes, drinks, supplies, or pitch-in spots with clear availability.",
    icon: ClipboardList
  },
  {
    title: "Host clarity",
    text: "Review what is needed, who is coming, and what everyone is bringing before dinner.",
    icon: HandCoins
  }
];

export default function LandingPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroImage}
          alt="Friends gathered around a casual dinner table at home"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/86 via-ink/48 to-ink/18" />
        <div className="mx-auto flex min-h-[72vh] max-w-6xl items-end px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="max-w-3xl text-cream">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cream/80">
              <Leaf className="h-4 w-4" aria-hidden="true" />
              Host people well
            </p>
            <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl">
              Dinner, thoughtfully planned.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/82">
              Supper Club helps hosts send refined invites, collect RSVPs, coordinate
              contributions, and keep the table feeling easy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/create" className={cn(buttonVariants({ variant: "default" }), "h-12")}>
                <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
                Create an invite
              </Link>
              <Link
                href="/event/sample-dinner-party"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 border-cream/40 bg-cream/10 text-cream backdrop-blur hover:bg-cream/18"
                )}
              >
                View sample
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-linen border-b border-ink/8">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">A calmer way to gather</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              The details stay organized, so the evening can feel generous.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-stone text-olive">
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
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <Badge className="w-fit" tone="neutral">
            Host view
          </Badge>
          <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            See the table come together before anyone arrives.
          </h2>
          <p className="mt-4 text-base leading-7 text-ink/68">
            Keep the checklist, pitch-in spots, guest notes, and dietary details in one
            composed place. No accounts, no noise, no extra ceremony.
          </p>
          <Link href="/create" className={cn(buttonVariants({ variant: "default" }), "mt-7 w-fit")}>
            Create an invite
          </Link>
        </div>

        <Card className="overflow-hidden bg-cream">
          <div className="relative h-56 sm:h-72">
            <Image
              src="https://images.unsplash.com/photo-1772724317488-b901d235d419?auto=format&fit=crop&w=1200&q=80"
              alt="Friends making pizza together in a home kitchen"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <CardContent className="space-y-5 pt-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["12", "In"],
                ["3", "Maybe"],
                ["1", "Can't make it"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-md bg-stone p-3">
                  <p className="text-3xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-ink/55">{label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                ["Wine", "Emma"],
                ["Salad", "Available"],
                ["Dessert", "Marcus"],
                ["Pitch in $15", "6 of 10 contributed"]
              ].map(([item, owner]) => (
                <div key={item} className="flex items-center justify-between rounded-md bg-stone/70 p-3">
                  <span className="font-semibold">{item}</span>
                  <span className="text-sm text-ink/60">{owner}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 rounded-lg bg-ink p-6 text-cream sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <Wine className="h-8 w-8 text-honey" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold">Let the evening feel easy.</h2>
            <p className="mt-2 max-w-2xl text-cream/72">
              Supper Club keeps the practical planning quiet, clear, and ready for guests.
            </p>
          </div>
          <Link href="/create" className={cn(buttonVariants({ variant: "secondary" }), "h-12")}>
            Start hosting
          </Link>
        </div>
      </section>
    </main>
  );
}
