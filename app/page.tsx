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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const heroImage =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1800&q=85";
const detailImage =
  "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=85";

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

const previewRows = [
  ["Wine", "Emma"],
  ["Salad", "Available"],
  ["Dessert", "Marcus"],
  ["Pitch in $15", "6 of 10 contributed"]
];

export default function LandingPage() {
  return (
    <main className="bg-[#100c09] text-cream">
      <section className="relative isolate overflow-hidden bg-[#100c09]">
        <Image
          src={heroImage}
          alt="Wine, herbs, and candlelit dinner details on a dark apartment table"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full scale-[1.02] object-cover object-center brightness-[0.82] contrast-[1.04] saturate-[0.82]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#100c09]/96 via-[#100c09]/72 to-[#100c09]/22" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#100c09] via-[#100c09]/58 to-[#100c09]/28" />
        <div className="mx-auto flex min-h-[88vh] max-w-6xl items-end px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
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
                  "h-12 border-cream/35 bg-cream/[0.08] text-cream backdrop-blur hover:bg-cream/15"
                )}
              >
                View sample
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#d9c39d] text-[#17120f]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              The evening starts here.
            </h2>
          </div>
          <div className="mt-10 grid overflow-hidden rounded-sm border border-[#17120f]/14 bg-[#17120f]/14 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="min-h-[240px] bg-[#dfcaa6] p-6 sm:p-7">
                  <Icon className="h-5 w-5 text-[#5a4d36]" aria-hidden="true" />
                  <h3 className="mt-10 font-display text-2xl font-semibold leading-tight text-[#17120f]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[#17120f]/68">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#100c09] text-cream">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <Image
            src={detailImage}
            alt="Wine and candlelit table details"
            fill
            sizes="50vw"
            className="object-cover opacity-[0.22] saturate-[0.78]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#100c09] via-[#100c09]/55 to-[#100c09]/20" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:py-24">
          <div>
            <Badge className="w-fit bg-honey/15 text-honey ring-1 ring-honey/20" tone="neutral">
              Host view
            </Badge>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              See the table come together before anyone arrives.
            </h2>
            <p className="mt-4 text-base leading-7 text-cream/70">
              Keep the checklist, pitch-in spots, guest notes, and dietary details in one
              composed place. No accounts, no noise, no extra ceremony.
            </p>
            <Link
              href="/create"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "mt-7 w-fit bg-[#d9c39d] text-[#17120f] hover:bg-[#cdb68c]"
              )}
            >
              Create an invite
            </Link>
          </div>

          <div className="relative min-h-[560px] overflow-hidden rounded-sm border border-cream/[0.12] bg-[#1b130f] p-4 shadow-[0_34px_100px_rgba(0,0,0,0.38)] sm:p-6">
            <Image
              src={detailImage}
              alt="Wine bottles, herbs, and a dark apartment kitchen counter"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover opacity-[0.42] saturate-[0.72]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-[#120d0a]/74 to-[#120d0a]/18" />
            <div className="relative ml-auto flex min-h-[520px] w-full max-w-[330px] items-center">
              <div className="w-full rounded-[2rem] border border-cream/[0.14] bg-[#090806] p-3 shadow-[0_28px_80px_rgba(0,0,0,0.56)]">
                <div className="rounded-[1.45rem] border border-cream/10 bg-[#14110f] p-5">
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/45">
                    Supper Club
                  </p>
                  <div className="mt-8">
                    <h3 className="font-display text-3xl font-semibold leading-none text-cream">
                      Sunday Dinner at home
                    </h3>
                    <p className="mt-4 text-xs leading-5 text-cream/55">
                      Sat, May 24
                      <br />
                      8 Sea St
                      <br />
                      Brooklyn, NY
                    </p>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["12", "In"],
                      ["3", "Maybe"],
                      ["1", "Out"]
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-md bg-cream/[0.08] px-2 py-3">
                        <p className="text-2xl font-semibold text-cream">{value}</p>
                        <p className="mt-1 text-[10px] font-semibold text-cream/50">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {previewRows.map(([item, owner]) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-md bg-cream/[0.07] px-3 py-2.5"
                      >
                        <span className="text-sm font-semibold text-cream">{item}</span>
                        <span className="text-xs text-cream/55">{owner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#d9c39d] px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-sm border border-[#17120f]/14 bg-[#dfcaa6] p-7 text-[#17120f] shadow-soft sm:grid-cols-[1fr_auto] sm:items-center sm:p-9">
          <div>
            <Wine className="h-8 w-8 text-[#5a4d36]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold">Host people well.</h2>
            <p className="mt-2 max-w-2xl text-[#17120f]/70">
              Create an invite, collect RSVPs, and let friends pitch in, without chasing the group chat.
            </p>
          </div>
          <Link href="/create" className={cn(buttonVariants({ variant: "default" }), "h-12")}>
            Start hosting
          </Link>
        </div>
      </section>
    </main>
  );
}
