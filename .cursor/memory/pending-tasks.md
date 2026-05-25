# Pending Tasks

_Last updated: 2026-05-25_

---

## Replit Sync (RR-Series) — COMPLETED ✅
All RR1–RR8 phases executed. See `.cursor/rules/replit-update-code-to-sync.mdc` for details.

---

## Frontend — Pending

### F11 — File Uploads (Next Priority)
**Dependencies:** B6 must be done first (AWS S3)
- [ ] `app/api/storage/presign/route.ts` — Next.js Route Handler for presign URL
- [ ] `hooks/use-s3-upload.ts` — client hook that calls presign then uploads directly to S3
- [ ] `modules/admin/shared/components/PhotoUploadField.tsx` — drag-drop UI component
- [ ] Wire PhotoUploadField into content forms (project imageUrl, branding logo, team photos, etc.)
- [ ] Update `next/image` domains in `next.config.ts` to allow S3 bucket URL

### F12 — Error, Loading & Performance
- [ ] Add `loading.tsx` to each admin route segment (`admin/leads/`, `admin/projects/`, etc.)
- [ ] Add `error.tsx` to each admin route segment
- [ ] Audit all public pages for missing Suspense boundaries
- [ ] `next/image` audit — confirm all images use it
- [ ] Remove unused TanStack Query imports on any public page

### F13 — SEO & Production Readiness
- [ ] Complete `generateMetadata()` for all public pages (about, services, projects, government, submit)
- [ ] `app/sitemap.ts` — dynamic sitemap with all public routes + projects
- [ ] `app/robots.ts` — disallow /admin/* in production
- [ ] OG image metadata from CMS (hero settings key)
- [ ] CI: add lint + typecheck + build check on PR

### F14 — RBAC Frontend (Future)
- [ ] `lib/enums/user-role.ts` — UserRole enum
- [ ] `lib/has-permission.ts` — permission check helper
- [ ] Conditional AdminSidebar items by role
- [ ] Guard Server Actions by role (requires B3 role expansion)

---

## Backend — Pending

### B6 — File Storage / AWS S3 (Next Priority)
- [ ] `shared/lib/object-storage.ts` — AWS S3 SDK client, presignedPutUrl(), presignedGetUrl()
- [ ] `modules/storage/storage.routes.ts` — POST /storage/uploads/request-url (protected)
- [ ] `modules/storage/storage.service.ts` — generate presigned URL with 15min TTL
- [ ] Remove Replit GCS references (`@google-cloud/storage`, `127.0.0.1:1106`)
- [ ] Set S3 CORS policy to allow frontend origin

### B7 — Notification & Email Module
- [ ] Wire `sendInquiryNotification` in leads.service.ts (partially done — Resend key needed)
- [ ] `notifications/notifications.service.ts` — sendTestEmail(), getStatus()
- [ ] Interest notification email when someone expresses interest in a project
- [ ] Configure `RESEND_API_KEY` + `RESEND_FROM_EMAIL` in Railway env

### B8 — Validation, Error Handling & Logging
- [ ] Structured pino logger replacing `console.log` in services
- [ ] Standard `ApiError` class in `shared/types/`
- [ ] Request ID middleware (correlate logs per request)
- [ ] Consistent error response shape: `{ error: string, code?: string, details?: unknown }`

### B9 — Rate Limiting & Security Hardening
- [ ] `express-rate-limit` on POST /api/leads (public form abuse prevention)
- [ ] `express-slow-down` on POST /api/auth/login (brute-force mitigation)
- [ ] Helmet middleware for security headers
- [ ] Body size limit: 10KB for JSON, 50MB for multipart (future file upload)
- [ ] Validate `SESSION_SECRET` / `JWT_*_SECRET` min length on startup

---

## Cleanup — Required After F11

These legacy Replit-era folders must be deleted from `zafora-frontend/src/`:
- [ ] `lib/api-client-react/` — Orval generated hooks (fully deprecated)
- [ ] `lib/api-zod/` — Orval Zod schemas (never used in new code)
- [ ] `lib/api-spec/` — OpenAPI spec + orval config (no longer needed)
- [ ] `lib/object-storage-web/` — Replit GCS upload hook (replaced by S3)
- [ ] `lib/db/` — Drizzle client inside frontend (DB is backend-only)
- [ ] `hooks/use-toast.ts` — legacy toast hook (replaced by sonner)

Verify zero imports before deleting each:
```
rg "api-client-react" --type ts
rg "api-zod" --type ts
rg "object-storage-web" --type ts
rg "lib/db" --type ts (frontend only)
rg "use-toast" --type ts
```
