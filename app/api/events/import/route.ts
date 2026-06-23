import { NextResponse } from "next/server";
import { importStoredEventBundle } from "@/lib/serverEventStore";

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
    const { bundle } = await request.json();
    const importedBundle = await importStoredEventBundle(bundle);

    return json({ bundle: importedBundle }, 201);
  } catch {
    return json({ error: "Unable to import event." }, 400);
  }
}
