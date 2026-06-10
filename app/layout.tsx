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
        <header className="sticky top-0 z-30 border-b border-ink/8 bg-cream/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-md border border-olive/20 bg-stone text-olive">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl leading-none">Supper Club</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/event/sample-dinner-party"
                className="hidden rounded-md px-3 py-2 text-ink/65 transition hover:bg-stone hover:text-ink sm:inline-flex"
              >
                Sample invite
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center rounded-md bg-olive px-4 py-2 text-sm font-semibold text-cream shadow-subtle transition hover:bg-[#556149]"
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
