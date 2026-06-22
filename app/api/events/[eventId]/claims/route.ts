import { NextResponse } from "next/server";
import { claimStoredChecklistItem, getStoredEventBundle } from "@/lib/serverEventStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ eventId: string }>;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { eventId } = await context.params;
    const { itemId, guestId, note } = await request.json();
    const item = await claimStoredChecklistItem(eventId, itemId, guestId, note);
    const bundle = await getStoredEventBundle(eventId);

    if (!item || !bundle) {
      return json({ error: "Claim not found." }, 404);
    }

    return json({ item, bundle });
  } catch {
    return json({ error: "Unable to claim item." }, 400);
  }
}
