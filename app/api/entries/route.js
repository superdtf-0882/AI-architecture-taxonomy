import { kv } from "@vercel/kv";

const KEY = "community_entries";

export async function GET() {
  const entries = (await kv.get(KEY)) || [];
  return Response.json({ entries });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, stackDepth, surfaceCoverage, autonomy, archetype } = body;

  if (
    !name ||
    typeof stackDepth !== "number" ||
    typeof surfaceCoverage !== "number" ||
    typeof autonomy !== "number" ||
    !archetype
  ) {
    return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  if (stackDepth < 1 || stackDepth > 3) {
    return Response.json({ ok: false, error: "stackDepth must be between 1 and 3" }, { status: 400 });
  }

  if (surfaceCoverage < 0 || surfaceCoverage > 2) {
    return Response.json({ ok: false, error: "surfaceCoverage must be between 0 and 2" }, { status: 400 });
  }

  if (autonomy < 1 || autonomy > 3) {
    return Response.json({ ok: false, error: "autonomy must be between 1 and 3" }, { status: 400 });
  }

  const existing = (await kv.get(KEY)) || [];
  const entry = { name, stackDepth, surfaceCoverage, autonomy, archetype };
  const next = [entry, ...existing].slice(0, 5);

  await kv.set(KEY, next);

  return Response.json({ ok: true });
}
