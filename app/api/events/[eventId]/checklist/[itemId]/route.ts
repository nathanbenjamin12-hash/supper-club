import { NextResponse } from "next/server";
import {
  deleteStoredChecklistItem,
  getStoredEventBundle,
  updateStoredChecklistItem
} from "@/lib/serverEventStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ eventId: string; itemId: string }>;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { eventId, itemId } = await context.params;
    const { data } = await request.json();
    const item = await updateStoredChecklistItem(eventId, itemId, data);
    const bundle = await getStoredEventBundle(eventId);

    if (!item || !bundle) {
      return json({ error: "Item not found." }, 404);
    }

    return json({ item, bundle });
  } catch {
    return json({ error: "Unable to update item." }, 400);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { eventId, itemId } = await context.params;
    const deleted = await deleteStoredChecklistItem(eventId, itemId);

    if (!deleted) {
      return json({ error: "Item not found." }, 404);
    }

    return json({ deleted });
  } catch {
    return json({ error: "Unable to delete item." }, 400);
  }
}
