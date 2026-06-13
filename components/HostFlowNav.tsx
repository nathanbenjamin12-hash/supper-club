import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HostFlowStep = "setup" | "share" | "preview";

const steps: { key: HostFlowStep; label: string; href: (eventId: string) => string }[] = [
  { key: "setup", label: "Event Setup", href: (eventId) => `/event/${eventId}/edit` },
  { key: "share", label: "Setup & Share", href: (eventId) => `/event/${eventId}/host` },
  { key: "preview", label: "Preview Invite", href: (eventId) => `/event/${eventId}?preview=host` }
];

export function HostFlowNav({
  eventId,
  currentStep,
  backLabel,
  backHref
}: {
  eventId: string;
  currentStep: HostFlowStep;
  backLabel: string;
  backHref: string;
}) {
  return (
    <nav className="mb-5 space-y-3" aria-label="Host setup flow">
      <Link
        href={backHref}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "bg-cream/65 backdrop-blur"
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/50">
        {steps.map((step, index) => {
          const isCurrent = step.key === currentStep;

          return (
            <li key={step.key} className="flex items-center gap-2">
              {index > 0 ? <span className="text-ink/25">/</span> : null}
              {isCurrent ? (
                <span className="rounded-md bg-sage/18 px-2.5 py-1 text-olive ring-1 ring-olive/15">
                  {step.label}
                </span>
              ) : (
                <Link
                  href={step.href(eventId)}
                  className="rounded-md px-2.5 py-1 transition hover:bg-stone hover:text-ink"
                >
                  {step.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
