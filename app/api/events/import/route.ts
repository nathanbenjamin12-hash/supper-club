import { importStoredEventBundle } from "@/lib/serverEventStore";
import { eventStoreErrorResponse, json } from "@/lib/serverApiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { bundle } = await request.json();
    const importedBundle = await importStoredEventBundle(bundle);

    return json({ bundle: importedBundle }, 201);
  } catch (error) {
    const persistenceError = eventStoreErrorResponse(error);

    if (persistenceError) {
      return persistenceError;
    }

    return json({ error: "Unable to import event." }, 400);
  }
}
