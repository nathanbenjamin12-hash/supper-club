import { getStoredEventBundle, updateStoredEvent } from "@/lib/serverEventStore";
import { eventStoreErrorResponse, json } from "@/lib/serverApiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ eventId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { eventId } = await context.params;
    const bundle = await getStoredEventBundle(eventId);

    if (!bundle) {
      return json({ error: "Event not found." }, 404);
    }

    return json({ bundle });
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to load event." }, 500);
  }
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
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to update event." }, 400);
  }
}
