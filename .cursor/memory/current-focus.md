# Current Focus

_Last updated: 2026-05-25_

---

## Active Phase

**Replit Sync R1–R8 — COMPLETED ✅ (2026-05-25)**  
FAQs module, 5 new admin managers, 5 new public/admin pages, maintenance middleware, auth setup endpoints, seed extended.

**Next priority: Wire AnnouncementBar + lib/site-settings.ts → then F11/B6 (S3)**

---

## Last Completed Work (2026-05-25)

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

## Last Edited Files

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

1. **Wire AnnouncementBar**: Import `<AnnouncementBar />` into `app/(public)/layout.tsx` above `<Navbar />`
2. **Create `lib/site-settings.ts`**: Server helper `getSectionVisibility()` + use in public page RSCs
3. **B6**: `zafora-backend/src/shared/lib/object-storage.ts` → AWS S3 SDK presigned URL service
4. **F11**: `app/api/storage/presign/route.ts` → `hooks/use-s3-upload.ts` → `ImageUploader`
5. **R6/PhotoUploadField**: `modules/admin/shared/components/PhotoUploadField.tsx` (after F11)
6. **B7**: Wire Resend email — set `RESEND_API_KEY` in Railway, test `/api/notifications/test`
7. **F12**: Add `loading.tsx` + `error.tsx` to each individual admin route segment (leads, projects, documents, etc.)
8. **B9**: Add `helmet`, `express-rate-limit`, body size limits to `zafora-backend/src/app.ts`
9. **F13**: `generateMetadata()` on each public page, `sitemap.ts`, `robots.ts`
10. **Cleanup**: Verify zero imports then delete deprecated `lib/api-client-react`, `lib/api-zod`, `lib/api-spec`, `lib/object-storage-web`, `lib/db`

---

## Known Gaps (Found in 2026-05-25 Audit)

| Gap | File | Status |
|-----|------|--------|
| AnnouncementBar not in layout | `app/(public)/layout.tsx` | ⚠️ Needs wiring |
| site-settings.ts helper missing | `lib/site-settings.ts` | ⚠️ Not created |
| Section visibility not in public pages | All public RSC pages | ⚠️ Depends on site-settings.ts |
| PhotoUploadField missing | `modules/admin/shared/components/PhotoUploadField.tsx` | ⏳ Blocked on F11 |
| F12 per-segment loading | `/admin/leads/`, `/admin/projects/`, etc. | ⏳ Pending |
| B6 S3 storage | `shared/lib/object-storage.ts` | ⏳ Pending |
| B7 Resend email | `RESEND_API_KEY` empty in .env | ⏳ Pending |
| B9 Security (helmet, rate limit) | `src/app.ts` | ⏳ Pending |
| F13 SEO | generateMetadata, sitemap, robots | ⏳ Pending |

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
