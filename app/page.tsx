import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck2,
  ClipboardList,
  HandCoins,
  Salad,
  Utensils
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroImage =
  "https://images.unsplash.com/photo-1661006116755-0f7f7b1db2b8?auto=format&fit=crop&w=1800&q=85";

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
          alt="Five friends gathered around a warm apartment dinner table"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center brightness-[0.78] contrast-[1.02] saturate-[0.9]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#100c09]/96 via-[#100c09]/72 to-[#100c09]/22" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#100c09] via-[#100c09]/58 to-[#100c09]/28" />
        <div className="mx-auto flex min-h-[78vh] max-w-6xl items-end px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
          <div className="max-w-3xl text-cream">
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
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
            <p className="mt-4 text-sm font-semibold text-cream/78">
              Free to use. No accounts required.
            </p>
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
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="min-h-[232px] rounded-md border border-[#17120f]/12 bg-[#ead7b8] p-6 shadow-subtle sm:p-7"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-[#17120f] text-[#f4ead9]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-8 font-display text-2xl font-semibold leading-tight text-[#17120f]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[#17120f]/68">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f4ead9] text-[#17120f]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:py-24">
          <div>
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              See the table come together before anyone arrives.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#17120f]/68">
              Keep the checklist, pitch-in spots, guest notes, and dietary details in one calm place.
            </p>
            <Link href="/create" className={cn(buttonVariants({ variant: "default" }), "mt-7 w-fit")}>
              Create an invite
            </Link>
          </div>

          <div className="rounded-sm border border-[#17120f]/12 bg-[#fff8ee] p-4 shadow-soft sm:p-6">
            <div className="border-b border-[#17120f]/10 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b614f]">
                Sunday Dinner at home
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["12", "In"],
                  ["3", "Maybe"],
                  ["1", "Can't make it"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-md bg-[#efe1cc] p-4">
                    <p className="text-3xl font-semibold text-[#17120f]">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-[#17120f]/55">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 py-5 sm:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="text-sm font-semibold text-[#17120f]">Guest notes</p>
                <div className="mt-3 rounded-md bg-[#efe1cc] p-4">
                  <p className="text-sm leading-6 text-[#17120f]/68">
                    2 guests have dietary restrictions.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#17120f]">Contributions</p>
                <div className="mt-3 space-y-2">
                  {previewRows.map(([item, owner]) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-md bg-[#efe1cc] px-3 py-3"
                    >
                      <span className="font-semibold text-[#17120f]">{item}</span>
                      <span className="text-sm text-[#17120f]/58">{owner}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
