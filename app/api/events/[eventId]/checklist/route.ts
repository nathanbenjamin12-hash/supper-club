import { NextResponse } from "next/server";
import { addStoredChecklistItem, getStoredEventBundle } from "@/lib/serverEventStore";

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
    const item = await addStoredChecklistItem(eventId, data);
    const bundle = await getStoredEventBundle(eventId);

    if (!item || !bundle) {
      return json({ error: "Event not found." }, 404);
    }

    return json({ item, bundle }, 201);
  } catch {
    return json({ error: "Unable to add item." }, 400);
  }
}
