import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supper Club",
  description: "Elegant invites, RSVPs, and contribution planning for thoughtful hosting."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-ink/8 bg-cream shadow-subtle">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <span className="text-olive">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl leading-none">Supper Club</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm font-medium sm:gap-4">
              <Link
                href="/event/sample-dinner-party"
                className="whitespace-nowrap text-ink/64 transition hover:text-ink"
              >
                Sample invite
              </Link>
              <Link
                href="/create"
                className="inline-flex h-10 shrink-0 items-center rounded-md bg-ink px-4 text-sm font-semibold text-cream shadow-subtle transition hover:bg-olive"
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
