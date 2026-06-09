"use client";

import { Check, Flame, Gamepad2, Gift, HeartHandshake, Utensils } from "lucide-react";
import type { EventType } from "@/types/events";
import { cn, eventTypeLabels } from "@/lib/utils";

const templateIcons: Record<EventType, React.ComponentType<{ className?: string }>> = {
  dinner_party: Utensils,
  bbq: Flame,
  game_night: Gamepad2,
  friendsgiving: HeartHandshake,
  birthday: Gift,
  custom: Check
};

const descriptions: Record<EventType, string> = {
  dinner_party: "Wine, sides, dessert, and table helpers.",
  bbq: "Grill basics, cold drinks, lawn games.",
  game_night: "Snacks, drinks, games, and score pads.",
  friendsgiving: "Classic sides, pies, serving pieces.",
  birthday: "Cake, snacks, candles, and party bits.",
  custom: "Start with an empty board."
};

export function TemplatePicker({
  value,
  onChange
}: {
  value: EventType;
  onChange: (value: EventType) => void;
}) {
  const options: EventType[] = [
    "custom",
    "dinner_party",
    "bbq",
    "game_night",
    "friendsgiving",
    "birthday"
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const Icon = templateIcons[option];
        const selected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "min-h-28 rounded-lg border p-4 text-left transition",
              selected
                ? "border-clay bg-clay/8 shadow-sm"
                : "border-ink/10 bg-white hover:border-clay/40"
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {selected ? (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-clay text-white">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : null}
            </span>
            <span className="mt-3 block font-semibold">{eventTypeLabels[option]}</span>
            <span className="mt-1 block text-sm text-ink/60">{descriptions[option]}</span>
          </button>
        );
      })}
    </div>
  );
}
