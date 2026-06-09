import type { Metadata } from "next";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupperClub",
  description: "Beautiful invites, RSVPs, and shared party checklists."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-black/5 bg-cream/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-cream">
                <PartyPopper className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>SupperClub</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/event/sample-dinner-party"
                className="hidden rounded-full px-3 py-2 text-ink/70 transition hover:bg-white hover:text-ink sm:inline-flex"
              >
                Sample invite
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream shadow-soft transition hover:-translate-y-0.5"
              >
                Create invite
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
