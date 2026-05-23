Perfect. Here's your comprehensive Zafora Migration Plan:

Plan: Zafora Replit → Next.js + Express SaaS Migration
TL;DR: Migrate your Replit monolith to production SaaS in 1-2 weeks. Stack: Next.js 15 on Vercel (public + admin UI) + Express on Railway (/api endpoints) + Neon PostgreSQL + AWS S3 storage. Keep Express auth logic, eliminate all Replit code, add bcrypt password hashing and persistent sessions.

Architecture
Steps (5 Phases, can run in parallel)
Phase 1: Scaffold & Foundation (2–4 days)
Create Next.js 15 app (App Router, TypeScript, Tailwind)
Create Neon PostgreSQL, link to Vercel env
Create AWS S3 bucket, IAM user, store credentials in Vercel env
Migrate Drizzle schema to Neon; add users + sessions tables
Create health check Route Handler, deploy to Vercel
Document environment variables in .env.example
Phase 2: Public Site (1–2 weeks, after Phase 1)
Port Radix/shadcn UI components to app/components/ui/
Create file-based routes for 7 public pages: Home, About, Services, Projects, Government, Submit
Implement Server Components to fetch public data (getSiteSettings, listProjects, etc.)
Replace SEO hack with generateMetadata() per route
Port public forms (Submit Lead, Express Interest) as Server Actions + Zod
Remove React Query from public pages; use Server Components + fetch
Phase 3: Admin Panel (1–2 weeks, parallel with Phase 2)
Add middleware.ts to protect /admin routes, redirect to /admin/login
Create app/lib/auth.ts helpers to call Express backend /api/auth/login, /api/auth/verify
Port monolithic Admin.tsx into route structure:
/admin → dashboard
/admin/leads, /admin/projects, /admin/documents
/admin/content/* (site-settings, services, testimonials, methodology, team, branding)
/admin/audit, /admin/settings
Create Server Actions for CRUD (createLead, updateProject, deleteService, etc.)
Wire admin forms to Server Actions + useFormStatus() for loading states
Implement S3 presigned URL endpoint at app/api/storage/presign + useS3Upload() hook
Port admin image galleries to use new S3 hook
Add audit logging + Resend email notifications
Phase 4: Backend Migration (3–5 days, can start immediately)
Fix security: Add bcrypt password hashing to Express /api/auth/login + /api/auth/change-password
Create sessions table in DB (or use JWT)
Add middleware requireAuth to all admin routes
Replace Replit GCS with AWS S3 in lib/objectStorage.ts (remove sidecar endpoint 127.0.0.1:1106)
Extract route logic into lib/services/ (leads.ts, projects.ts, etc.)
Run Drizzle migrations: cd lib/db && npm run migrate (against Neon)
Deploy Express backend to Railway, link to Neon, add AWS env vars
Run migration script: Hash existing admin password, create users table entry, test login
Verify all Express endpoints work, update NEXT_PUBLIC_API_URL in Vercel env
Phase 5: Cutover & Cleanup (3–5 days, after all phases complete)
Remove all Replit dependencies (@replit/* packages), delete .replit file
Remove Orval/OpenAPI pipeline: delete api-spec, api-client-react, replace with hand-written Zod schemas
Add GitHub Actions CI/CD: lint + typecheck on PR
Clean up old configs: delete vercel.json, netlify.toml; update README.md with new architecture
Final smoke tests: All pages load, forms submit, admin CRUD works, S3 uploads work, emails send
Cut DNS to Vercel (zaforaholding.com → Vercel), verify SSL, monitor for errors
Relevant Files
New (Create)
app/ — entire Next.js app directory
app/lib/auth.ts — auth helpers
app/lib/services/*.ts — business logic (getSiteSettings, createLead, updateProject, etc.)
app/lib/actions/*.ts — Server Actions (submitLead, updateLead, etc.)
app/lib/validators/ — Zod schemas
app/api/health/route.ts, app/api/storage/presign/route.ts
app/(public)/ — public page routes
app/(admin)/ — admin routes with nested pages
middleware.ts — auth guard for /admin
.env.example, .github/workflows/lint.yml
Modify (Backend)
objectStorage.ts — remove sidecar, use AWS SDK
adminAuth.ts — add bcrypt hashing
app.ts — replace express-session with DB tokens
package.json — swap @google-cloud/storage → @aws-sdk/client-s3, add bcrypt
index.ts — add users + sessions tables
Delete
api-server (only after backend lives on Railway)
.replit, pnpm-workspace.yaml Replit overrides section
api-spec, api-client-react
mockup-sandbox, attached_assets
Verification Checklist
Phase 1: Next.js app runs locally, Vercel deploys, Neon accessible, health check responds, S3 bucket exists
Phase 2: Public pages render, forms submit, SEO metadata in HTML, Lighthouse 80+
Phase 3: Login works, admin pages protected, CRUD forms work, S3 uploads work, audit logs record
Phase 4: Express runs on Railway, password hashing works, all endpoints callable, Neon has data
Phase 5: zaforaholding.com resolves, SSL valid, all Replit refs removed, CI/CD passes, production ready

Key Decisions Made
Decision	Why	Alternative
Keep Express separate	Backend owns auth logic, testable, reusable for mobile	Merge into Next.js (more work, later)
AWS S3	Industry standard, integrations, acceptable cost	R2: cheaper but less tooling
Neon	Serverless, pooler included, free tier, Vercel integration	RDS: enterprise overhead
Railway for Express	Managed Node.js, simple ops, DATABASE_URL pooler	Vercel Functions: cold starts; Docker: ops overhead
Bcrypt passwords	Industry standard, salt + slow hash	Plaintext: ⚠️ unacceptable
Server Actions for forms	Simpler than React Query, less code	React Query: overkill for v1
Critical Gaps You Had (Now Addressed)
❌ Plain text passwords → ✅ bcrypt hashing in Phase 4
❌ No users table → ✅ Create in Phase 1 (step 4)
❌ No sessions table → ✅ Create in Phase 1 (step 4) or use JWT
❌ In-memory express-session → ✅ DB-backed tokens in Phase 4
❌ Replit GCS hardcoded sidecar → ✅ AWS S3 in Phase 4
❌ UI-only auth validation → ✅ Middleware + Server Actions in Phases 3–4
❌ Orval code generation → ✅ Remove in Phase 5, use Zod
Timeline
Phase	Days	Parallel?
Phase 1	2–4	N/A (blocking)
Phase 2	7–14	✅ Yes (with 3 & 4)
Phase 3	7–14	✅ Yes (with 2 & 4)
Phase 4	3–5	✅ Yes (with 2 & 3)
Phase 5	3–5	❌ No (after all)
Total	10–14 days	Realistic with parallel work
Critical path: Phase 1 → {Phase 2, 3, 4 in parallel} → Phase 5

Further Clarifications
Express backend location: Confirmed Railway. Does it need horizontal scaling? (Configure Neon pooler if yes.)
Admin user model: Currently you have one password in DB. After bcrypt migration, you'll have a users table. Plan for multiple admins later, or stick with single user for v1?
Audit logs: Exist in DB but not strongly versioned. Acceptable for v1?
Soft deletes: Not planned. Hard deletes only for v1? (Add soft-delete timestamps later if needed.)
Ready to Proceed?
This plan covers:

✅ All Replit removal
✅ Full SaaS architecture (Next.js + Express + Neon + S3)
✅ Backend-driven auth (no NextAuth)
✅ Security fixes (bcrypt, middleware, persistent sessions)
✅ 1–2 week timeline (with parallel execution)
✅ Production readiness (CI/CD, DNS, SSL, monitoring points)
Questions before implementation? Any adjustments needed, or shall we proceed to Phase 1 (scaffold)?

