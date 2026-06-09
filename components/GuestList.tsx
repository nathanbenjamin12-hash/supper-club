import { UsersRound } from "lucide-react";
import type { ChecklistItem, Guest } from "@/types/events";
import { rsvpLabels } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";

export function GuestList({
  guests,
  checklistItems = []
}: {
  guests: Guest[];
  checklistItems?: ChecklistItem[];
}) {
  if (guests.length === 0) {
    return <EmptyState title="No guests yet" description="The list will fill in as people RSVP." />;
  }

  return (
    <div className="space-y-3">
      {guests.map((guest) => {
        const contributions = checklistItems.filter((item) => item.claimedByGuestId === guest.id);

        return (
          <div
            key={guest.id}
            className="rounded-lg border border-ink/8 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold">
                  <UsersRound className="h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
                  <span className="truncate">{guest.name}</span>
                </p>
                {contributions.length > 0 ? (
                  <p className="mt-1 text-sm text-ink/60">
                    Bringing {contributions.map((item) => item.title).join(", ")}
                  </p>
                ) : null}
              </div>
              <Badge tone={guest.rsvpStatus}>{rsvpLabels[guest.rsvpStatus]}</Badge>
            </div>
            {guest.dietaryRestrictions || guest.allergies ? (
              <p className="mt-3 text-sm text-ink/65">
                {[guest.dietaryRestrictions, guest.allergies].filter(Boolean).join(" | ")}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
