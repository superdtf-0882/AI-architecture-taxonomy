# AI Architecture Taxonomy

A scoring and classification tool that identifies which of nine AI system archetypes describes a product, and plots it in a 3D classification space (Stack Depth × Surface Coverage × Autonomy) alongside seeded reference products and anonymous community submissions.

No authentication, no database beyond a single Redis store, no admin UI.

## Stack

- Next.js (App Router)
- Plotly.js (`plotly.js-dist-min`) for the 3D scatter chart, dynamically imported client-side only
- Redis (`redis` / node-redis) via a Vercel Marketplace Redis store, for community entry persistence
- Tailwind CSS

> **Note:** the original spec called for Vercel KV (`@vercel/kv`), but that product is deprecated and Vercel's current Marketplace Redis integration only exposes a standard `REDIS_URL` connection string, not the REST API (`KV_REST_API_URL`/`TOKEN`) that `@vercel/kv` requires. This project uses plain `redis` (node-redis) against `REDIS_URL` instead — see [lib/redis.js](lib/redis.js).

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in a real REDIS_URL, see below
npm run dev
```

Without a real `REDIS_URL` in `.env.local`, the app still runs — scoring, the chart, and the markdown download all work using only client-side state and the seeded examples. Only `/api/entries` (community submissions) requires Redis.

## Redis setup

1. In the Vercel dashboard, open this project → **Storage** → **Create Database** → choose **Redis** from the Marketplace.
2. Connect the store to this project. Vercel automatically injects `REDIS_URL` into the project's environment variables for Preview and Production — no manual copying needed for deployed environments.
3. For local development against the same store, run `vercel env pull .env.local` (requires `vercel link` first) to pull the real value down. Note Vercel only populates Preview/Production by default for Marketplace stores — if `.env.local` comes back without `REDIS_URL`, copy the value shown in the Storage tab's "Quickstart" panel manually.

## Deploying

```bash
npx vercel link     # one-time
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard for auto-deploy on push to `main`. Either way, the Redis store must be connected (see above) before community submissions will work in that environment.

## Architecture rules

- **P-01:** The Dev layer is always `1` and cannot be deactivated (locked toggle).
- **P-02:** If Arch is activated, Engine is auto-activated with it (Arch implies Engine). An inline warning is shown for 3 seconds when this auto-activation happens.

## Scoring

- `stackDepth = dev + arch + engine` (1–3)
- `surfaceCoverage = feature + ui` (0–2)
- `binaryKey = "${dev}${arch}${engine}${feature}${ui}"` → looked up in `lib/archetypes.js`'s `ARCHETYPES` map

Not every binary combination has a defined archetype (e.g. `dev` alone, with nothing else active) — in that case the UI shows "— configuration invalid —" rather than guessing.

## Data files

- `lib/archetypes.js` — the nine archetype definitions, the five layers, and the three autonomy levels
- `lib/seeds.js` — seeded reference products shown on the chart for context
