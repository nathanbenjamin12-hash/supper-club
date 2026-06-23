import { createStoredEvent } from "@/lib/serverEventStore";
import { eventStoreErrorResponse, json } from "@/lib/serverApiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { data, starterItems } = await request.json();
    const bundle = await createStoredEvent(data, starterItems ?? []);

    return json({ event: bundle.event, bundle }, 201);
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to create event." }, 400);
  }
}
