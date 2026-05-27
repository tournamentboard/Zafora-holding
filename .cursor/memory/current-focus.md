# Current Focus

_Last updated: 2026-05-27_

---

## Active Phase

**Frontend/Backend Sync Audit Fixes (2026-05-26) — COMPLETED ✅**  
All 10 P1 sync issues fixed. No P0 issues existed.

**Next priority: P3 — SEO + security hardening**

Key gaps identified this round:
- Admin mobile horizontal tab bar missing (Replit has it; migrated does not)
- Public Navbar regressed from `h-40` + tagline to `h-20` without tagline
- `PhotoUploadField` not migrated (blocks all image uploads)
- `use-image-upload.ts` still pointing at Replit GCS path
- Partial `SETTING_DEFAULTS` (missing `services_page`, `government_page`, `submit_page`, full `about`)
- `section_visibility` saved in admin but not consumed on public pages

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

## Last Edited Files (2026-05-26 — Sync Audit Fixes)

- `zafora-frontend/src/proxy.ts` (renamed function to `proxy`, kept `next/server` types — correct for Next.js 16.2.6)
- `zafora-frontend/src/modules/admin/content/components/BrandingManager.tsx` (fixed invalidation key)
- `zafora-frontend/src/modules/admin/content/components/AboutEditor.tsx` (fixed invalidation key)
- `zafora-frontend/src/modules/admin/content/components/TeamManager.tsx` (fixed invalidation key)
- `zafora-frontend/src/modules/admin/content/components/ImagesEditor.tsx` (fixed invalidation key)
- `zafora-frontend/src/modules/admin/content/components/SiteSettingsManager.tsx` (fixed invalidation keys x2)
- `zafora-frontend/src/modules/admin/content/components/NavigationManager.tsx` (added invalidateQueries on save)
- `zafora-frontend/src/modules/admin/content/services/site-settings.service.ts` (bust both admin+public caches on save)
- `zafora-frontend/src/modules/public/home/services/home.service.ts` (added useSectionVisibility + isSectionVisible)
- `zafora-frontend/src/app/(public)/page.tsx` (wired section visibility)
- `zafora-frontend/src/app/(public)/about/page.tsx` (wired section visibility)
- `zafora-frontend/src/app/(public)/services/page.tsx` (wired section visibility)
- `zafora-frontend/src/app/(public)/projects/page.tsx` (wired section visibility)
- `zafora-frontend/src/app/(public)/government/page.tsx` (wired section visibility)
- `zafora-frontend/src/app/(public)/submit/page.tsx` (wired section visibility)
- `zafora-backend/src/modules/content/content.service.ts` (added seo_submit, site_images, ogImage to SETTING_DEFAULTS)
- `zafora-frontend/src/modules/admin/settings/components/SettingsPanel.tsx` (clearTokens + redirect after password change)

## Last Edited Files (2026-05-26 — P0/P1/P2 Implementation)

- `zafora-frontend/src/modules/admin/shared/components/AdminMobileNav.tsx` (new — mobile scrollable pill nav)
- `zafora-frontend/src/components/layout/AdminShell.tsx` (wired AdminMobileNav)
- `zafora-frontend/src/modules/admin/shared/components/AdminHeader.tsx` (ROUTE_META extended — 5 new entries)
- `zafora-frontend/src/components/common/Navbar.tsx` (tagline added to branding, shown in header + mobile menu)
- `zafora-frontend/src/hooks/use-image-upload.ts` (fixed to use API.STORAGE.PRESIGN + new response shape)
- `zafora-frontend/src/modules/admin/shared/components/PhotoUploadField.tsx` (new — migrated from artifacts)
- `zafora-frontend/src/modules/admin/content/components/BrandingManager.tsx` (Logo/Favicon wired to PhotoUploadField)
- `zafora-frontend/src/modules/admin/content/components/TeamManager.tsx` (photo wired to PhotoUploadField)
- `zafora-frontend/src/modules/admin/content/components/ServicesManager.tsx` (imageUrl wired to PhotoUploadField)
- `zafora-frontend/src/modules/admin/content/components/TestimonialsManager.tsx` (photoUrl wired to PhotoUploadField)
- `zafora-frontend/src/modules/admin/projects/components/ProjectsTable.tsx` (imageUrl wired to PhotoUploadField)
- `zafora-backend/src/modules/content/content.service.ts` (SETTING_DEFAULTS: +services_page, +government_page, +submit_page, +seo_government, ogTitle/ogDescription on all SEO keys, full about.values/team/timeline/cta/whoWeAre)
- `zafora-frontend/src/lib/site-settings.ts` (new — getSectionVisibility() server helper)

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

## Last Edited Files (2026-05-27 — DB Seed Sync)

- `zafora-backend/scripts/seed.ts` — Services replaced (Government Advisory, Contracting & Procurement, Project Development, Funding Advisory, Project Management Support, Market Entry Consulting); Content Stats replaced with 4 entries (Pan-African/End-to-End/6/3); Methodology Steps replaced (Origination→Handover); Hero badge fixed to "Strategic Infrastructure & Consulting · Est. 2025"; siteSettingsTable added to delete list; onConflictDoNothing removed (clean delete+insert). Seed executed successfully against Neon DB.

## Last Edited Files (2026-05-27 — Replit Textual Sync)

