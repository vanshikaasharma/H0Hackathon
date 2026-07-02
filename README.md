# Rackd

Inventory dashboard for clothing resellers. I built this as a solo project after a hackathon — the idea is to track what you have listed across Depop, Poshmark, Vinted, eBay, and any other platform, log sales, and get reminded to delist on the other sites when something sells.

**Live demo:** [https://rackd-seven.vercel.app](https://rackd-seven.vercel.app)

Right now the frontend is done. Data lives in memory (refresh resets to demo items). Next step is wiring **Amazon Aurora PostgreSQL** through API routes.

## What it does

- Dashboard with stats, search, and filters
- Item cards with platform tags and sold/delist warnings
- Item detail page (edit, mark sold, profit breakdown)
- Add/edit items with multiple listings per item, including custom platforms (e.g. Grailed)
- Analytics: profit over time, best brands, stale inventory, recent sales

## Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **State (current):** React Context + in-memory store (`lib/store.tsx`)
- **Database (planned):** Amazon Aurora PostgreSQL
- **Hosting:** [Vercel](https://rackd-seven.vercel.app)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

If the dev server acts up (blank page, missing chunks), stop it, delete `.next`, and restart:

```bash
Remove-Item -Recurse -Force .next   # PowerShell
npm run dev
```

Production build:

```bash
npm run build
```

## Project layout

```
app/              pages (dashboard, item detail, error boundaries)
components/       UI (TopNav, ItemCard, modals, analytics)
lib/store.tsx     client store — will call /api when backend is added
lib/types.ts      Item, Listing, Sale types (matches planned DB schema)
lib/compute.ts    stats and analytics helpers
lib/seed.ts       demo inventory
public/logo.png   app logo
```

## Design

- Charcoal `#36454F` and mint `#B2E0D6`
- Top nav layout, compact inventory cards, photo overlays for delist alerts

## Roadmap

1. Aurora PostgreSQL — `items`, `listings`, `sales` tables
2. API routes + refactor `lib/store.tsx` to fetch from the DB

## Demo data

Seed items include sold listings with pending delists (Levi's 501, Zara coat) and a custom Grailed listing on the Lululemon Define Jacket — useful for testing the delist flow.
