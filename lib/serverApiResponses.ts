import { NextResponse } from "next/server";
import {
  EVENT_STORE_PERSISTENCE_ERROR_MESSAGE,
  isEventStorePersistenceError
} from "@/lib/serverEventStore";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

export function eventStoreErrorResponse(error: unknown) {
  if (!isEventStorePersistenceError(error)) {
    return undefined;
  }

  console.error("[supper-club:event-store]", error);
  return json({ error: EVENT_STORE_PERSISTENCE_ERROR_MESSAGE }, 500);
}
