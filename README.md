# AI-architecture-taxonomy

Three application components hosted at [aisdlc.davidfacer.com](https://aisdlc.davidfacer.com) (Application Component Catalog, Sheet 20): AI Architecture Taxonomy, SDLC Maturity Assessment, and Executive Readout. Despite the repo name (kept for continuity from before WP2b), this project is no longer just the taxonomy tool.

No authentication, no admin UI. Data persistence is limited to a single Redis store (community entries + Executive Readout rate-limiting/cache).

## Components

- **`/aiarchitecturetaxonomy/`** (AC-001) — the original tool. Scores a product across nine AI system archetypes and plots it in a 3D classification space (Stack Depth × Surface Coverage × Autonomy) alongside seeded reference products and community submissions. Next.js App Router page + `@/components`, `@/lib/archetypes.js`, `@/lib/seeds.js`.
- **`/maturitymodelassessment/`** (AC-002) — the AI-Native SDLC Maturity Assessment. Static HTML + Chart.js (CDN), fully client-side, no build step, no external dependency. Lives at `public/maturitymodelassessment/index.html` — this is **not** a Next.js page, it's a static file served via a rewrite in `next.config.mjs` (Next's `/public` doesn't do directory-index resolution, so `/maturitymodelassessment/` needs an explicit rewrite to its `index.html`, same as `/`).
- **`/executivereadout/`** (AC-003, WP3) — takes a completed assessment `.md` (from AC-002, either passed through in the same session or pasted/uploaded standalone) and generates an AI-assisted "Executive Readout" interpretation via OpenAI. See below.

## Stack

- Next.js (App Router)
- Plotly.js (`plotly.js-dist-min`) for the taxonomy's 3D scatter chart, dynamically imported client-side only
- `react-markdown` for rendering the Executive Readout
- OpenAI (`openai` npm package) — Executive Readout generation only. Anthropic/Claude is deliberately not used here (ADR-003 — an empirical fidelity check found OpenAI produces better diagnostic/interpretive output for this specific task, while Claude remains the better choice for model generation and architectural synthesis elsewhere in this project's own development)
- Redis (`redis` / node-redis) via a Vercel Marketplace Redis store — community entries, Executive Readout rate-limiting, and response caching
- Tailwind CSS

> **Note:** the original taxonomy spec called for Vercel KV (`@vercel/kv`), but that product is deprecated and Vercel's current Marketplace Redis integration only exposes a standard `REDIS_URL` connection string, not the REST API (`KV_REST_API_URL`/`TOKEN`) that `@vercel/kv` requires. This project uses plain `redis` (node-redis) against `REDIS_URL` instead — see [lib/redis.js](lib/redis.js) (taxonomy community entries) and [lib/kv.js](lib/kv.js) (Executive Readout rate-limit/cache — separate module, see below).

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in a real REDIS_URL, see below; add OPENAI_API_KEY only if testing Executive Readout generation itself
npm run dev
```

Without a real `REDIS_URL` in `.env.local`, the taxonomy app still runs — scoring, the chart, and the markdown download all work using only client-side state and the seeded examples. Only `/api/entries` (community submissions) requires Redis, and that route (`lib/redis.js`) always talks to the **real production store** — see the caution below.

Executive Readout's rate-limiting and cache (`lib/kv.js`) work differently: they use an **in-memory mock** whenever `VERCEL_ENV` is unset (i.e. real local dev), and only touch real Redis on an actual Vercel deployment (Preview or Production) — see ABB-001 (Environment Isolation) in the migration workbook. This means you can develop and test the Executive Readout flow locally without any Redis setup at all, but you will need a real `OPENAI_API_KEY` in `.env.local` to test an actual generation rather than hit "Diagnostic service is not configured."

**Caution:** `lib/redis.js` (taxonomy community entries, `/api/entries`) has no dev/prod split — any local GET/POST against it touches the live production store. This was the WP2b incident (a test entry was briefly written and then removed) that led to ABB-001 and `lib/kv.js` doing it differently for Executive Readout.

## Redis setup

1. In the Vercel dashboard, open this project → **Storage** → **Create Database** → choose **Redis** from the Marketplace.
2. Connect the store to this project. Vercel automatically injects `REDIS_URL` into the project's environment variables for Preview and Production — no manual copying needed for deployed environments.
3. For local development against the same store, run `vercel env pull .env.local` (requires `vercel link` first) to pull the real value down. Note Vercel only populates Preview/Production by default for Marketplace stores — if `.env.local` comes back without `REDIS_URL`, copy the value shown in the Storage tab's "Quickstart" panel manually.

## OpenAI setup (Executive Readout)

Add `OPENAI_API_KEY` in the Vercel dashboard (Settings → Environment Variables), scoped to whichever environments you want it available in (Production, and Preview if testing before promotion). **Vercel does not retroactively inject env vars into already-built deployments** — trigger a fresh deployment after adding/changing it.

The system prompt is stored as a versioned constant, `EXECUTIVE_READOUT_PROMPT_V1` in [`lib/prompts/executive-readout-v1.js`](lib/prompts/executive-readout-v1.js) — copied verbatim from the approved prompt document (C-006/P-07). Any future prompt change gets a new constant (`V2`, etc.) and a new row in the Prompt Version Register (Sheet 21 of the migration workbook), never an overwrite of `V1`.

## Deploying

```bash
npx vercel link     # one-time
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard for auto-deploy on push. Current work happens on feature branches (`wp2b-aisdlc-migration`, `wp3-diagnostic`, etc.) rather than `main` — Vercel does not auto-promote new deployments to Production on this project; promote manually after checking the preview, and note existing deployments don't retroactively pick up new env vars (see above).

## Architecture rules

- **P-01:** The Dev layer is always `1` and cannot be deactivated (locked toggle).
- **P-02:** If Arch is activated, Engine is auto-activated with it (Arch implies Engine). An inline warning is shown for 3 seconds when this auto-activation happens.
- **C-003:** Autonomy scale is Commander / Navigator / Autopilot — "Copilot" is deliberately rejected (Microsoft brand contamination). Applies to all UI, `.md` output, and API responses.

## Scoring (taxonomy)

- `stackDepth = dev + arch + engine` (1–3)
- `surfaceCoverage = feature + ui` (0–2)
- `binaryKey = "${dev}${arch}${engine}${feature}${ui}"` → looked up in `lib/archetypes.js`'s `ARCHETYPES` map

Not every binary combination has a defined archetype (e.g. `dev` alone, with nothing else active) — in that case the UI shows "— configuration invalid —" rather than guessing.

## Data files

- `lib/archetypes.js` — the nine archetype definitions, the five layers, and the three autonomy levels (taxonomy)
- `lib/seeds.js` — seeded reference products shown on the taxonomy chart for context
- `lib/prompts/executive-readout-v1.js` — the Executive Readout system prompt (Executive Readout)