- `zafora-frontend/src/app/(public)/page.tsx` — HERO_DEFAULTS badge/panelStat/panelStatLabel restored to Replit; FALLBACK_STATS reverted to Pan-African/End-to-End/6 sectors/3 pillars; hero panel indicator = "Open for Engagement" (gold dot); mini-card label = "Pipeline Status"; project list header = "Project Pipeline"; empty-state added to hero mini-list; Pipeline Preview badge/H2/desc/link reverted; empty-state added to pipeline section; About teaser H2 + 2 paragraphs reverted to Replit copy
- `zafora-frontend/src/app/(public)/about/page.tsx` — DEFAULTS fully reverted to Replit: teamHeadline/teamSubheadline, 4 team defaults, stats[1]="Africa · Americas Primary Markets", stats[2]="6 Core Practice Areas", whoWeAre (headline+3 paras+4 bullets), mvp (sectionSubheadline+mission+vision+purpose), timeline (all 4 events)
- `zafora-frontend/src/app/(public)/services/page.tsx` — stats reverted to 6/Pan-African/End-to-End/100%; hero pill #4 = "Senior advisors"
- `zafora-frontend/src/app/(public)/government/page.tsx` — stats reverted to Pan-African/End-to-End/100%/6; CTA btn2 = "View Pipeline"
- `zafora-frontend/src/app/(public)/submit/page.tsx` — sidebar bullet #5 = "Pan-African infrastructure focus"; stats card title = "What We Offer", rows = End-to-End/Pan-African/6 Sectors
- `zafora-frontend/src/app/(public)/projects/page.tsx` — filter empty state text corrected; genuine empty body expanded to 2 paragraphs + "Submit a Mandate" CTA button
- `zafora-frontend/src/components/layout/GlobalLayout.tsx` — Privacy Policy + Terms of Service links restored to footer bottom bar

## Last Edited Files (2026-05-27 — S3 Folder Structure)

- `zafora-backend/src/shared/constants/storage-folders.ts` (new — S3_FOLDERS enum + ALLOWED_S3_FOLDERS)
- `zafora-backend/src/modules/storage/storage.validator.ts` (folder: z.enum strict)
- `zafora-frontend/src/lib/constants/storage.ts` (new — STORAGE_FOLDER + StorageFolder)
- `zafora-frontend/src/lib/constants/index.ts` (exports STORAGE_FOLDER)
- `zafora-frontend/src/hooks/use-image-upload.ts` (folder required param)
- `zafora-frontend/src/modules/admin/shared/components/PhotoUploadField.tsx` (folder prop required)
- `zafora-frontend/src/modules/admin/content/components/BrandingManager.tsx` (BRANDING_LOGO + BRANDING_FAVICON)
- `zafora-frontend/src/modules/admin/content/components/TeamManager.tsx` (TEAM_PHOTOS)
- `zafora-frontend/src/modules/admin/content/components/ServicesManager.tsx` (SERVICES_IMAGES)
- `zafora-frontend/src/modules/admin/content/components/TestimonialsManager.tsx` (TESTIMONIALS_PHOTOS)
- `zafora-frontend/src/modules/admin/projects/components/ProjectsTable.tsx` (PROJECTS_IMAGES)
- `zafora-frontend/src/modules/admin/content/components/ImagesEditor.tsx` (SITE_IMAGES_HOME/SERVICES/GOVERNMENT)

## Last Edited Files (2026-05-28 — Backend Defaults Sync)

- `zafora-backend/src/modules/content/content.service.ts` — DEFAULT_STATS changed from numeric ($2.4B+/12+/95%) to qualitative (Pan-African/End-to-End/6/3); SETTING_DEFAULTS.about fully rewritten: whoWeAre (correct headline + 3 paras + 4 bullets), mvp (full Africa-anchored mission/vision/purpose), team (4 org-unit cards), timeline (4 events), values (6 correct titles + descs), cta (btn1/btn2 links)
- `zafora-backend/scripts/seed.ts` — about site_settings value rewritten: full hero/stats/identity/whoWeAre/mvp/values/team(4)/timeline/cta/teamHeadline/teamSubheadline/teamLayout
- `.cursor/rules/replit-update-code-to-sync.mdc` — populated with full change log, root cause analysis, data source map, and remaining gaps

**⚠️ ACTION REQUIRED: Run `npx tsx scripts/seed.ts` in `zafora-backend/` against the Neon production DB to replace stale rows. This will fix the live site's empty projects, wrong stats, and empty team section.**

## Next Actions (Priority Order — Updated 2026-05-27)

**P0 — Mobile regressions** ✅ DONE
**P1 — Public Navbar + Image upload pipeline** ✅ DONE
**P2 — Complete settings + section visibility** ✅ DONE

**R9 — Full QA Audit (2026-05-26)** ✅ COMPLETE — 5 fixes applied  

**P3 — SEO + verification**
9. **F13**: `generateMetadata()` on each public page, `sitemap.ts`, `robots.ts`.
10. **F12**: Add per-segment `loading.tsx` + `error.tsx` under `/admin/leads/`, `/admin/projects/`, etc.
11. **B9**: Add `helmet`, `express-rate-limit`, body size limits to `zafora-backend/src/app.ts`.
12. **R9**: End-to-end verification of all 43 admin/public checks.
13. **Cleanup**: Verify zero imports then delete deprecated `lib/api-client-react`, `lib/api-zod`, `lib/api-spec`, `lib/object-storage-web`, `lib/db`.

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
| Image uploads (F11) | `PhotoUploadField` ✅ migrated; S3 backend (B6) still ⏳ pending |
| AnnouncementBar in layout | `app/(public)/layout.tsx` | ✅ Done (wired) |
| site-settings.ts helper | `lib/site-settings.ts` | ✅ Created |
| Section visibility helper | `getSectionVisibility()` | ✅ Created — wire into RSC pages as needed |
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
