import {
  claimStoredChecklistItem,
  getStoredEventBundle,
  releaseStoredChecklistItemClaim
} from "@/lib/serverEventStore";
import { eventStoreErrorResponse, json } from "@/lib/serverApiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ eventId: string }>;
};

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
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to claim item." }, 400);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { eventId } = await context.params;
    const { itemId, guestId } = await request.json();
    const item = await releaseStoredChecklistItemClaim(eventId, itemId, guestId);
    const bundle = await getStoredEventBundle(eventId);

    if (!item || !bundle) {
      return json({ error: "Claim not found." }, 404);
    }

    return json({ item, bundle });
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to remove claim." }, 400);
  }
}
