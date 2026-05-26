# Current Focus

_Last updated: 2026-05-26_

---

## Active Phase

**Audit Round 2 — api-client-react full removal + duplicate data fix — COMPLETED ✅ (2026-05-26)**  
All 5 remaining deprecated pages migrated. Duplicate stats/methodology DB data cleared via seed fix.

**Next priority: F11 — Frontend upload pipeline (presign Next.js route + use-s3-upload hook + ImageUploader + PhotoUploadField)**

---

## Last Completed Work (2026-05-26 — Audit Round 3)

1. **DB unique constraints**: Added `.unique()` to `content_stats.label`, `methodology_steps.step_number`, `services.name`, `faqs.question`, `documents.title`, `projects.name` via `apply-unique-constraints.ts` script
2. **Seed full rewrite**: Removed all fabricated projects (8), testimonials (5), stats (6 fake), leads (8), documents (6). Kept services, methodology steps, FAQs. Fixed `hero` shape (now matches `HERO_DEFAULTS`), `footer` (`tagline`→`description`, real USA address), `branding` (full admin form shape), navigation (`/government-review`). Added `about` (empty team), `site_images` (empty placeholders), `services_page`, `government_page`, `submit_page`, all `seo_*` keys. Seed now deletes all seeded tables at start (fully idempotent)
3. **About page team**: Removed 5 hardcoded fake team members from `DEFAULTS.team` → now `[]`
4. **Navbar logo**: Now reads `branding.logoUrl` from DB; falls back to static `logo.png`
5. **GlobalLayout logo**: Now reads `branding.logoUrl` from DB; falls back to static `logo.png`

## Previous Completed Work (2026-05-26 — Audit Round 2)

1. **Duplicate stats/methodology fix**: `seed.ts` now does `DELETE FROM` before insert for `content_stats` + `methodology_steps`; seed re-run to clear duplicates
2. **about/page.tsx**: `useGetSiteSettings` → `useSiteSetting` (removed `api-client-react`)
3. **services/page.tsx**: `useListServices` + `useGetSiteSettings` → `useServices` + `useSiteSetting` (removed `api-client-react`)
4. **submit/page.tsx**: `useCreateLead` → `useMutation(apiAxios.post)`, `useGetSiteSettings` → `useSiteSetting` (removed Orval `{ data: {...} }` wrapper, removed `api-client-react`)
5. **government/page.tsx**: `useGetSiteSettings` → `useSiteSetting` (removed `api-client-react`)
6. **government-review/page.tsx**: `useGetSiteSettings` → `useSiteSetting` (removed `api-client-react`)

✓ Zero `api-client-react` imports remain in `src/app/(public)/`

## Previous Completed Work (2026-05-26 — Bug Fix Round 1)

1. **Password min fix**: `auth.validator.ts` `ChangePasswordBody.newPassword` min(8) → min(4); `SettingsPanel.tsx` validation + placeholder updated
2. **Forgot password UI**: Added `ForgotPasswordForm` component + `"forgot"` mode to `AuthGate`; "Forgot password?" link added to `LoginForm`
3. **Lead notes**: Notes textarea + Save Notes button added to `LeadsTable` detail modal; wired to `updateLead` PATCH
4. **View Website in header**: `AdminHeader.tsx` now has Globe + "View Website" link in top bar alongside Sign Out
5. **Projects empty state**: Split into "Pipeline under development" (no DB projects) vs "No projects found" (active filters)
6. **Hero text**: `HERO_DEFAULTS.badge` → "Open for Engagement · Est. 2025"; hardcoded "Active Pipeline" → "Accepting Mandates"

## Previously Completed Work (2026-05-25)

1. **R1**: Created `faqs` DB schema + full backend module (routes/service/validator/swagger)

2. **R2**: Extended SETTING_DEFAULTS in `content.service.ts` with 5 new keys + expanded branding/hero/about

