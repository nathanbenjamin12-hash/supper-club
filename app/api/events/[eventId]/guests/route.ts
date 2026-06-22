import { NextResponse } from "next/server";
import { createStoredGuest, getStoredEventBundle } from "@/lib/serverEventStore";

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
    const { data } = await request.json();
    const guest = await createStoredGuest(eventId, data);
    const bundle = await getStoredEventBundle(eventId);

    if (!guest || !bundle) {
      return json({ error: "Event not found." }, 404);
    }

    return json({ guest, bundle }, 201);
  } catch {
    return json({ error: "Unable to save RSVP." }, 400);
  }
}
