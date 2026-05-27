# Completed Tasks

_Last updated: 2026-05-27_

---

## Frontend

### F1 — Foundation & Platform Setup ✅
- `lib/url-helpers/routes.ts` — ROUTES.* constants
- `lib/url-helpers/api-endpoints.ts` — API.* constants
- `lib/api-helpers/axios-instance.ts` — apiAxios with JWT interceptor
- `lib/api-helpers/client.ts` — fetch-based apiClient for RSC/Server Actions
- `lib/api-helpers/parse-error.ts` — parseApiError()
- `lib/constants/branding.ts` — BRAND.* color tokens
- `lib/constants/env.ts`, `site.ts`
- `lib/types/domain.ts` — Lead, Project, Document, CatalogService, Testimonial, ContentStat, MethodologyStep, SiteSetting, AuditLog, DashboardStats, ProjectStats
- `lib/enums/lead-status.ts`
- `lib/validators/lead.ts`, `project.ts`, `document.ts`, `service.ts`, `interest.ts`, `content.ts`

### F2 — App Architecture & Routing Shell ✅
- `src/app/(public)/layout.tsx` — Navbar + Footer shell
- `src/app/(admin)/layout.tsx` — requireAdmin() guard
- `src/app/layout.tsx` — root layout with providers
- `middleware.ts` — protects /admin/* except /login

### F3 — Shared UI System ✅
- shadcn/Radix components in `components/ui/`
- `components/common/` — Navbar, Footer
- sonner provider in root layout

### F4 — API Integration Layer ✅
- Module service pattern established
- TanStack Query with apiAxios in all admin services
- All Zod validators written

### F5 — Public Pages ✅
- Home, About, Services, Projects, Government pages as RSC

### F6 — Public Forms & Server Actions ✅
- `lib/actions/public.ts` — submitLead, expressInterest
- `modules/public/modals/ExpressInterestModal.tsx`

### F7 — Authentication Flow ✅
- `lib/auth.ts` — verifySession(), requireAdmin()
- JWT access_token (15min) + refresh_token (7d) httpOnly cookies
- `modules/admin/auth/auth.service.ts` — login/logout/refresh
- `app/(admin)/admin/login/page.tsx` — login form
- `middleware.ts` — route-level guard
- Auto-refresh interceptor in apiAxios

### F8 — Admin Shell & Dashboard ✅
- `modules/admin/shared/components/AdminSidebar.tsx` — usePathname-based nav
- `modules/admin/shared/components/AdminHeader.tsx` — route-aware breadcrumbs
- `components/layout/AdminShell.tsx` — composes sidebar + header
- Route pages created: /admin, /admin/leads, /admin/projects, /admin/documents, /admin/content, /admin/audit, /admin/settings

### F9 — Admin Feature Modules ✅
- Migrated all components from `components/admin/` → `modules/admin/*/components/`
- Deleted all 16 legacy `components/admin/*.tsx` files
- Replaced all api-client-react imports with module service hooks
- Replaced all useToast with sonner
- Replaced all raw fetch() with apiAxios
- Created: LeadsTable, ProjectsTable, DocumentsTable, DashboardPage, AuditLogViewer, SettingsPanel
- Created: ContentPage, SiteSettingsManager, BrandingManager, NavigationManager, TeamManager, ServicesManager, TestimonialsManager, ContentStatsManager, MethodologyManager, AboutEditor, ImagesEditor
- `modules/admin/content/services/site-settings.service.ts` — useGetSiteSettings(key), useUpdateSiteSettings()

### F10 — Tables, Search & Filter ✅
- `modules/admin/shared/components/StatusBadge.tsx`
- `modules/admin/shared/components/TableToolbar.tsx`
- `modules/admin/shared/hooks/useDebouncedSearch.ts`
- `modules/admin/shared/hooks/useTableFilters.ts`

---

## Backend

### B1 — DB Foundation ✅
- All tables in `src/db/schema/`: leads, projects, project_interests, documents, services, content_stats, methodology_steps, site_settings, testimonials, audit_logs, users, sessions
- Drizzle migrations applied to Neon PostgreSQL

### B2 — Shared Layer ✅
- `shared/middleware/error-handler.ts`
- `shared/api-helpers/parse-id-param.ts`, `send-json.ts`
- `shared/url-helpers/route-paths.ts` — ROUTE_PATHS.*
- `shared/lib/email.ts` — sendInquiryNotification (Resend)
- `shared/lib/logger.ts`
- CORS configured with ALLOWED_ORIGINS env var

### B3 — Auth Module ✅
- `modules/auth/` — login, verify, logout, refresh, change-password
- `shared/middleware/require-auth.ts` — JWT validation
- bcrypt password hashing
- `scripts/migrate-passwords.ts`

### B4 — Public APIs ✅
- GET /api/projects (public list + detail)
- GET /api/services (public list)
- GET /api/testimonials (public list)
- GET /api/content/stats, /methodology, /settings/:key (public)
- POST /api/leads (public — submit inquiry)
- POST /api/projects/:id/interests (public — express interest)

### B5 — Protected Admin APIs ✅
- All admin CRUD behind requireAuth
- Leads: GET list/detail, PATCH
- Projects: POST/PATCH/DELETE, GET interests
- Documents: GET/POST/PATCH/DELETE
- Services: POST/PATCH/DELETE
- Content: POST/PATCH/DELETE stats/methodology, PATCH settings
- Testimonials: POST/PATCH/DELETE
- Stats: GET /stats, /stats/projects
- Audit: GET/DELETE /audit
- Notifications: GET/POST /notifications
- Swagger updated with correct Lead status enum

---

## Database

### Seed Data ✅ (2026-05-24)
- 8 projects (Lagos highway, Nairobi solar, Accra water, etc.)
- 6 services (Project Finance, PPP, Government Strategy, etc.)
- 5 testimonials (AfDB, Ministry of Finance Guinea, Kenya Power, etc.)
- 6 content stats (120+ projects, $4.2B mobilised, 34 countries, etc.)
- 6 methodology steps
- 6 documents
- 8 leads (mixed statuses: new/reviewed/contacted/qualified/proposal_sent/in_progress)
- 6 site settings (hero, footer, branding, seo_home, seo_projects, navigation)

### Seed Data Extended ✅ (2026-05-25)
- 5 FAQs (services/general/process/government/investment categories)
- New site_settings keys seeded: announcement_bar, maintenance_mode, legal_privacy, legal_terms, section_visibility

---

## Replit Sync Phases

### R1 — FAQs Schema & Backend Module ✅ (2026-05-25)
- `zafora-backend/src/db/schema/faqs.ts` — faqsTable schema
- `zafora-backend/src/db/schema/index.ts` — faqs export added
- `zafora-backend/src/modules/faqs/faqs.routes.ts` — GET/POST/PATCH/DELETE /api/content/faqs
- `zafora-backend/src/modules/faqs/faqs.service.ts` — CRUD service
- `zafora-backend/src/modules/faqs/faqs.validator.ts` — Zod CreateFaqBody + UpdateFaqBody
- `zafora-backend/src/modules/faqs/index.ts`
- route-paths.ts + routes/index.ts updated to mount faqsRouter
- swagger.ts updated with FAQ schema + 4 endpoints

### R2 — Backend Setting Defaults ✅ (2026-05-25)
- `content.service.ts` SETTING_DEFAULTS extended with:
  - `announcement_bar` (enabled, message, link, linkText, dismissible, bgColor, textColor)
  - `maintenance_mode` (enabled, headline, message, showContactEmail, estimatedTime)
  - `legal_privacy` (title, lastUpdated, content)
  - `legal_terms` (title, lastUpdated, content)
  - `section_visibility` (per-page section toggles for all 6 public pages)
  - Expanded `branding`, `hero`, `about` defaults

### R3 — Frontend Module Setup ✅ (2026-05-25)
- `modules/admin/faqs/` — service + index created
- `lib/url-helpers/routes.ts` — added ADMIN.FAQ, ANNOUNCEMENT, SECTION_VISIBILITY, MAINTENANCE, LEGAL
- `lib/url-helpers/api-endpoints.ts` — added CONTENT.FAQS + CONTENT.FAQS_BY_ID
- `app/(public)/privacy/page.tsx` — public route stub
- `app/(public)/terms/page.tsx` — public route stub

### R4 — New Admin Components ✅ (2026-05-25)
- `modules/admin/faqs/components/FaqManager.tsx` — list/filter/CRUD/toggle/order
- `modules/admin/content/components/AnnouncementManager.tsx` — live preview, color picker, presets
- `modules/admin/content/components/MaintenanceManager.tsx` — toggle + warning banner
- `modules/admin/content/components/LegalPagesEditor.tsx` — tabbed Privacy/Terms markdown editor
- `modules/admin/content/components/SectionVisibilityManager.tsx` — per-page section toggles
- `app/(admin)/admin/faq/page.tsx` — thin page → FaqManager
- `app/(admin)/admin/announcement/page.tsx` — thin page → AnnouncementManager
- `app/(admin)/admin/maintenance/page.tsx` — thin page → MaintenanceManager
- `app/(admin)/admin/legal/page.tsx` — thin page → LegalPagesEditor
- `app/(admin)/admin/section-visibility/page.tsx` — thin page → SectionVisibilityManager
- `modules/admin/shared/components/AdminSidebar.tsx` — added Site Control group + FAQ/Legal nav items

### R5 — Frontend Public Pages & Layout ✅ (2026-05-25)
- `modules/public/legal/components/LegalPageView.tsx` — shared RSC renderer (Privacy + Terms)
- `app/(public)/privacy/page.tsx` — RSC fetches legal_privacy setting
- `app/(public)/terms/page.tsx` — RSC fetches legal_terms setting
- `app/maintenance/page.tsx` — standalone maintenance page (no layout)
- `middleware.ts` — maintenance_mode guard with 60s revalidate cache
- `components/common/AnnouncementBar.tsx` — server component (reads announcement_bar setting)
- `components/common/Navbar.tsx` — sticky/fixed classes removed (FR-HEADER-001)

### R7 — Auth Enhancements ✅ (2026-05-25)
- `GET /api/auth/setup-status` — returns `{ required: boolean }` based on users table
- `POST /api/auth/setup` — first-time admin creation, requires ADMIN_SETUP_EMAIL match
- `POST /api/auth/reset-password` — emergency reset without current password
- `ADMIN_SETUP_EMAIL` added to `zafora-backend/.env`
- Login page updated to handle setupRequired response

### R8 — Seed Data Updates ✅ (2026-05-25)
- `scripts/seed.ts` — FAQs seeded (5 entries, mixed categories/pages)
- `scripts/seed.ts` — new site_settings keys seeded (announcement_bar, maintenance_mode, legal_privacy, legal_terms, section_visibility)

---

### B7 — Resend Email Integration ✅ (2026-05-25)
- `getAdminEmail()` now returns hardcoded default (ADMIN_EMAIL env) when DB row missing — no more silent skip on fresh DB
- Resend client refactored to lazy singleton (`getResend()`) — no more per-call instantiation
- `notifications` key added to `seed.ts` — fresh installs have admin email wired from day 1
- All three email functions (`sendInquiryNotification`, `sendInterestNotification`, `sendTestEmail`) use singleton
- Frontend `SettingsPanel.tsx` already complete (no changes needed)
- `RESEND_API_KEY` already set in `.env` and Railway

---

### Bug Fix Round 1 ✅ (2026-05-26)
- `auth.validator.ts` — `ChangePasswordBody.newPassword` min(8) → min(4)
- `SettingsPanel.tsx` — validation guard + placeholder updated to 4 chars
- `login/page.tsx` — `ForgotPasswordForm` + `"forgot"` mode added to `AuthGate`; "Forgot password?" link in `LoginForm`
- `LeadsTable.tsx` — notes textarea + `handleSaveNotes` in detail modal; `openLead()` initialises `notesValue`
- `AdminHeader.tsx` — "View Website" Globe link added to top bar
- `projects/page.tsx` — `hasActiveFilters` flag; "Pipeline under development" state when DB is empty
- `page.tsx` — `HERO_DEFAULTS.badge` = "Open for Engagement · Est. 2025"; hardcoded "Active Pipeline" → "Accepting Mandates"

### S3 Folder Structure ✅ (2026-05-27)
- `zafora-backend/src/shared/constants/storage-folders.ts` — S3_FOLDERS + ALLOWED_S3_FOLDERS enum
- `zafora-backend/src/modules/storage/storage.validator.ts` — folder is now `z.enum(ALLOWED_S3_FOLDERS)` (strict)
- `zafora-frontend/src/lib/constants/storage.ts` — STORAGE_FOLDER + StorageFolder type
- `zafora-frontend/src/lib/constants/index.ts` — exports STORAGE_FOLDER
- `zafora-frontend/src/hooks/use-image-upload.ts` — `folder: StorageFolder` now required
- `zafora-frontend/src/modules/admin/shared/components/PhotoUploadField.tsx` — `folder` prop required
- All callers wired: BrandingManager (logo/favicon), TeamManager, ServicesManager, TestimonialsManager, ProjectsTable, ImagesEditor (home/services/government)

### B6 — File Upload & Storage Module ✅ (2026-05-26)
- `zafora-backend/src/shared/lib/object-storage.ts` — AWS S3 service: `getPresignedPutUrl()` + `deleteObject()`
- `zafora-backend/src/modules/storage/storage.validator.ts` — Zod `PresignBody` (fileName, contentType, size, folder)
- `zafora-backend/src/modules/storage/storage.routes.ts` — `POST /storage/presign` behind `requireAuth`
- `zafora-backend/src/modules/storage/index.ts`
- `zafora-backend/src/routes/index.ts` — replaced old Replit GCS storageRouter with new module
- `zafora-backend/src/shared/lib/swagger.ts` — `/api/storage/presign` documented
- `zafora-backend/.env` — AWS_S3_BUCKET, AWS_S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_CUSTOM_DOMAIN added
- `zafora-frontend/src/lib/url-helpers/api-endpoints.ts` — STORAGE.PRESIGN added
- Installed: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- **Constraint:** Fill AWS credentials in `.env` and Railway before F11 uploads work

---

---

## Audit Round 2 — api-client-react full removal ✅ (2026-05-26)

- `app/(public)/about/page.tsx` — `useGetSiteSettings` → `useSiteSetting`
- `app/(public)/services/page.tsx` — `useListServices` + `useGetSiteSettings` → `useServices` + `useSiteSetting`
- `app/(public)/submit/page.tsx` — `useCreateLead` (Orval) → `useMutation(apiAxios.post)`, `useGetSiteSettings` → `useSiteSetting`
- `app/(public)/government/page.tsx` — `useGetSiteSettings` → `useSiteSetting`
- `app/(public)/government-review/page.tsx` — `useGetSiteSettings` → `useSiteSetting`
- ✓ Zero `api-client-react` imports remain in `src/app/(public)/`

---

## Audit Round 3 — DB cleanup + admin-public sync ✅ (2026-05-26)

### DB Unique Constraints (applied live on Neon)
- `content_stats.label` — unique
- `methodology_steps.step_number` — unique
- `services.name` — unique
- `faqs.question` — unique
- `documents.title` — unique
- `projects.name` — unique
- Applied via `scripts/apply-unique-constraints.ts`

### Seed Rewrite (`scripts/seed.ts`)
- Removed all fabricated data: 8 fake projects, 5 fake testimonials, 6 fake stats, 8 fake leads, 6 placeholder documents
- Seed now fully idempotent: `DELETE FROM` all seeded tables at start
- Fixed JSON shape mismatches: `hero` (all fields), `footer` (`tagline`→`description`), `branding` (full 10-field admin shape), `navigation` (`/government`→`/government-review`)
- Added new settings seeds: `about` (empty team), `site_images` (empty), `services_page`, `government_page`, `submit_page`, all `seo_*` keys

### Admin → Public Sync
- `Navbar.tsx` — now reads `branding.logoUrl` from DB; falls back to static `logo.png`
- `GlobalLayout.tsx` — footer logo now reads `branding.logoUrl` from DB
- `about/page.tsx` — removed 5 hardcoded fake team members from `DEFAULTS.team` (now `[]`)

### Real Project Data Seeded
- 6 live projects added: Rwanda Smart Grid, Mozambique LNG Roads, Lagos-Ibadan Healthcare, Nairobi Water, Sahel Solar Corridor, Lamu Port Phase II

### Type Fix
- `page.tsx` testimonial section: `clientName`→`name`, `clientTitle`→`role` (aligns with `Testimonial` type)

---

## Partially Done / In Progress

### lib/site-settings.ts ⚠️ (2026-05-25)
- `getSectionVisibility()` server helper NOT yet created
- Public pages do NOT yet consume `section_visibility` setting
