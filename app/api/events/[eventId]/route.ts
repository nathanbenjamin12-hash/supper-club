import { NextResponse } from "next/server";
import { getStoredEventBundle, updateStoredEvent } from "@/lib/serverEventStore";

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

export async function GET(_request: Request, context: RouteContext) {
  const { eventId } = await context.params;
  const bundle = await getStoredEventBundle(eventId);

  if (!bundle) {
    return json({ error: "Event not found." }, 404);
  }

  return json({ bundle });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { eventId } = await context.params;
    const { data } = await request.json();
    const event = await updateStoredEvent(eventId, data);

    if (!event) {
      return json({ error: "Event not found." }, 404);
    }

    return json({ event });
  } catch {
    return json({ error: "Unable to update event." }, 400);
  }
}