3. **R3**: Created `modules/admin/faqs/` frontend module, added 5 new ADMIN routes constants, CONTENT.FAQS API endpoint constants

4. **R4**: Created 5 new admin manager components:
   - FaqManager, AnnouncementManager, MaintenanceManager, LegalPagesEditor, SectionVisibilityManager
   - 5 thin admin route pages (/admin/faq, /announcement, /maintenance, /legal, /section-visibility)
   - Updated AdminSidebar with "Site Control" group + FAQ/Legal nav items

5. **R5**: Created LegalPageView shared component, /privacy, /terms, /maintenance pages, wired maintenance guard in middleware.ts, created AnnouncementBar component, removed sticky header from Navbar

6. **R7**: Added auth setup-status / setup / reset-password endpoints + ADMIN_SETUP_EMAIL env var

7. **R8**: Seeded FAQs (5 entries) + new site_settings keys in seed.ts

---

## Last Edited Files (2026-05-26 — Bug Fixes)

- `zafora-backend/src/modules/auth/auth.validator.ts` (ChangePasswordBody min 8→4)
- `zafora-frontend/src/modules/admin/settings/components/SettingsPanel.tsx` (min validation + placeholder)
- `zafora-frontend/src/app/(auth)/login/page.tsx` (ForgotPasswordForm added, LoginForm got onForgot prop + link)
- `zafora-frontend/src/modules/admin/leads/components/LeadsTable.tsx` (notes textarea + saveNotes handler)
- `zafora-frontend/src/modules/admin/shared/components/AdminHeader.tsx` (View Website link added)
- `zafora-frontend/src/app/(public)/projects/page.tsx` (empty state split + hasActiveFilters)
- `zafora-frontend/src/app/(public)/page.tsx` (HERO_DEFAULTS.badge + hardcoded Accepting Mandates)

## Previously Edited Files (2026-05-25 — R1–R8)

- `zafora-backend/src/db/schema/faqs.ts` (new)
- `zafora-backend/src/modules/faqs/` (new — full module)
- `zafora-backend/src/modules/content/content.service.ts` (extended SETTING_DEFAULTS)
- `zafora-backend/src/modules/auth/auth.routes.ts` (added setup-status, setup, reset-password)
- `zafora-backend/scripts/seed.ts` (extended — FAQs + new settings keys)
- `zafora-frontend/src/modules/admin/faqs/` (new — FaqManager + service)
- `zafora-frontend/src/modules/admin/content/components/AnnouncementManager.tsx` (new)
- `zafora-frontend/src/modules/admin/content/components/MaintenanceManager.tsx` (new)
- `zafora-frontend/src/modules/admin/content/components/LegalPagesEditor.tsx` (new)
- `zafora-frontend/src/modules/admin/content/components/SectionVisibilityManager.tsx` (new)
- `zafora-frontend/src/modules/admin/shared/components/AdminSidebar.tsx` (updated nav groups)
- `zafora-frontend/src/modules/public/legal/components/LegalPageView.tsx` (new)
- `zafora-frontend/src/app/(public)/privacy/page.tsx` (new)
- `zafora-frontend/src/app/(public)/terms/page.tsx` (new)
- `zafora-frontend/src/app/maintenance/page.tsx` (new)
- `zafora-frontend/src/middleware.ts` (maintenance guard added)
- `zafora-frontend/src/components/common/AnnouncementBar.tsx` (new)
- `zafora-frontend/src/components/common/Navbar.tsx` (sticky removed)
- `zafora-frontend/src/lib/url-helpers/routes.ts` (5 new ADMIN routes)
- `zafora-frontend/src/lib/url-helpers/api-endpoints.ts` (FAQS endpoints)

---

## Next Actions (Priority Order)

