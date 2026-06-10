import { DollarSign, ExternalLink } from "lucide-react";
import type { DinnerEvent } from "@/types/events";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, normalizeVenmoHandle, venmoProfileUrl } from "@/lib/utils";
import { getEventTheme } from "@/lib/themes";

export function PitchInCard({ event, hostView = false }: { event: DinnerEvent; hostView?: boolean }) {
  if (!event.pitchInEnabled) {
    return null;
  }

  const venmoHandle = normalizeVenmoHandle(event.venmoHandle ?? event.venmoUrl);
  const paymentUrl = venmoProfileUrl(venmoHandle);
  const theme = getEventTheme(event.coverStyle);

  return (
    <Card className={cn("overflow-hidden border", theme.accentBorder)}>
      <div className={cn("h-2", theme.swatch)} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className={cn("h-5 w-5", theme.iconText)} aria-hidden="true" />
          Pitch in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-ink/65">
          Help cover groceries, drinks, delivery, or hosting supplies.
        </p>
        {venmoHandle ? (
          <p className={cn("mt-3 rounded-lg p-3 text-sm font-semibold", theme.softPanel, theme.accentText)}>
            Venmo: @{venmoHandle}
          </p>
        ) : null}
        {event.recommendedContributionAmount !== undefined ? (
          <div className={cn("mt-3 rounded-lg p-4", theme.softPanel)}>
            <p className={cn("text-sm font-semibold", theme.accentText)}>Recommended amount</p>
            <p className="mt-1 text-3xl font-semibold text-ink">
              ${event.recommendedContributionAmount}
            </p>
          </div>
        ) : null}
        {paymentUrl ? (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "default" }), theme.cta, "mt-3 w-full")}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open Venmo
          </a>
        ) : (
          <p className="mt-3 rounded-lg bg-stone/70 p-3 text-sm text-ink/60">
            {hostView
              ? "Add a Venmo handle on the edit page if you want guests to tap straight through."
              : "The host did not add a Venmo handle yet."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
