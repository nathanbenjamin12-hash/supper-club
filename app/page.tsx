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
  "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1800&q=85";
const hostPreviewImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85";

const features = [
  {
    title: "Create in minutes",
    text: "Start with a template or build your own, then share a polished invite in just a few clicks.",
    icon: Utensils
  },
  {
    title: "Know who's coming",
    text: "Collect RSVPs, dietary restrictions, and guest updates without chasing the group chat.",
    icon: Salad
  },
  {
    title: "Let guests pitch in",
    text: "Friends can claim food, drinks, supplies, or pitch-in spots before they arrive.",
    icon: ClipboardList
  },
  {
    title: "Enjoy hosting",
    text: "See what's covered, what's still needed, and spend less time coordinating.",
    icon: HandCoins
  }
];

export default function LandingPage() {
  return (
    <main className="bg-[#17120f]">
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src={heroImage}
          alt="Candlelit dinner table with wine and shared plates at home"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center saturate-[0.9]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#17120f]/90 via-[#17120f]/62 to-[#17120f]/24" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#17120f] via-[#17120f]/72 to-[#17120f]/28" />
        <div className="mx-auto flex min-h-[82vh] max-w-6xl items-end px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="max-w-3xl text-cream">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-honey">
              <Leaf className="h-4 w-4" aria-hidden="true" />
              HOST PEOPLE WELL
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl">
              Hosting is more fun when everyone pitches in.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/86">
              Create an invite, collect RSVPs, and let guests claim what they&apos;ll bring, all in one place.
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

      <section className="border-y border-cream/10 bg-[#17120f] text-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold leading-tight text-cream sm:text-5xl">
              The evening starts here.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="border-cream/10 bg-cream/[0.07] text-cream shadow-none"
                >
                  <CardHeader>
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-cream/10 text-honey ring-1 ring-cream/10">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <CardTitle className="text-cream">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-cream/68">{feature.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f5ede4]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <Badge className="w-fit bg-ink text-cream ring-0" tone="neutral">
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

          <Card className="overflow-hidden border-ink/10 bg-[#1f1713] text-cream shadow-soft">
            <div className="relative h-64 sm:h-80">
              <Image
                src={hostPreviewImage}
                alt="Shared plates, wine, and dinner details on a home table"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover opacity-90 saturate-[0.92]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1713]/70 via-transparent to-transparent" />
            </div>
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  ["12", "In"],
                  ["3", "Maybe"],
                  ["1", "Can't make it"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-md bg-cream/10 p-3 ring-1 ring-cream/10">
                    <p className="text-3xl font-semibold text-cream">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-cream/58">{label}</p>
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
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-md bg-cream/[0.08] p-3 ring-1 ring-cream/10"
                  >
                    <span className="font-semibold text-cream">{item}</span>
                    <span className="text-sm text-cream/62">{owner}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-[#f5ede4] px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 rounded-lg border border-cream/12 bg-[#17120f] p-6 text-cream shadow-soft sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <Wine className="h-8 w-8 text-honey" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold">Host people well.</h2>
            <p className="mt-2 max-w-2xl text-cream/72">
              Create an invite, collect RSVPs, and let friends pitch in, without chasing the group chat.
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
