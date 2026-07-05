import { kvGet, kvSet, kvIncr, kvExpire } from "@/lib/kv";
import { EXECUTIVE_READOUT_PROMPT_V1 } from "@/lib/prompts/executive-readout-v1";
import crypto from "crypto";
import OpenAI from "openai";

const RATE_LIMIT_PER_HOUR = 5;
const DAILY_CAP = 120;

// Parses rows like "| D1 | Market Discovery | C | Defined |" out of the
// assessment .md's scores table and returns the 13 level letters in D1..D13
// order, or null if any dimension is missing/ungraded.
function extractScoreVector(md) {
  const re = /^\|\s*D(\d{1,2})\s*\|[^|]*\|\s*([A-E])\s*\|/gm;
  const found = new Map();
  let m;
  while ((m = re.exec(md)) !== null) {
    found.set(Number(m[1]), m[2]);
  }
  const vector = [];
  for (let i = 1; i <= 13; i++) {
    if (!found.has(i)) return null;
    vector.push(found.get(i));
  }
  return vector;
}

function hashVector(vector) {
  return crypto.createHash("sha256").update(vector.join("")).digest("hex");
}

function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function checkRateLimit(ip) {
  const now = new Date();
  const hourKey = `diag_rl:${ip}:${now.toISOString().slice(0, 13)}`;
  const dayKey = `diag_rl_day:${now.toISOString().slice(0, 10)}`;

  const hourCount = await kvIncr(hourKey);
  if (hourCount === 1) await kvExpire(hourKey, 3600);

  const dayCount = await kvIncr(dayKey);
  if (dayCount === 1) await kvExpire(dayKey, 86400);

  if (hourCount > RATE_LIMIT_PER_HOUR) {
    return { ok: false, message: "You've hit the hourly limit for diagnostic requests. Please try again in a bit." };
  }
  if (dayCount > DAILY_CAP) {
    return { ok: false, message: "The daily limit for diagnostic requests has been reached. Please try again tomorrow." };
  }
  return { ok: true };
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.md !== "string" || !body.md.trim()) {
    return Response.json({ error: "Missing assessment content." }, { status: 400 });
  }

  // Rate limit applies even on cache hits — prevents cache-scraping abuse (RC-001).
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.ok) {
    return Response.json({ error: rateLimit.message }, { status: 429 });
  }

  const scoreVector = extractScoreVector(body.md);
  if (!scoreVector) {
    return Response.json(
      { error: "Assessment content is incomplete — all 13 dimensions must be scored." },
      { status: 400 }
    );
  }
  const hash = hashVector(scoreVector);
  const cacheKey = `diag_cache:${hash}`;

  const cached = await kvGet(cacheKey);
  if (cached) {
    return Response.json({ readout: cached, hash });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Diagnostic service is not configured." }, { status: 500 });
  }

  let readout;
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        { role: "system", content: EXECUTIVE_READOUT_PROMPT_V1 },
        { role: "user", content: body.md },
      ],
    });
    readout = completion.choices[0]?.message?.content?.trim();
  } catch (err) {
    console.error("[diagnostic] OpenAI call failed:", err.message);
    return Response.json({ error: "Failed to generate the Executive Readout. Please try again." }, { status: 502 });
  }

  if (!readout) {
    return Response.json({ error: "Failed to generate the Executive Readout. Please try again." }, { status: 502 });
  }

  await kvSet(cacheKey, readout, 86400);

  return Response.json({ readout, hash });
}
