# Architecture Reference

_Last updated: 2026-05-24_

---

## System Overview

```
Browser
  │
  ├── Next.js 16 App Router (Vercel)
  │     ├── (public)/ — SSR/RSC public site
  │     ├── (admin)/ — authenticated CMS (JWT cookie required)
  │     └── app/api/ — BFF Route Handlers (presign, health)
  │
  │  apiAxios (client) / apiClient (server) via NEXT_PUBLIC_API_URL
  │
  └── Express 5 (Railway)
        ├── /api/auth/*
        ├── /api/leads, projects, documents, services, content, testimonials
        ├── /api/stats, audit, notifications, storage
        └── Drizzle ORM → Neon PostgreSQL
```

## Environment Variables

### Frontend (`zafora-frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000   # Railway URL in production
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

### Backend (`zafora-backend/.env`)
```
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://...@...neon.tech/zafora?sslmode=require
JWT_ACCESS_SECRET=dev-access-secret-change-in-production-min-32chars
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-min-32chars
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
ADMIN_EMAIL=admin@zaforaholding.com
ADMIN_PASSWORD=zafora2024
```

## Auth Flow

```
1. POST /api/auth/login
   → validates email+password (bcrypt)
   → sets access_token cookie (15min, httpOnly)
   → sets refresh_token cookie (7d, httpOnly)

2. Protected request with access_token
   → requireAuth middleware validates JWT
   → attaches req.user

3. access_token expired → apiAxios interceptor:
   → POST /api/auth/refresh
   → new access_token cookie set
   → original request retried

4. refresh_token expired:
   → 401 → redirect to /login
```

## Data Flow — Admin CRUD

```
AdminPage (page.tsx thin)
  └── ModuleComponent (modules/admin/*/components/)
        ├── useQuery hook (TanStack Query + apiAxios)
        │     └── GET /api/[resource] → service fn → Drizzle → Neon
        └── useMutation hook
              └── PATCH /api/[resource]/:id → service fn → logAction() → Drizzle
```

## Data Flow — Public Form Submission

```
PublicForm ("use client" island)
  └── Server Action (lib/actions/public.ts)
        ├── requireAdmin() — NOT called (public action)
        ├── Zod validation
        ├── apiClient.post(API.LEADS.LIST, data)
        │     └── POST /api/leads → createLead() → sendInquiryNotification() → logAction()
        └── revalidatePath("/")
```

## Database Schema

| Table | Key Columns |
|-------|------------|
| `users` | id, email, password_hash, role |
| `sessions` | id, user_id, token, expires_at |
| `leads` | id, full_name, organization, email, status, request_type |
| `projects` | id, name, sector, country, funding_status, interest_count |
| `project_interests` | id, project_id, full_name, email, role_type |
| `documents` | id, title, document_type, visibility, file_url |
| `services` | id, name, icon, description, bullets[], display_order |
| `content_stats` | id, label, value, suffix, display_order |
| `methodology_steps` | id, step_number, title, description, display_order |
| `site_settings` | id, key (unique), value (JSON string) |
| `testimonials` | id, name, company, role, quote, display_order |
| `audit_logs` | id, action, category, description, detail, performed_at |

## Site Settings Keys

| Key | Content |
|-----|---------|
| `hero` | headline, subheadline, ctaLabel, ctaLink |
| `footer` | tagline, address, email, phone, linkedinUrl |
| `branding` | primaryColor, accentColor, logoText, tagline |
| `navigation` | JSON array of NavItem[] |
| `seo_home` | title, description, keywords |
| `seo_projects` | title, description, keywords |
| `seo_about` | title, description, keywords |
| `about` | rich about page content |
| `images` | logo, hero image, etc. |

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | Vercel | Auto-deploy from main branch |
| Backend | Railway | `npm run build && npm start` |
| Database | Neon | Serverless PostgreSQL (pooled) |
| Email | Resend | RESEND_API_KEY in Railway env |
| Storage | AWS S3 | Pending (B6) |
