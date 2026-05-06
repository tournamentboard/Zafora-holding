# Zafora Holding

A full-stack, mobile-friendly website for Zafora Holding — an African infrastructure advisory and development firm connecting governments, investors, and contractors with large-scale infrastructure projects.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at /api)
- `pnpm --filter @workspace/zafora run dev` — run the frontend (port 21324, served at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

Admin login password: `zafora2024` (stored in localStorage, MVP only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, Tailwind CSS, shadcn/ui, Framer Motion
- API: Express 5 (at `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec, single-mode for Zod)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/zafora/` — React + Vite frontend
- `artifacts/api-server/` — Express API server
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — Generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — Generated Zod schemas for server
- `lib/db/src/schema/` — Drizzle ORM table definitions (leads, projects, project_interests, documents, services)

## Architecture decisions

- Orval codegen runs in "single" mode for Zod to avoid duplicate export conflicts; the codegen script patches index.ts after orval runs
- Wouter v3 routing: outer Switch uses catch-all `<Route>` (no path) to wrap Layout; nested Switch handles page routes
- Admin auth is MVP localStorage-only (password: zafora2024) — no real auth implemented yet
- Project interest count is incremented atomically via SQL `+1` in the express interest handler
- All API data served under `/api` prefix via shared proxy routing

## Product

- **Home** — Hero with stats, services overview, featured project preview, CTA
- **Services** — 6 consulting service cards with AI-generated images
- **Project Pipeline** — Filterable grid of infrastructure projects (by sector + funding status), "Express Interest" modal
- **Government Review Center** — Capability statement, compliance/governance, evaluation signals
- **Submit Request** — Full consultation/project submission form
- **Admin Dashboard** — Lead inbox with status management, project CRUD, document center, analytics charts (password-protected)

## User preferences

- Mobile-first, responsive design
- Dark navy + gold color palette
- No emojis anywhere in the UI

## Gotchas

- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` — it patches index.ts automatically
- `pnpm run dev` at workspace root is NOT supported — run workflows individually
- Wouter v3 nested Switch: use `<Route>` (no path) as catch-all in outer Switch, not `<Route path="/">`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for all API contracts
