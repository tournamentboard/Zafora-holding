# Current Focus

_Last updated: 2026-05-24_

---

## Active Phase

**Replit Sync (RR1–RR6) — HIGHEST PRIORITY**  
See `.cursor/rules/replit-update-code-to-sync.mdc` for full execution plan.

Then: **F11 (File Uploads) + B6 (AWS S3)**

---

## Last Completed Work (Today — 2026-05-24)

1. **F9-3**: Migrated all content managers to `modules/admin/content/components/`
   - SiteSettingsManager, BrandingManager, NavigationManager, TeamManager
   - AboutEditor, ImagesEditor, ServicesManager, TestimonialsManager
   - ContentStatsManager, MethodologyManager
   - Created `site-settings.service.ts` compatibility layer

2. **F10**: Created shared admin utilities
   - StatusBadge, TableToolbar, useDebouncedSearch, useTableFilters

3. **Cleanup**: Deleted all 16 legacy `components/admin/*.tsx` files

4. **Swagger**: Updated Lead status enum to match frontend values

5. **Seed**: Inserted realistic Zafora-relevant dummy data into Neon DB

6. **Cursor Rules**: Created full `.cursor/rules/` + `.cursor/memory/` architecture

---

## Last Edited Files

- `.cursor/rules/00-core.mdc` through `15-response-format.mdc` (new)
- `.cursor/memory/*.md` (new)
- `zafora-frontend/src/modules/admin/content/components/ContentPage.tsx` (new)
- `zafora-frontend/src/modules/admin/content/services/site-settings.service.ts` (new)
- `zafora-frontend/src/modules/admin/shared/components/StatusBadge.tsx` (new)
- `zafora-frontend/src/modules/admin/shared/components/TableToolbar.tsx` (new)
- `zafora-frontend/src/modules/admin/shared/hooks/useDebouncedSearch.ts` (new)
- `zafora-frontend/src/modules/admin/shared/hooks/useTableFilters.ts` (new)
- `zafora-backend/src/shared/lib/swagger.ts` (updated Lead status enum)
- `zafora-backend/scripts/seed.ts` (new — ran successfully)

---

## Next Actions (Priority Order)

1. **RR1**: Create `faqs` table + 4 endpoints + module structure
2. **RR2**: Add new SETTING_DEFAULTS (announcement_bar, maintenance_mode, legal_privacy, legal_terms, section_visibility)
3. **RR3**: Create 5 new admin manager components + sidebar entries + route pages
4. **RR4**: Create `/privacy`, `/terms`, `/maintenance` pages + AnnouncementBar + remove sticky header
5. **RR5**: Add auth setup-status / setup / reset-password endpoints
6. **RR6**: Seed FAQs + new site_settings entries
7. **B6**: `shared/lib/object-storage.ts` → AWS S3 SDK presigned URL service
8. **F11**: `app/api/storage/presign/route.ts` → `hooks/use-s3-upload.ts` → `ImageUploader`
9. **F12**: Add `loading.tsx` + `error.tsx` to each admin route segment
10. **B7**: Wire Resend email — `RESEND_API_KEY` must be set in Railway
11. **Cleanup**: Delete deprecated `lib/api-client-react`, `lib/api-zod`, etc. (verify zero imports first)

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| `useGetSiteSettings(key)` fetches single setting | Matches component usage pattern (one key per manager) |
| `useUpdateSiteSettings` takes `{ key, data: { value } }` | Preserves original Orval hook shape — no component rewrites needed |
| ContentPage uses `?section=` query param | Preserves URL state, works with Next.js App Router |
| Lead statuses: new/reviewed/contacted/qualified/proposal_sent/in_progress/closed/rejected | Frontend-defined; DB column is open text; swagger updated to match |
