# Zafora Holdings — Enterprise Implementation Roadmap

This plan strictly follows the project Cursor Rules:

- [`.cursor/rules/zafora-frontend.mdc`](.cursor/rules/zafora-frontend.mdc)
- [`.cursor/rules/zafora-backend.mdc`](.cursor/rules/zafora-backend.mdc)

**Target stack:** Next.js 16 App Router (Vercel) + Express 5 (Railway) + Neon PostgreSQL + AWS S3 + Resend

**Current baseline:** UI largely ported from Replit; structure is flat, legacy Orval/React Query still active, admin is a monolith, backend routes are flat with Replit storage and no `requireAuth`.

---

## Table of Contents

1. [Frontend Development Phases](#1-frontend-development-phases)
2. [Frontend Recommended Build Order](#2-frontend-recommended-build-order)
3. [Backend Development Phases](#3-backend-development-phases)
4. [Backend Recommended Build Order](#4-backend-recommended-build-order)
5. [Scalability Recommendations](#5-scalability-recommendations)
6. [Architecture Milestones](#6-architecture-milestones)
7. [Suggested Team Workflow](#7-suggested-team-workflow)
8. [Common Anti-Patterns To Avoid](#8-common-anti-patterns-to-avoid)

---

## 1. Frontend Development Phases

### Phase F1 — Foundation & Platform Setup

| Field | Detail |
|-------|--------|
| **Objective** | Establish canonical folder tree, env contract, and cross-cutting `lib/` layer |
| **Implement** | Restructure toward `src/app/(public)/`, `src/app/(admin)/`, `src/modules/`, `src/lib/*`; `.env.example`; `lib/url-helpers/`; `lib/api-helpers/`; `lib/constants/`, `enums/`, `types/`; API rewrites in `next.config.ts` |
| **Folder responsibilities** | `lib/url-helpers/` — paths; `lib/api-helpers/` — HTTP client; `lib/constants/`, `enums/`, `types/` — shared domain |
| **Dependencies** | None |
| **Best practices** | No hardcoded URLs; promote types only when 2+ modules need them |
| **Avoid** | Feature folders before url-helpers; new Orval imports |
| **Scalability** | Central API layer enables versioning and mock swaps |
| **Build order** | env → url-helpers → api-helpers → types/enums/constants |
| **Outcome** | Module shells + server-side fetch to Express health endpoint |

---

### Phase F2 — App Architecture & Routing Shell

| Field | Detail |
|-------|--------|
| **Objective** | App Router route groups, thin pages, layout hierarchy |
| **Implement** | Root layout; `(public)/layout.tsx`; `(admin)/layout.tsx`; move pages into route groups; `loading.tsx` / `error.tsx`; `middleware.ts` skeleton |
| **Folder responsibilities** | `src/app/` — routes only; `src/providers/` — client providers; `components/layout/` — layout primitives |
| **Dependencies** | F1 |
| **Best practices** | Pages 10–30 lines; zero business logic in `page.tsx` |
| **Avoid** | Whole-page `"use client"`; mixing admin/public in one layout |
| **Scalability** | Independent layouts, metadata, loading boundaries per group |
| **Build order** | root layout → public group → admin group → loading/error |
| **Outcome** | Correct URL map with `(public)` / `(admin)` separation |

---

### Phase F3 — Shared UI System & Design Foundation

| Field | Detail |
|-------|--------|
| **Objective** | Reusable presentation layer (shadcn/Radix) with zero domain logic |
| **Implement** | Audit `components/ui/`; Navbar/Footer; shared `PageHeader`, `EmptyState`, `ConfirmDialog`; branding constants; sonner provider |
| **Folder responsibilities** | `components/ui/` — primitives; `components/common/` — chrome; `modules/shared/components/` — cross-audience UI |
| **Dependencies** | F2 |
| **Best practices** | UI accepts props only; never fetch |
| **Avoid** | API calls in `components/ui/` |
| **Scalability** | New features compose existing UI |
| **Build order** | ui audit → common chrome → shared module components |
| **Outcome** | Design system ready for feature modules |

---

### Phase F4 — API Integration Layer & Validators

| Field | Detail |
|-------|--------|
| **Objective** | Replace Orval/React Query with rules-compliant data access |
| **Implement** | `lib/validators/` (hand-written Zod); module `services/` pattern; server fetch fns; deprecate `api-client-react`; optional `app/api/health/route.ts` |
| **Folder responsibilities** | `lib/validators/` — schemas; `modules/*/services/` — feature API; `lib/api-helpers/` — transport |
| **Dependencies** | F1 |
| **Best practices** | Validators shared between Server Actions and forms |
| **Avoid** | Duplicated Zod per form; TanStack Query on new public pages |
| **Scalability** | Validators = contract with Express modules |
| **Build order** | validators → public read services → admin read services |
| **Outcome** | Data access pattern established; one reference module off Orval |

---


### Phase F6 — Public Forms & Server Actions

| Field | Detail |
|-------|--------|
| **Objective** | Mutations via Server Actions + Zod |
| **Implement** | `lib/actions/public.ts`; `lib/validators/lead.ts`, `project.ts`; SubmitLeadForm; ExpressInterestModal; `revalidatePath()`; `useFormStatus` + sonner |
| **Folder responsibilities** | `lib/actions/public.ts`; `modules/public/submit/`; `lib/validators/` |
| **Dependencies** | F4, F5 |
| **Best practices** | Always validate on server |
| **Avoid** | Express calls from client components |
| **Scalability** | New forms follow action + validator pattern |
| **Build order** | validators → actions → submit form → express interest |
| **Outcome** | Public conversion flows production-ready |

---

### Phase F7 — Authentication Flow (Frontend)

| Field | Detail |
|-------|--------|
| **Objective** | Secure admin access via Express session cookies |
| **Implement** | `lib/auth.ts`; login page; `middleware.ts`; `(admin)/layout.tsx` with `requireAdmin()`; cookie forwarding in api-helpers |
| **Folder responsibilities** | `lib/auth.ts`; `modules/admin/shared/`; `middleware.ts` |
| **Dependencies** | F2, F4; Backend B3 |
| **Best practices** | Middleware + layout + Server Actions all check auth |
| **Avoid** | Client-only `useState` auth; password-only login if backend expects email |
| **Scalability** | Supports future multi-role checks |
| **Build order** | auth lib → login page → middleware → admin layout guard |
| **Outcome** | Admin routes inaccessible without valid session |

---

### Phase F8 — Admin Shell & Dashboard Architecture

| Field | Detail |
|-------|--------|
| **Objective** | Replace monolithic admin tab router with App Router IA |
| **Implement** | Routes: `/admin`, `/admin/leads`, `/admin/projects`, etc.; AdminSidebar/Header; dashboard module; remove tab-state navigation |
| **Folder responsibilities** | `app/(admin)/admin/**/page.tsx`; `modules/admin/shared/`; `modules/admin/dashboard/` |
| **Dependencies** | F7 |
| **Best practices** | Sidebar uses `lib/url-helpers/routes.ts` |
| **Avoid** | SPA-style tabs in one page |
| **Scalability** | New section = new route + module |
| **Build order** | shared shell → dashboard → stub pages |
| **Outcome** | Enterprise CMS information architecture |

---

### Phase F9 — Admin Feature Modules & Server Actions (CRUD)

| Field | Detail |
|-------|--------|
| **Objective** | Full CMS/CRM on Server Actions + modules |
| **Implement** | `lib/actions/admin.ts`; modules: leads, projects, documents, content, audit, settings; migrate `components/admin/` → `modules/admin/`; deprecate Orval |
| **Folder responsibilities** | `lib/actions/admin.ts`; `modules/admin/*/`; `modules/admin/*/hooks/` (UI state only) |
| **Dependencies** | F7, F8, F4; Backend B4–B5 |
| **Best practices** | One module per domain; `requireAdmin()` on every action |
| **Avoid** | Giant ungrouped `admin.ts`; fetch in table components |
| **Scalability** | Parallel team ownership per module |
| **Build order** | leads → projects → documents → content → audit → settings |
| **Outcome** | Admin route-based, Server Action driven |

---

### Phase F10 — Tables, Search & Filter System

| Field | Detail |
|-------|--------|
| **Objective** | Reusable admin data-table patterns |
| **Implement** | Shared DataTable, TableToolbar, StatusBadge; URL-driven filters; server pagination; `useTableFilters`, `useDebouncedSearch` |
| **Folder responsibilities** | `modules/admin/shared/components/`; `modules/admin/*/hooks/` |
| **Dependencies** | F9 |
| **Best practices** | Fetch in RSC/actions; hooks for UI state only |
| **Avoid** | Full dataset client-side fetch |
| **Scalability** | New tables plug into shared DataTable |
| **Build order** | DataTable → leads → projects/documents/audit |
| **Outcome** | Consistent, performant admin tables |

---

### Phase F11 — File Uploads (Frontend)

| Field | Detail |
|-------|--------|
| **Objective** | S3 presigned upload flow (no Replit storage) |
| **Implement** | `app/api/storage/presign/route.ts`; `hooks/use-s3-upload.ts`; ImageUploader; wire into content forms; `next/image` previews |
| **Folder responsibilities** | `app/api/storage/presign/`; `hooks/`; `modules/admin/content/` |
| **Dependencies** | F9; Backend B6 |
| **Best practices** | Direct S3 upload; store URL in payload only |
| **Avoid** | File bytes through Next.js body; Replit paths |
| **Scalability** | Reused across all admin media fields |
| **Build order** | presign → hook → ImageUploader → content integration |
| **Outcome** | Production upload pipeline |

---

### Phase F12 — Error, Loading & Performance

| Field | Detail |
|-------|--------|
| **Objective** | Production UX and Core Web Vitals |
| **Implement** | Segment loading/error; Suspense boundaries; `next/image` audit; dynamic import for charts; remove unused TanStack Query |
| **Folder responsibilities** | `app/**/loading.tsx`, `error.tsx`; module-level Suspense |
| **Dependencies** | F5, F8, F9 |
| **Best practices** | Server fetching first; minimal client JS on public pages |
| **Avoid** | Global client layouts; spinners without Suspense |
| **Scalability** | Patterns in module template |
| **Build order** | loading/error → image audit → bundle analysis → remove dead providers |
| **Outcome** | Lighthouse-ready public site |

---

### Phase F13 — SEO & Production Readiness (Frontend)

| Field | Detail |
|-------|--------|
| **Objective** | Search, social, Vercel deploy readiness |
| **Implement** | Complete `generateMetadata()`; `sitemap.ts`, `robots.ts`; OG from CMS; CI (lint, typecheck, build); README |
| **Folder responsibilities** | `app/` metadata files; root CI config |
| **Dependencies** | F5, F12 |
| **Best practices** | Metadata from CMS with fallbacks |
| **Avoid** | Hardcoded OG; missing staging robots |
| **Scalability** | Marketing edits without deploys |
| **Build order** | metadata audit → sitemap/robots → CI → README |
| **Outcome** | Frontend deploy-ready on Vercel |

---

### Phase F14 — Role/Permission UI (Future-ready)

| Field | Detail |
|-------|--------|
| **Objective** | Frontend authorization when backend supports roles |
| **Implement** | `lib/enums/user-role.ts`; `has-permission.ts`; conditional AdminSidebar; guard Server Actions |
| **Dependencies** | F7, F9; Backend B3 (roles in session) |
| **Best practices** | UI hides actions; server always enforces |
| **Avoid** | Role checks only in UI |
| **Outcome** | Multi-admin RBAC-ready frontend |

---


## 2. Frontend Recommended Build Order

```
F1 → F2 → F3 → F4 ─────────────────────────────────────────┐
         │                                                 │
         └→ F5 → F6 → F12 → F13 (public site shippable)    │
              │                                            │
              └→ F7 → F8 → F9 → F10 → F11 → F12 → F13      │
                        (admin CMS)                         │
                                                            │
Parallel when backend ready: F14, F15, F16 ←──────────────┘
```

| Path | Phases |
|------|--------|
| **First public demo** | F1 → F2 → F4 → F5 → F6 |
| **Admin MVP** | F7 → F8 → F9 (requires Backend B3 + B5) |
| **Legacy cleanup** | After F9: delete `api-client-react`, `api-spec`, `api-zod`, `object-storage-web`, `lib/db` from frontend |

---

## 3. Backend Development Phases

### Phase B1 — Foundation & Database Consolidation

| Field | Detail |
|-------|--------|
| **Objective** | Single DB schema source of truth |
| **Implement** | Consolidate `workplace/db` → `src/db/`; add `users`, `sessions`; migrations; `.env.example`; remove new `workplace/` code |
| **Folder responsibilities** | `src/db/schema/`, `migrations/`; `src/app.ts` |
| **Dependencies** | None |
| **Best practices** | One schema file per table |
| **Avoid** | Dual db packages; wrong migration target |
| **Scalability** | Neon pooler for scale |
| **Outcome** | Clean DB layer for modules |

---

### Phase B2 — Shared Layer & Core Architecture

| Field | Detail |
|-------|--------|
| **Objective** | Cross-cutting infrastructure |
| **Implement** | error-handler; api-helpers; url-helpers/route-paths; constants/enums/types; logger in shared/lib; CORS with credentials; thin routes/index |
| **Folder responsibilities** | `shared/middleware/`, `shared/api-helpers/`, `shared/url-helpers/`, `shared/lib/` |
| **Dependencies** | B1 |
| **Best practices** | Promote to shared only when 2+ modules need it |
| **Avoid** | Open CORS; magic route strings |
| **Outcome** | Express skeleton per cursor rules |

---

### Phase B3 — Authentication & Authorization Module

| Field | Detail |
|-------|--------|
| **Objective** | Replace plaintext password + in-memory sessions |
| **Implement** | `modules/auth/`; bcrypt; users + sessions tables; login/verify/logout/change-password; `require-auth.ts`; migrate-passwords script |
| **Dependencies** | B1, B2 |
| **Best practices** | Service owns session lifecycle |
| **Avoid** | Plaintext compare; memory-only sessions |
| **Scalability** | Multiple admins and future roles |
| **Outcome** | Secure auth for all protected routes |

---

### Phase B4 — Public API Modules

| Field | Detail |
|-------|--------|
| **Objective** | Public read + POST endpoints as modules |
| **Implement** | Modules: content, projects, services, testimonials, stats; public POST leads + project interests; Zod validators; thin routes |
| **Dependencies** | B2 |
| **Best practices** | Public routes explicitly documented |
| **Avoid** | Admin GET left unprotected later |
| **Outcome** | Frontend F5/F6 can consume stable API |

---

### Phase B5 — Protected Admin API Modules

| Field | Detail |
|-------|--------|
| **Objective** | All admin CRUD behind `requireAuth` |
| **Implement** | Auth on leads, projects, documents, services, content admin, testimonials admin, audit; full module pattern; audit logging; pagination |
| **Dependencies** | B3, B4 |
| **Best practices** | Audit every mutation; consistent errors |
| **Avoid** | Unprotected GET list endpoints |
| **Outcome** | Frontend F9 Server Actions secured |

---

### Phase B6 — File Upload & Storage Module

| Field | Detail |
|-------|--------|
| **Objective** | AWS S3 replacing Replit GCS |
| **Implement** | `shared/lib/object-storage.ts`; `modules/storage/`; remove GCS/sidecar; S3 CORS |
| **Dependencies** | B2, B3 |
| **Best practices** | Presigned TTL 15–60 min; unique keys |
| **Avoid** | File bytes through Express |
| **Outcome** | Production uploads for Frontend F11 |

---

### Phase B7 — Notification & Email Module

| Field | Detail |
|-------|--------|
| **Objective** | Reliable transactional email |
| **Implement** | Resend in shared/lib or notifications module; inquiry/interest emails; admin test/status routes |
| **Dependencies** | B4, B5 |
| **Outcome** | Email for lead/project flows |

---

### Phase B8 — Validation, Error Handling & Logging

| Field | Detail |
|-------|--------|
| **Objective** | Consistent API contract |
| **Implement** | Standard ApiError shape; validator on every route; structured pino + request ID |
| **Dependencies** | B2, B4, B5 |
| **Outcome** | Predictable errors for frontend parse-error |

---

### Phase B9 — Rate Limiting & Security Hardening

| Field | Detail |
|-------|--------|
| **Objective** | Production security baseline |
| **Implement** | Rate limit public POST; Helmet; SESSION_SECRET validation; body size limits; login slow-down |
| **Dependencies** | B3, B4 |
| **Outcome** | Abuse-resistant public endpoints |

---

### Phase B10 — Redis Caching Layer

| Field | Detail |
|-------|--------|
| **Objective** | Reduce DB load on hot reads |
| **Implement** | Redis client; cache site settings, services, projects; invalidation on writes; graceful degrade |
| **Dependencies** | B4, B5 |
| **Scalability** | Horizontal Express with shared cache |
| **Outcome** | Faster public reads under load |

---

### Phase B11 — Queue & Background Jobs

| Field | Detail |
|-------|--------|
| **Objective** | Async work off request path |
| **Implement** | BullMQ + Redis; email/audit jobs; separate worker process; retry + DLQ |
| **Dependencies** | B10, B7 |
| **Outcome** | Reliable async notifications |

---

### Phase B12 — WebSocket Architecture

| Field | Detail |
|-------|--------|
| **Objective** | Realtime admin events |
| **Implement** | WS server; session auth on connect; channels admin:stats, admin:leads; emit from services |
| **Dependencies** | B3, B5 |
| **Outcome** | Powers Frontend F15 |

---

### Phase B13 — Testing Architecture

| Field | Detail |
|-------|--------|
| **Objective** | Module-level test confidence |
| **Implement** | Service unit tests; supertest integration; validator snapshots; CI on PR |
| **Dependencies** | B4, B5, B3 |
| **Outcome** | Safe module refactoring |

---

### Phase B14 — Docker, DevOps & Monitoring Readiness

| Field | Detail |
|-------|--------|
| **Objective** | Deployable backend on Railway |
| **Implement** | Dockerfile; docker-compose; Railway health check; startup env validation; README |
| **Dependencies** | B1–B9 minimum |
| **Outcome** | One-command local dev; deploy playbook |

---

### Phase B15 — Monitoring & Horizontal Scaling Readiness

| Field | Detail |
|-------|--------|
| **Objective** | Operate at enterprise scale |
| **Implement** | Latency/error metrics; Neon pooling under load; stateless instances; runbooks |
| **Dependencies** | B10–B14 |
| **Outcome** | Production operations ready |

---

## 4. Backend Recommended Build Order

```
B1 → B2 → B3 ──────────────────────────────────────────────┐
              │                                            │
              ├→ B4 (unblocks Frontend F5, F6)             │
              │                                            │
              └→ B5 → B8 → B9 (unblocks Frontend F9)       │
                        │                                  │
                        ├→ B6 → (unblocks Frontend F11)    │
                        ├→ B7                              │
                        │                                  │
                        └→ B10 → B11 → B12                 │
                              (scale & realtime)           │
                                                           │
B13 parallel from B5 │ B14 after B9 │ B15 last ←───────────┘
```

| Path | Phases |
|------|--------|
| **Minimum for admin MVP** | B1 → B2 → B3 → B4 → B5 → B6 |
| **Legacy cleanup** | After B5: delete `src/workplace/`, move flat routes into modules |

---

## 5. Scalability Recommendations

| Layer | Recommendation |
|-------|----------------|
| Frontend | RSC-first public site; module boundaries for team parallelization |
| Frontend | Server Actions reduce client API surface; BFF presign only for S3 |
| Backend | Stateless Express + DB sessions → horizontal scale on Railway |
| Database | Neon pooler; indexes on admin filter columns (status, createdAt) |
| Cache | Redis for site settings and catalog reads (B10) |
| Async | Queue for email and heavy work (B11) — never block HTTP |
| Storage | Direct S3 upload — never proxy file bytes |
| Realtime | WS admin-only first; keep public SSR simple |
| Future | Module pattern supports `organizationId` without route rewrites |

---

## 6. Architecture Milestones

| Milestone | Definition of Done | Phases |
|-----------|-------------------|--------|
| **M0 — Foundation** | Folder tree matches cursor rules; url-helpers + api-helpers work | F1, B1, B2 |
| **M1 — Public Beta** | Public pages SSR + SEO + submit form live | F5, F6, B4 |
| **M2 — Auth MVP** | Secure login; protected admin end-to-end | F7, B3 |
| **M3 — Admin CMS** | Admin route-based; CRUD via Server Actions | F8, F9, B5 |
| **M4 — Media & Email** | S3 uploads + Resend notifications | F11, B6, B7 |
| **M5 — Legacy Free** | No Orval, Replit, React Query on public, workplace packages | F9+, B5+ |
| **M6 — Production** | CI/CD, monitoring, rate limits, error boundaries | F13, B9, B14 |
| **M7 — Scale** | Redis, job queue, WS admin realtime | F15, B10–B12 |

---

## 7. Suggested Team Workflow

### Sprint model (2-week sprints)

| Role | Focus |
|------|-------|
| Frontend dev | One `modules/public/*` or `modules/admin/*` per sprint |
| Backend dev | One `modules/*` per sprint (routes → service → validator) |
| Shared | Align Zod validators between frontend `lib/validators/` and backend `*.validator.ts` |

### Workflow rules

1. **Contract first** — agree API path + payload in url-helpers before UI work
2. **Reference module** — complete `leads` first as template for all modules
3. **No legacy extension** — PRs touching Orval/Replit code must migrate, not patch
4. **Thin PRs** — one module or one phase slice per PR
5. **Definition of Done** — milestone checklist + cursor rules compliance
6. **Parallel work** — Frontend F5–F6 with Backend B4 while B3 runs in parallel

### Onboarding (create at M0)

- Module template README
- How to add a new admin section (5 steps)
- Env setup: Vercel + Railway + Neon

---

## 8. Common Anti-Patterns To Avoid

| Anti-pattern | Correct approach |
|--------------|------------------|
| Monolithic admin page with tabs | F8 route split |
| `useListLeads()` Orval in new code | Module service + RSC/Server Actions |
| Entire page `"use client"` | Server Component + client islands |
| `useSeoMeta` / `document.title` | `generateMetadata()` |
| Hardcoded `/api/leads` in components | `lib/url-helpers/api-endpoints.ts` |
| Business logic in `app/**/page.tsx` | Delegate to `modules/` |
| Admin importing `modules/public/` | Use `modules/shared/` |
| DB queries in Express route handlers | `*.service.ts` |
| Plaintext admin password | bcrypt + users table (B3) |
| Unprotected GET `/api/leads` | `requireAuth` (B5) |
| Replit GCS / sidecar storage | AWS S3 (B6) |
| Upload files through Next/Express body | Presigned S3 (F11, B6) |
| TanStack Query on new public pages | RSC + Server Actions |
| Code under `workplace/` or `artifacts/` | Target module paths only |
| Redis/WS before modular foundation | B10–B12 after B5 |

---

## Summary Timeline (Indicative)

| Track | Duration | Phases |
|-------|----------|--------|
| Frontend core | 4–6 weeks | F1–F13 |
| Backend core | 3–5 weeks | B1–B9 (overlap from week 2) |
| Scale & realtime | 2–3 weeks | F14–F16, B10–B15 |
| **Total to M6 Production** | **~8–10 weeks** | 1–2 devs parallelizing |

---

*Last updated: aligned with Cursor Rules in `.cursor/rules/`.*
