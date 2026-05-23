I'll create a detailed phase-by-phase implementation guide with complete frontend and backend flows. Let me organize this clearly: 

Created memory file [](file:///c%3A/Users/MUHAMMAD%20ASIM/AppData/Roaming/Code/User/workspaceStorage/b7a833602ffb6c3d21b6fad6fc687d8b/GitHub.copilot-chat/memory-tool/memories/ZDliNmE2NmQtNGViMC00Y2ZmLWE3NDctMjhjYzk3ZjdkNDhm/implementation-guide.md)

Perfect. Here's your **complete phase-by-phase implementation flow** with detailed frontend + backend steps:

---

## 📋 COMPLETE IMPLEMENTATION FLOW

### **PHASE 1: SCAFFOLD & FOUNDATION** (2-4 days)
*Frontend & Backend in parallel*

#### Frontend Setup
```
1.1  Create Next.js 15 app
     └─ npx create-next-app@latest
     
1.2  Install dependencies
     ├─ @radix-ui/* (UI primitives)
     ├─ react-hook-form + zod (forms)
     ├─ @aws-sdk/client-s3 (S3)
     └─ sonner, lucide-react, recharts
     
1.3  Create folder structure
     ├─ app/(public)/ → public pages
     ├─ app/(admin)/ → admin pages  
     ├─ app/api/ → API routes
     ├─ app/lib/ → services, actions, hooks
     └─ app/components/ → UI & admin components
     
1.4  Setup TypeScript & Tailwind
     └─ tsconfig.json, tailwind.config.ts
     
1.5  Create .env.example with all vars
```

#### Backend Setup
```
1.6  Add Drizzle users + sessions tables
     ├─ new usersTable (id, email, hashedPassword, role)
     └─ new sessionsTable (id, token, userId, expiresAt)
     
1.7  Run Drizzle migrations
     ├─ npm run generate (create migration SQL)
     ├─ npm run migrate (apply to local DB)
     └─ drizzle-kit status (verify)
     
1.8  Setup Vercel
     ├─ vercel login
     ├─ vercel link (to GitHub repo)
     └─ Set env vars: DATABASE_URL, AWS_*, NEXT_PUBLIC_API_URL
     
1.9  Setup Neon PostgreSQL
     ├─ Create project at neon.tech
     ├─ Get DATABASE_URL
     └─ Run migrations: DATABASE_URL="..." npm run migrate
     
1.10 Setup AWS S3
     ├─ Create bucket: zaforaholding-uploads
     ├─ Create IAM user with S3 permissions
     ├─ Store AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
     └─ Configure CORS for presigned uploads
     
1.11 Create health check Route Handler
     └─ app/api/health/route.ts → returns DB connection status
```

**✅ End of Phase 1:** Frontend scaffolded, all databases configured, health check works

---

### **PHASE 2: PUBLIC SITE** (1-2 weeks)
*Frontend-heavy, Backend GET endpoints*

#### Frontend Implementation
```
2.1  Port UI components
     ├─ Copy artifacts/zafora/src/components/ui/* → app/components/ui/
     ├─ Setup shadcn component library
     └─ Test: buttons, cards, inputs, dialogs render
     
2.2  Create public page layout
     ├─ app/(public)/layout.tsx → wraps all public pages
     ├─ Navbar component
     └─ Footer component
     
2.3  Port public pages (file-based routing)
     ├─ app/(public)/page.tsx (Home)
     ├─ app/(public)/about/page.tsx
     ├─ app/(public)/services/page.tsx
     ├─ app/(public)/projects/page.tsx
     ├─ app/(public)/government/page.tsx
     └─ app/(public)/submit/page.tsx
     
2.4  Create Zod validators
     ├─ app/lib/validators/lead.ts
     ├─ app/lib/validators/project.ts
     ├─ app/lib/validators/auth.ts
     └─ app/lib/validators/content.ts
     
2.5  Create public services (fetch from backend)
     └─ app/lib/services/public.ts
         ├─ getSiteSettings()
         ├─ listProjects()
         ├─ listServices()
         ├─ getTestimonials()
         ├─ getContentStats()
         └─ getMethodologySteps()
     
2.6  Replace SEO with generateMetadata()
     └─ Each page.tsx exports async generateMetadata()
         ├─ Fetch siteSettings from backend
         └─ Return: { title, description, ogImage }
     
2.7  Create public Server Actions
     └─ app/lib/actions/public.ts
         ├─ submitLead(formData)
         ├─ expressInterest(projectId, formData)
         └─ Rate limiting per endpoint
     
2.8  Create form components
     ├─ app/components/forms/SubmitLeadForm.tsx
     ├─ app/components/forms/ExpressInterestModal.tsx
     └─ Wire to Server Actions + loading states
     
2.9  Replace React Query with Server Components
     ├─ Remove useListProjects, useGetSiteSettings, etc.
     ├─ Move all data fetching to Server Components
     └─ Keep client-side state only for UI (modals, filters)
```

#### Backend Implementation
```
2.10 Create public GET routes
     └─ artifacts/api-server/src/routes/content.ts
         ├─ GET /api/content/site-settings
         ├─ GET /api/content/stats
         ├─ GET /api/content/methodology
         ├─ GET /api/content/testimonials
         ├─ GET /api/content/services
         └─ GET /api/projects (list only)
     
2.11 Create public POST routes (Forms)
     └─ artifacts/api-server/src/routes/leads.ts
         ├─ POST /api/leads (submitLead)
         │  ├─ Validate with Zod
         │  ├─ Insert to DB
         │  ├─ Log action (fire-and-forget)
         │  └─ Send email (fire-and-forget)
         └─ POST /api/projects/:id/interests (expressInterest)
            ├─ Validate
            ├─ Insert project_interests
            └─ Email notification
     
2.12 Wire up in Express app.ts
     ├─ Import routes
     ├─ Register: app.use("/api/content", contentRoutes)
     ├─ Register: app.use("/api/leads", leadsRoutes)
     └─ Register: app.use("/api/projects", projectsRoutes)
```

**✅ End of Phase 2:** All public pages live, forms submit to backend, data fetching from Neon

---

### **PHASE 3: ADMIN PANEL** (1-2 weeks)
*Frontend + Backend auth + CRUD*

#### Frontend Implementation
```
3.1  Create auth helpers
     └─ app/lib/auth.ts
         ├─ loginUser(email, password)
         ├─ verifySession()
         ├─ logoutUser()
         └─ requireAdmin() → throws if not authenticated
     
3.2  Add middleware for /admin protection
     └─ middleware.ts (app root)
         ├─ Check /admin/* routes
         ├─ If no sessionId cookie → redirect to /admin/login
         └─ Export config matcher
     
3.3  Create login page
     └─ app/(admin)/login/page.tsx
         ├─ Email + password form
         ├─ Call loginUser() Server Action on submit
         ├─ Redirect to /admin on success
         └─ Toast on error
     
3.4  Create admin layout
     └─ app/(admin)/layout.tsx
         ├─ requireAdmin() check
         ├─ Render sidebar + header
         └─ Redirect to /admin/login if not authenticated
     
3.5  Split monolithic Admin.tsx into routes
     ├─ app/(admin)/page.tsx (dashboard with stats)
     ├─ app/(admin)/leads/page.tsx
     ├─ app/(admin)/projects/page.tsx
     ├─ app/(admin)/documents/page.tsx
     ├─ app/(admin)/content/page.tsx (site-settings)
     ├─ app/(admin)/content/services/page.tsx
     ├─ app/(admin)/content/testimonials/page.tsx
     ├─ app/(admin)/content/methodology/page.tsx
     ├─ app/(admin)/content/team/page.tsx
     ├─ app/(admin)/content/branding/page.tsx
     ├─ app/(admin)/audit/page.tsx
     └─ app/(admin)/settings/page.tsx
     
3.6  Create Server Actions for all CRUD
     └─ app/lib/actions/admin.ts
         ├─ createLead, updateLead, deleteLead
         ├─ createProject, updateProject, deleteProject
         ├─ createService, updateService, deleteService
         ├─ createDocument, updateDocument, deleteDocument
         ├─ updateSiteSettings, updateBranding, etc.
         ├─ createTestimonial, updateTestimonial, deleteTestimonial
         ├─ createMethodologyStep, etc.
         └─ Each:
            ├─ Calls requireAdmin() first
            ├─ Validates input with Zod
            ├─ Calls Express backend POST/PATCH/DELETE
            ├─ Returns result or throws
            └─ Revalidates cache: revalidatePath()
     
3.7  Create admin forms with shadcn/form
     ├─ app/components/admin/LeadsTable.tsx
     │  ├─ Display all leads in table
     │  ├─ Edit button → EditLeadModal
     │  └─ Delete button → calls deleteLead
     ├─ app/components/admin/EditLeadForm.tsx
     │  ├─ Form with react-hook-form + Zod
     │  ├─ Pre-fill with lead data
     │  ├─ Submit calls updateLead() Server Action
     │  └─ useFormStatus() for button state
     └─ [Repeat for Projects, Documents, Services, etc.]
     
3.8  Create S3 presigned URL API route
     └─ app/api/storage/presign/route.ts
         ├─ Authenticate (requireAdmin)
         ├─ Generate unique S3 key: uploads/{timestamp}-{filename}
         ├─ Create PutObjectCommand presigned URL
         ├─ Return { uploadUrl, key, publicUrl }
         └─ TTL: 1 hour
     
3.9  Create S3 upload hook
     └─ app/lib/hooks/use-s3-upload.ts
         ├─ upload(file: File)
         ├─ GET presigned URL from /api/storage/presign
         ├─ PUT file directly to S3 (client-side)
         └─ Return { publicUrl }
     
3.10 Create image upload components
     ├─ app/components/admin/ImageUploader.tsx
     │  ├─ File input
     │  ├─ Call useS3Upload()
     │  ├─ Display preview
     │  └─ Return publicUrl to parent form
     └─ Import in all admin pages that need images
     
3.11 Create audit logging action
     └─ app/lib/actions/admin.ts (add to file)
         ├─ logAction(action, category, description, metadata)
         ├─ Call requireAdmin()
         ├─ Call Express backend POST /api/audit
         └─ Fire-and-forget
```

#### Backend Implementation
```
3.12 Create auth endpoints
     └─ artifacts/api-server/src/routes/adminAuth.ts
         ├─ POST /api/auth/login
         │  ├─ Validate email + password
         │  ├─ Find user in DB
         │  ├─ bcrypt.compare(password, user.hashedPassword)
         │  ├─ Generate random token
         │  ├─ Insert into sessions table
         │  ├─ Set httpOnly cookie: sessionId=token
         │  └─ Return { id, email, role }
         ├─ GET /api/auth/verify
         │  ├─ Get sessionId cookie
         │  ├─ Find session in DB (check expiry)
         │  ├─ Return user info if valid
         │  └─ 401 if invalid/expired
         ├─ POST /api/auth/logout
         │  ├─ Clear sessionId cookie
         │  └─ Return { success }
         └─ POST /api/auth/change-password
            ├─ Verify session
            ├─ bcrypt.compare(currentPassword, user.hashedPassword)
            ├─ bcrypt.hash(newPassword) → store
            └─ Return { success }
     
3.13 Create auth middleware (for protected routes)
     └─ artifacts/api-server/src/middleware/requireAuth.ts
         ├─ Extract sessionId cookie
         ├─ Find session in DB
         ├─ Check expiry
         ├─ Attach req.user = { userId }
         ├─ Call next()
         └─ Or return 401
     
3.14 Create admin CRUD routes (protected with requireAuth)
     └─ artifacts/api-server/src/routes/leads.ts
         ├─ GET /api/leads [protected]
         │  ├─ requireAuth middleware
         │  └─ Return all leads
         ├─ GET /api/leads/:id [protected]
         │  └─ Return single lead
         ├─ POST /api/leads [public] (form submission, already done)
         ├─ PATCH /api/leads/:id [protected]
         │  ├─ requireAuth
         │  ├─ Update in DB
         │  ├─ Log action
         │  └─ Return updated lead
         └─ DELETE /api/leads/:id [protected]
            ├─ requireAuth
            ├─ Delete from DB
            ├─ Log action
            └─ Return { success }
     
3.15 Repeat 3.14 for all CRUD resources
     ├─ artifacts/api-server/src/routes/projects.ts
     ├─ artifacts/api-server/src/routes/documents.ts
     ├─ artifacts/api-server/src/routes/services.ts
     ├─ artifacts/api-server/src/routes/testimonials.ts
     ├─ artifacts/api-server/src/routes/content.ts (settings, branding)
     └─ artifacts/api-server/src/routes/audit.ts (log retrieval)
     
3.16 Wire up in Express app.ts
     ├─ import { requireAuth } from "@/middleware/requireAuth"
     ├─ app.use("/api/auth", adminAuthRoutes)
     ├─ app.use("/api/leads", leadsRoutes)
     ├─ app.use("/api/projects", projectsRoutes)
     ├─ app.use("/api/documents", documentsRoutes)
     ├─ app.use("/api/services", servicesRoutes)
     ├─ app.use("/api/testimonials", testimonialsRoutes)
     ├─ app.use("/api/content", contentRoutes)
     └─ app.use("/api/audit", auditRoutes)
```

**✅ End of Phase 3:** Admin fully functional, auth works, all CRUD works, S3 uploads work

---

### **PHASE 4: BACKEND SECURITY & MIGRATION** (3-5 days)
*Backend only, can run in parallel with Phases 2-3*

#### Backend Implementation
```
4.1  Replace Replit GCS with AWS S3
     └─ artifacts/api-server/src/lib/objectStorage.ts (REWRITE)
         ├─ Remove: REPLIT_SIDECAR_ENDPOINT
         ├─ Remove: @google-cloud/storage client
         ├─ Add: @aws-sdk/client-s3
         ├─ Create S3Client with AWS_REGION
         ├─ getObjectEntityUploadURL()
         │  ├─ CreatePutObjectCommand presigned URL
         │  └─ Return signed URL
         ├─ downloadObject(key)
         │  └─ Return GetObject presigned URL
         └─ deleteObject(key)
            └─ DeleteObjectCommand
     
4.2  Update dependencies
     └─ artifacts/api-server/package.json
         ├─ npm install @aws-sdk/client-s3
         ├─ npm install @aws-sdk/s3-request-presigner
         ├─ npm install bcrypt @types/bcrypt
         ├─ npm uninstall @google-cloud/storage
         └─ npm uninstall google-auth-library
     
4.3  Extract business logic to services
     └─ artifacts/api-server/src/lib/services/
         ├─ leads.ts
         │  ├─ createLead(data)
         │  ├─ updateLead(id, data)
         │  ├─ deleteLead(id)
         │  └─ listLeads()
         ├─ projects.ts
         │  ├─ createProject(data)
         │  ├─ updateProject(id, data)
         │  ├─ deleteProject(id)
         │  └─ listProjects()
         └─ [Repeat for all resources]
     
4.4  Update routes to call services
     ├─ artifacts/api-server/src/routes/leads.ts
     │  ├─ POST /api/leads → leadsService.createLead()
     │  ├─ PATCH /api/leads/:id → leadsService.updateLead()
         ├─ DELETE /api/leads/:id → leadsService.deleteLead()
     │  └─ GET /api/leads → leadsService.listLeads()
     └─ [Repeat for all routes]
     
4.5  Create password migration script
     └─ scripts/migrate-passwords.ts
         ├─ Read admin_password from site_settings
         ├─ bcrypt.hash(plainPassword, 10)
         ├─ Insert into users table with email
         ├─ Run: DATABASE_URL="neon-url" ts-node scripts/migrate-passwords.ts
         └─ Verify: SELECT * FROM users; (user created)
     
4.6  Update Express app.ts
     ├─ Add: SESSION_SECRET validation (throw if missing)
     ├─ Add: NODE_ENV check (production-only features)
     ├─ Add: CORS configuration (allow zaforaholding.com)
     └─ Add: Error handling middleware
     
4.7  Deploy Express to Railway
     ├─ cd artifacts/api-server
     ├─ railway init (create Railway project)
     ├─ railway env add DATABASE_URL=neon-url
     ├─ railway env add AWS_REGION=us-east-1
     ├─ railway env add AWS_BUCKET_NAME=zaforaholding-uploads
     ├─ railway env add AWS_ACCESS_KEY_ID=***
     ├─ railway env add AWS_SECRET_ACCESS_KEY=***
     ├─ railway env add SESSION_SECRET=your-secret
     ├─ railway env add NODE_ENV=production
     ├─ railway env add RESEND_API_KEY=***
     ├─ railway up (deploy)
     └─ railway logs (verify: "Server running on port 8080")
     
4.8  Get Railway API domain
     ├─ railway status
     ├─ Copy API URL: https://api-xxxxx.railway.app
     └─ Update NEXT_PUBLIC_API_URL in Vercel env
     
4.9  Test all endpoints
     ├─ curl https://api-xxxxx.railway.app/healthz
     ├─ curl -X POST https://api-xxxxx.railway.app/api/auth/login \
          -H "Content-Type: application/json" \
          -d '{"email":"admin@zaforaholding.com","password":"..."}'
     ├─ curl -X GET https://api-xxxxx.railway.app/api/leads \
          -H "Cookie: sessionId=<token>"
     └─ curl -X POST https://api-xxxxx.railway.app/api/leads \
          -H "Content-Type: application/json" \
          -d '{"fullName":"Test","email":"test@test.com",...}'
```

**✅ End of Phase 4:** Express backend on Railway, all security fixes in place, S3 working

---

### **PHASE 5: CUTOVER & CLEANUP** (3-5 days)
*Frontend + Backend + Final*

```
5.1  Remove Replit dependencies
     ├─ artifacts/zafora/package.json
     │  ├─ npm uninstall @replit/vite-plugin-cartographer
     │  ├─ npm uninstall @replit/vite-plugin-dev-banner
     │  └─ npm uninstall @replit/vite-plugin-runtime-error-modal
     ├─ Root pnpm-workspace.yaml
     │  └─ Delete Replit overrides section
     └─ artifacts/api-server/package.json
        └─ Verify: no @replit/* packages
     
5.2  Remove old files & configs
     ├─ rm .replit
     ├─ rm attached_assets -rf
     ├─ rm artifacts/mockup-sandbox -rf
     ├─ rm lib/api-spec -rf
     ├─ rm lib/api-client-react -rf
     ├─ rm artifacts/zafora -rf (old Vite app)
     ├─ rm vercel.json (old config)
     └─ rm netlify.toml (not used)
     
5.3  Remove Orval/OpenAPI
     ├─ Root package.json
     │  └─ Delete codegen script
     ├─ lib/api-zod/src/
     │  └─ Copy schemas to zafora-nextjs/app/lib/validators/
     └─ Update imports: no more useListLeads, useCreateProject, etc.
     
5.4  Create CI/CD workflow
     └─ .github/workflows/lint.yml
         ├─ on: [push, pull_request]
         ├─ jobs:
         │  └─ lint:
         │     ├─ runs-on: ubuntu-latest
         │     ├─ pnpm install
         │     ├─ pnpm run typecheck
         │     └─ pnpm run lint
         └─ Vercel auto-deploys on push to main
     
5.5  Update root README.md
     ├─ Architecture: Next.js (Vercel) + Express (Railway) + Neon + S3
     ├─ Local dev: pnpm dev (runs both)
     ├─ Environment: .env.local based on .env.example
     ├─ Database: npm run migrate (from lib/db)
     ├─ Deployment: Vercel (auto) + Railway (auto)
     └─ Monitoring: Vercel logs + Railway logs + Sentry
     
5.6  Final smoke tests
     ├─ Public site
     │  ├─ curl https://zaforaholding.com
     │  ├─ curl https://zaforaholding.com/about
     │  ├─ curl https://zaforaholding.com/submit
     │  └─ Form submission → email received
     ├─ Admin
     │  ├─ curl -X POST https://api.railway.app/api/auth/login
     │  ├─ Login works, sessionId cookie set
     │  ├─ /admin pages render, all CRUD works
     │  └─ Image upload to S3 works
     ├─ Database
     │  ├─ Neon has all data (migrated from Replit)
     │  ├─ users table has admin user (bcrypt password)
     │  └─ sessions table tracks logins
     └─ Logs
         ├─ Vercel: no errors, all pages render
         ├─ Railway: all routes respond, no 500 errors
         └─ CloudWatch: S3 uploads logged
     
5.7  DNS & SSL
     ├─ Point zaforaholding.com → Vercel (CNAME)
     ├─ Vercel auto-provisions SSL certificate
     ├─ Test: https://zaforaholding.com (green lock)
     └─ Verify: SSLLabs score A+
     
5.8  Cut traffic from old Replit
     ├─ Verify production is fully working
     ├─ Monitor for 24 hours (no errors)
     ├─ Delete Replit deployment
     └─ Done! 🎉
```

**✅ End of Phase 5:** Production live, all Replit code removed, fully scalable SaaS

---

## 🔄 How Frontend & Backend Work Together

```
USER FLOW: Submit Lead on Public Page
═══════════════════════════════════════

1. User fills form on https://zaforaholding.com/submit
   └─ <SubmitLeadForm> (Client Component)

2. User clicks "Submit"
   └─ Calls submitLead() Server Action

3. Server Action runs on Vercel
   ├─ Validate with Zod schema
   ├─ Rate limit check
   └─ POST to https://api.railway.app/api/leads

4. Express backend receives request
   ├─ leadsService.createLead(data)
   ├─ Insert to Neon PostgreSQL
   ├─ Log action (audit trail)
   └─ Send email via Resend

5. Response returned to frontend
   ├─ Success: revalidatePath("/submit"), show toast
   └─ Error: show error toast

═══════════════════════════════════════

ADMIN FLOW: Update Project in Admin Panel
═══════════════════════════════════════════

1. Admin logs in at https://zaforaholding.com/admin/login
   ├─ Email + password form
   └─ Calls loginUser() Server Action

2. Server Action calls Express backend
   ├─ POST https://api.railway.app/api/auth/login
   ├─ Backend: bcrypt.compare(password, hashed)
   ├─ Backend: generate random token
   ├─ Backend: insert into sessions table (Neon)
   └─ Backend: Set httpOnly cookie

3. Cookie returned to Next.js
   ├─ Browser stores sessionId cookie
   └─ Redirect to /admin

4. Admin clicks Edit on a project
   └─ <EditProjectModal> opens with form

5. Admin changes fields, clicks Save
   ├─ Calls updateProject() Server Action
   ├─ Server Action validates with Zod
   └─ POST to https://api.railway.app/api/projects/:id

6. Express backend receives request
   ├─ requireAuth middleware checks sessionId cookie
   ├─ Verify session in Neon DB (not expired)
   ├─ projectsService.updateProject(id, data)
   ├─ Update in Neon
   ├─ Log action
   └─ Return updated project

7. Response returned to frontend
   ├─ Success: revalidatePath("/admin/projects")
   ├─ UI updates automatically
   └─ Show success toast

═══════════════════════════════════════

IMAGE UPLOAD FLOW: Admin uploads to S3
═══════════════════════════════════════

1. Admin selects image in <ImageUploader>
   └─ Client component

2. useS3Upload() hook runs
   ├─ POST /api/storage/presign
   ├─ Neon: check sessionId cookie via middleware

3. Vercel Route Handler generates presigned URL
   ├─ AWS SDK: GetSignedUrl(PutObjectCommand)
   ├─ Returns: { uploadUrl, key, publicUrl }
   └─ TTL: 1 hour

4. Browser PUT file directly to S3
   ├─ No data passes through Vercel/Railway
   ├─ S3 receives file directly
   └─ Speed: direct upload, no bottleneck

5. Upload completes
   ├─ Hook returns { publicUrl }
   ├─ Component stores URL in form state
   └─ Form submission includes publicUrl

6. Admin submits form (e.g., update project)
   ├─ Server Action: updateProject({ imageUrl: publicUrl })
   └─ Backend stores publicUrl in Neon

═══════════════════════════════════════
```

---

## 📊 Technology Stack Summary

| Layer | Technology | Hosting | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js 15 (App Router) | Vercel | Public pages + admin UI |
| **Backend** | Express 5 + Node 22 | Railway | JSON API endpoints |
| **Database** | PostgreSQL + Drizzle ORM | Neon | Data store |
| **Storage** | AWS S3 | AWS | File uploads |
| **Email** | Resend | Resend | Transactional email |
| **Auth** | Custom (bcrypt + sessions) | Neon | Password hashing + session tokens |
| **Forms** | React Hook Form + Zod | Vercel | Validation |
| **UI** | Tailwind + shadcn + Radix | Vercel | Component library |
| **Monitoring** | Vercel Logs + Railway Logs | Both | Observability |

---

## ⏱️ Timeline

| Phase | Duration | Status | Blocker |
|-------|----------|--------|---------|
| **Phase 1** | 2-4 days | Sequential | None |
| **Phase 2** | 7-14 days | Parallel with 3,4 | Phase 1 ✓ |
| **Phase 3** | 7-14 days | Parallel with 2,4 | Phase 1 ✓, Phase 4 auth ✓ |
| **Phase 4** | 3-5 days | Parallel with 2,3 | Can start immediately |
| **Phase 5** | 3-5 days | Sequential | Phases 1,2,3,4 ✓ |
| **Total** | **10-14 days** | 1-2 weeks | Parallel execution |

**Critical path:** Phase 1 → {2,3,4} in parallel → Phase 5

---

This is your **complete roadmap**. Ready to start Phase 1 (Scaffold)?