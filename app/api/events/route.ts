import { createStoredEvent, getEventStoreLogContext } from "@/lib/serverEventStore";
import { eventStoreErrorResponse, json } from "@/lib/serverApiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { data, starterItems } = await request.json();
    const bundle = await createStoredEvent(data, starterItems ?? []);

    console.info("[supper-club:event-store] create success", {
      eventId: bundle.event.id,
      ...getEventStoreLogContext()
    });

    return json({ event: bundle.event, bundle }, 201);
  } catch (error) {
    console.error("[supper-club:event-store] create failure", {
      ...getEventStoreLogContext(),
      error
    });

    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to create event." }, 400);
  }
}
