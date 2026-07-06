import { UsersRound } from "lucide-react";
import type { ChecklistItem, Guest } from "@/types/events";
import type { EventTheme } from "@/lib/themes";
import { cn, rsvpLabels } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";

function themedGuestBadge(guest: Guest, theme?: EventTheme) {
  if (!theme) {
    return undefined;
  }

  if (guest.rsvpStatus === "yes") {
    return theme.chip;
  }

  if (guest.rsvpStatus === "maybe") {
    return theme.openBadge;
  }

  return "bg-ink/8 text-ink/60 ring-1 ring-ink/10";
}

export function GuestList({
  guests,
  checklistItems = [],
  showDietaryDetails = true,
  theme
}: {
  guests: Guest[];
  checklistItems?: ChecklistItem[];
  showDietaryDetails?: boolean;
  theme?: EventTheme;
}) {
  if (guests.length === 0) {
    return <EmptyState title="No guests yet" description="The list will fill in as people RSVP." />;
  }

  return (
    <div className="space-y-3">
      {guests.map((guest) => {
        const shouldShowDietaryDetails = showDietaryDetails && guest.rsvpStatus === "yes";
        const regularContributions = checklistItems.filter(
          (item) => (item.itemType ?? "bring") !== "money" && item.claimedByGuestId === guest.id
        );
        const pitchInContributions = checklistItems.filter(
          (item) =>
            (item.itemType ?? "bring") === "money" &&
            item.moneyClaims?.some((claim) => claim.guestId === guest.id)
        );

        return (
          <div
            key={guest.id}
            className={cn("rounded-lg border p-4 shadow-sm", theme?.accentBorder ?? "border-ink/8", theme?.cardAccent ?? "bg-cream")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold">
                  <UsersRound className={cn("h-4 w-4 shrink-0 text-olive", theme?.iconText)} aria-hidden="true" />
                  <span className="truncate">{guest.name}</span>
                </p>
                {regularContributions.length > 0 ? (
                  <p className="mt-1 text-sm text-ink/60">
                    Contributing {regularContributions.map((item) => item.title).join(", ")}
                  </p>
                ) : null}
                {pitchInContributions.length > 0 ? (
                  <p className="mt-1 text-sm text-ink/60">
                    Pitching in for {pitchInContributions.map((item) => item.title).join(", ")}
                  </p>
                ) : null}
              </div>
              <Badge tone={guest.rsvpStatus} className={themedGuestBadge(guest, theme)}>
                {rsvpLabels[guest.rsvpStatus]}
              </Badge>
            </div>
            {shouldShowDietaryDetails && guest.dietaryRestrictions ? (
              <p className="mt-3 text-sm font-medium text-ink/70">
                Dietary restriction: {guest.dietaryRestrictions}
              </p>
            ) : null}
            {shouldShowDietaryDetails && guest.allergies ? (
              <p className="mt-1 text-sm text-ink/65">Allergy: {guest.allergies}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
