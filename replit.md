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
- Required env: `SESSION_SECRET` — secret for express-session (HTTP-only admin cookie auth)

Admin login: `/admin` · Default password: `zafora2024` (server-side sessions via express-session; password stored in DB under `admin_password` key)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, Tailwind CSS, shadcn/ui, Framer Motion
- API: Express 5 (at `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec, single-mode for Zod)
- Build: esbuild (CJS bundle)
- Object storage: GCS via Replit App Storage (presigned URLs, env: `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PUBLIC_OBJECT_SEARCH_PATHS`, `PRIVATE_OBJECT_DIR`)

## Where things live

- `artifacts/zafora/` — React + Vite frontend
- `artifacts/api-server/` — Express API server
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — Generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — Generated Zod schemas for server
- `lib/db/src/schema/` — Drizzle ORM table definitions (leads, projects, project_interests, documents, services, content_stats, methodology_steps, site_settings, testimonials, audit_logs)
- `artifacts/zafora/src/components/admin/` — All admin panel components
- `artifacts/zafora/src/hooks/use-seo-meta.ts` — SEO meta tag hook (title + description + og tags per page)
- `artifacts/zafora/src/hooks/use-page-title.ts` — Re-exports `useSeoMeta` with backward-compatible signature
- `artifacts/zafora/src/hooks/use-image-upload.ts` — Image upload hook (GCS presigned URL flow)
- `artifacts/api-server/src/lib/objectStorage.ts` — GCS object storage client
- `artifacts/api-server/src/lib/objectAcl.ts` — ACL policy framework
- `artifacts/api-server/src/routes/adminAuth.ts` — Admin session auth (login/logout/check/change-password)
- `artifacts/api-server/src/routes/storage.ts` — Image upload + serve endpoints
- `artifacts/zafora/public/` — favicon.svg, opengraph.jpg, hero assets

## Architecture decisions

- Orval codegen runs in "single" mode for Zod to avoid duplicate export conflicts; the codegen script patches index.ts after orval runs
- Wouter v3 routing: outer Switch uses catch-all `<Route>` (no path) to wrap Layout; nested Switch handles page routes
- Admin auth: server-side sessions via `express-session` (SESSION_SECRET env). Password stored in `site_settings` table under key `admin_password` (default: `zafora2024`). Changed via Settings tab → API call to `POST /api/admin/auth/change-password`. Session cookie is HTTP-only, SameSite=lax, 7-day expiry.
- SEO: each page calls `useGetSiteSettings("seo_<page>")` and passes parsed data to `usePageTitle(title, seoData)`. The hook injects title, description, og:title, og:description, og:image, og:site_name, twitter:* tags via direct DOM manipulation. Settings edited in Admin → Site Settings → SEO tab (6 pages: home, about, services, projects, government, submit).
- Image uploads: two-step GCS presigned URL flow. Admin image fields have an "Upload" button → POST metadata to `/api/storage/uploads/request-url` → PUT file to GCS presigned URL → path stored in DB. Served via `/api/storage/objects/<path>`.
- Project interest count is incremented atomically via SQL `+1` in the express interest handler
- All API data served under `/api` prefix via shared proxy routing

## Product

- **Home** — Hero (API-driven), scrolling ticker, image band, stats (API-driven), services preview, delivery model (API-driven), testimonial, pipeline preview, sectors, CTA
- **About Us** — Company story, mission/vision/values, 6 core values, leadership team, timeline, sectors, CTA
- **Services** — Hero mosaic, stats strip, 6 service cards with images, CTA
- **Project Pipeline** — Filterable grid (sector + funding status + search), "Express Interest" modal; multi-sector handled client-side
- **Government Review Center** — Full-width hero image, stats, capability cards, evaluation framework, sidebar
- **Submit Request** — Trust sidebar + 3-step numbered form
- **Admin Dashboard** — Grouped sidebar (Overview, Content, Pipeline, CRM, Admin):
  - **Dashboard** — Stats & recent activity
  - **Site Settings** — Hero text/CTAs, About Us (story/mission/vision/contact), Footer, SEO per-page (6 pages), Images (with upload button)
  - **Site Stats** — Edit homepage numbers (value, suffix, label, icon, visibility)
  - **Services** — Full CRUD: name, icon, description, bullets, category, image, order
  - **Methodology** — Edit/add/delete/reorder delivery model steps
  - **Testimonials** — Add/edit/delete/toggle client quotes with photo URL support
  - **Navigation Menu** — Reorder, rename, show/hide, new-tab toggle for header nav links
  - **Branding** — Site name, logo URL, favicon, brand colors (primary/accent/bg/footer), typography font picker
  - **Projects** — Multi-sector CRUD with tag picker
  - **Documents** — Preview modal + edit + description
  - **Inquiries** — Full CRM with lead statuses and notes
  - **Activity Log** — Full audit trail of all admin actions (create/update/delete), filterable by category, clearable
  - **Settings** — Email notifications (Resend), password change (server-side), CSV export
- **404 Page** — Branded with logo, navigation back to home/pipeline

## User preferences

- Mobile-first, responsive design
- Light cream (#f7f4ef) background + deep forest green (#173f35) primary + gold (#c59b4a) accent palette
- Dark footer (#10231f) — 4-column: brand, navigation, services, engage CTA
- No emojis anywhere in the UI
- Bigger logo (h-16 in navbar, h-24 navbar height)

## Gotchas

- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` — it patches index.ts automatically
- `pnpm run dev` at workspace root is NOT supported — run workflows individually
- Wouter v3 nested Switch: use `<Route>` (no path) as catch-all in outer Switch, not `<Route path="/">`
- CSS ticker animation lives in `index.css` as `@keyframes ticker` / `.ticker-track`
- Project `sector` field stores comma-separated multi-sector values (e.g. "Energy,Transport"); Projects.tsx filters client-side
- Admin password: stored in DB (`site_settings` key `admin_password`, fallback `zafora2024`). `POST /api/admin/auth/change-password` requires `currentPassword` + `newPassword` body.
- Document preview works for Google Drive, Dropbox, OneDrive, and direct PDF URLs — transforms to embeddable URL in DocumentsTable
- ImagesEditor.tsx does NOT export `IMAGE_DEFAULTS` (removed export to fix Vite Fast Refresh); it's only used internally. SiteSettingsManager imports `ImagesEditor` directly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for all API contracts
