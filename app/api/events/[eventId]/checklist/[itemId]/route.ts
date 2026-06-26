import {
  deleteStoredChecklistItem,
  getStoredEventBundle,
  updateStoredChecklistItem
} from "@/lib/serverEventStore";
import { eventStoreErrorResponse, json } from "@/lib/serverApiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ eventId: string; itemId: string }>;
};

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
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

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
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to delete item." }, 400);
  }
}
