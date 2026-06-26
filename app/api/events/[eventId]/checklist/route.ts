import { addStoredChecklistItem, getStoredEventBundle } from "@/lib/serverEventStore";
import { eventStoreErrorResponse, json } from "@/lib/serverApiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ eventId: string }>;
};

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
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to add item." }, 400);
  }
}
