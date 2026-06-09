import { AlertCircle, Salad } from "lucide-react";
import type { Guest } from "@/types/events";
import { EmptyState } from "@/components/EmptyState";

export function DietarySummary({ guests }: { guests: Guest[] }) {
  const notes = guests
    .filter((guest) => guest.dietaryRestrictions || guest.allergies || guest.noteToHost)
    .map((guest) => ({
      guest,
      details: [guest.dietaryRestrictions, guest.allergies, guest.noteToHost].filter(Boolean)
    }));

  if (notes.length === 0) {
    return (
      <EmptyState
        title="No dietary notes yet"
        description="Restrictions and allergies will show up here."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {notes.map(({ guest, details }) => (
        <div key={guest.id} className="rounded-lg border border-ink/8 bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Salad className="h-4 w-4 text-sage" aria-hidden="true" />
            {guest.name}
          </p>
          <div className="mt-2 space-y-1 text-sm text-ink/65">
            {details.map((detail) => (
              <p key={detail} className="flex gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
                <span>{detail}</span>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
