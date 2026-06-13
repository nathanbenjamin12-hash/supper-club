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
        const showDietaryDetails = guest.rsvpStatus === "yes";
        const contributions = checklistItems.filter(
          (item) =>
            item.claimedByGuestId === guest.id ||
            item.moneyClaims?.some((claim) => claim.guestId === guest.id)
        );

        return (
          <div
            key={guest.id}
            className="rounded-lg border border-ink/8 bg-cream p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold">
                  <UsersRound className="h-4 w-4 shrink-0 text-olive" aria-hidden="true" />
                  <span className="truncate">{guest.name}</span>
                </p>
                {contributions.length > 0 ? (
                  <p className="mt-1 text-sm text-ink/60">
                    Contributing {contributions.map((item) => item.title).join(", ")}
                  </p>
                ) : null}
              </div>
              <Badge tone={guest.rsvpStatus}>{rsvpLabels[guest.rsvpStatus]}</Badge>
            </div>
            {showDietaryDetails && guest.dietaryRestrictions ? (
              <p className="mt-3 text-sm font-medium text-ink/70">
                Dietary restriction: {guest.dietaryRestrictions}
              </p>
            ) : null}
            {showDietaryDetails && guest.allergies ? (
              <p className="mt-1 text-sm text-ink/65">Allergy: {guest.allergies}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
