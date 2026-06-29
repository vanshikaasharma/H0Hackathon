# FlipHQ

A web dashboard for clothing resellers (Depop, Poshmark, Vinted, eBay). Add each
item once, track which platforms it's listed on, log sales, and see profit +
analytics. When an item sells on one platform, FlipHQ flags the other platforms
it's still listed on so you can delist and avoid double-selling.

**H0 Hackathon** · Track 2 (Monetizable B2B) · AWS **Aurora PostgreSQL** · Front-end on **Vercel**.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Data model: `items` → `listings` → `sales` (relational, maps 1:1 to Aurora PostgreSQL)
- Currently uses a seeded in-memory store (`lib/store.tsx`) — the single swap
  point for wiring up the Aurora PostgreSQL backend via `/api` routes.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

- `app/` — pages (dashboard, analytics) and layout
- `components/` — UI (sidebar, item cards, modals, stat cards)
- `lib/types.ts` — data model
- `lib/seed.ts` — demo data
- `lib/store.tsx` — client store (**backend swap point**)
- `lib/compute.ts` — stats, profit, analytics helpers
