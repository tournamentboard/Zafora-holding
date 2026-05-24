# Current Focus

_Last updated: 2026-05-24_

---

## Active Phase

**None — all F1–F10, B1–B5 complete.**  
Next recommended: **F11 (File Uploads) + B6 (AWS S3)**

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

1. **B6**: `shared/lib/object-storage.ts` → AWS S3 SDK presigned URL service
2. **F11**: `app/api/storage/presign/route.ts` → `hooks/use-s3-upload.ts` → `ImageUploader`
3. **F12**: Add `loading.tsx` + `error.tsx` to each admin route segment
4. **B7**: Wire Resend email — `RESEND_API_KEY` must be set in Railway
5. **Cleanup**: Delete deprecated `lib/api-client-react`, `lib/api-zod`, etc. (verify zero imports first)

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| `useGetSiteSettings(key)` fetches single setting | Matches component usage pattern (one key per manager) |
| `useUpdateSiteSettings` takes `{ key, data: { value } }` | Preserves original Orval hook shape — no component rewrites needed |
| ContentPage uses `?section=` query param | Preserves URL state, works with Next.js App Router |
| Lead statuses: new/reviewed/contacted/qualified/proposal_sent/in_progress/closed/rejected | Frontend-defined; DB column is open text; swagger updated to match |