1. **Create `lib/site-settings.ts`**: Server helper `getSectionVisibility()` + use in public page RSCs
2. **F11**: `app/api/storage/presign/route.ts` (Next.js BFF → calls Express `/api/storage/presign`) → `hooks/use-s3-upload.ts` → `ImageUploader`
3. **R6/PhotoUploadField**: `modules/admin/shared/components/PhotoUploadField.tsx` (after F11)
4. **Set AWS credentials**: Fill `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` in `.env` + Railway
5. **F12**: Add `loading.tsx` + `error.tsx` to each individual admin route segment (leads, projects, documents, etc.)
6. **B9**: Add `helmet`, `express-rate-limit`, body size limits to `zafora-backend/src/app.ts`
7. **F13**: `generateMetadata()` on each public page, `sitemap.ts`, `robots.ts`
8. **Cleanup**: Verify zero imports then delete deprecated `lib/api-client-react`, `lib/api-zod`, `lib/api-spec`, `lib/object-storage-web`, `lib/db`

---

## Known Gaps (Updated 2026-05-26)

| Gap | File | Status |
|-----|------|--------|
| Change-password min 4 | `auth.validator.ts` + `SettingsPanel.tsx` | ✅ Fixed |
| Forgot password UI | `login/page.tsx` | ✅ Fixed |
| Lead notes UI | `LeadsTable.tsx` | ✅ Fixed |
| View Website in header | `AdminHeader.tsx` | ✅ Fixed |
| Projects empty state | `projects/page.tsx` | ✅ Fixed |
| Hero badge / Accepting Mandates | `page.tsx` | ✅ Fixed |
| Image uploads (F11) | `PhotoUploadField`, `ImageUploader`, `use-s3-upload` | ⏳ Pending — next priority |
| AnnouncementBar in layout | `app/(public)/layout.tsx` | ✅ Done (wired) |
| site-settings.ts helper | `lib/site-settings.ts` | ⚠️ Not created |
| Section visibility in public pages | All public RSC pages | ⚠️ Depends on site-settings.ts |
| F12 per-segment loading | `/admin/leads/`, `/admin/projects/`, etc. | ⏳ Pending |
| B9 Security (helmet, rate limit) | `src/app.ts` | ⏳ Pending |
| F13 SEO | generateMetadata, sitemap, robots | ⏳ Pending |
| Migrate all public pages off api-client-react | all `app/(public)/` pages | ✅ Done (all 7 pages migrated) |
| Duplicate stats/methodology in DB | seed ran twice | ✅ Fixed (seed fully idempotent with DELETE) |
| DB unique constraints | 6 tables had no uniqueness | ✅ Applied live on Neon |
| Fabricated seed data | fake projects/leads/testimonials | ✅ Removed; 6 real projects added |
| Seed JSON shape mismatches | hero/footer/branding/nav wrong keys | ✅ All corrected |
| About page fake team members | 5 hardcoded fake names | ✅ Removed (team: []) |
| branding.logoUrl not wired | Navbar/Footer used static logo only | ✅ Wired in Navbar + GlobalLayout |
| Testimonial type error (clientName) | page.tsx used wrong field names | ✅ Fixed (name + role) |
| section_visibility on public pages | not consumed anywhere | ⚠️ Pending lib/site-settings.ts |

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| `useGetSiteSettings(key)` fetches single setting | Matches component usage pattern (one key per manager) |
| `useUpdateSiteSettings` takes `{ key, data: { value } }` | Preserves original Orval hook shape — no component rewrites needed |
| ContentPage uses `?section=` query param | Preserves URL state, works with Next.js App Router |
| Lead statuses: new/reviewed/contacted/qualified/proposal_sent/in_progress/closed/rejected | Frontend-defined; DB column is open text; swagger updated to match |
| Maintenance guard uses `next: { revalidate: 60 }` | Avoids hitting backend on every request — 60s cache |
| Auth setup uses ADMIN_SETUP_EMAIL env match | Prevents unauthorized first-time admin creation |
| Sticky header removed entirely (no position class) | Per FR-HEADER-001 spec requirement |
