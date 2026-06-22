import { NextResponse } from "next/server";
import { createStoredEvent } from "@/lib/serverEventStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

export async function POST(request: Request) {
  try {
    const { data, starterItems } = await request.json();
    const bundle = await createStoredEvent(data, starterItems ?? []);

    return json({ event: bundle.event, bundle }, 201);
  } catch {
    return json({ error: "Unable to create event." }, 400);
  }
}
