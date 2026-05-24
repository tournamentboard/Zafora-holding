# API Map

_Last updated: 2026-05-24_

Frontend constant → Backend route → Service function → Frontend hook(s)

---

## Auth

| Frontend Constant | Backend Route | Service Fn | Frontend Hook / Action |
|------------------|--------------|------------|----------------------|
| `API.AUTH.LOGIN` | `POST /api/auth/login` | `loginUser()` | `auth.service.ts:login()` |
| `API.AUTH.LOGOUT` | `POST /api/auth/logout` | `logoutUser()` | `AdminSidebar:handleLogout()` |
| `API.AUTH.VERIFY` | `GET /api/auth/verify` | `verifyToken()` | `lib/auth.ts:verifySession()` |
| `API.AUTH.REFRESH` | `POST /api/auth/refresh` | `refreshTokens()` | `axios-instance.ts interceptor` |
| `API.AUTH.CHANGE_PASSWORD` | `POST /api/auth/change-password` | `changePassword()` | `SettingsPanel` via `apiAxios` |

## Leads

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.LEADS.LIST` | `GET /api/leads` 🔒 | `listLeads(query)` | `useLeads()` |
| `API.LEADS.LIST` | `POST /api/leads` | `createLead(data)` | `lib/actions/public.ts:submitLead()` |
| `API.LEADS.BY_ID(id)` | `GET /api/leads/:id` 🔒 | `getLeadById(id)` | (direct in LeadsTable) |
| `API.LEADS.BY_ID(id)` | `PATCH /api/leads/:id` 🔒 | `updateLead(id, data)` | `useUpdateLead()` |

## Projects

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.PROJECTS.LIST` | `GET /api/projects` | `listProjects(query)` | `useAdminProjects()` / public RSC |
| `API.PROJECTS.LIST` | `POST /api/projects` 🔒 | `createProject(data)` | `useCreateProject()` |
| `API.PROJECTS.BY_ID(id)` | `GET /api/projects/:id` | `getProjectById(id)` | public RSC |
| `API.PROJECTS.BY_ID(id)` | `PATCH /api/projects/:id` 🔒 | `updateProject(id, data)` | `useUpdateProject()` |
| `API.PROJECTS.BY_ID(id)` | `DELETE /api/projects/:id` 🔒 | `deleteProject(id)` | `useDeleteProject()` |
| `API.PROJECTS.INTERESTS(id)` | `POST /api/projects/:id/interests` | `createInterest(id, data)` | `lib/actions/public.ts:expressInterest()` |
| `API.PROJECTS.INTERESTS(id)` | `GET /api/projects/:id/interests` 🔒 | `listInterests(id)` | `InterestsModal` |

## Documents

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.DOCUMENTS.LIST` | `GET /api/documents` 🔒 | `listDocuments()` | `useDocuments()` |
| `API.DOCUMENTS.LIST` | `POST /api/documents` 🔒 | `createDocument(data)` | `useCreateDocument()` |
| `API.DOCUMENTS.BY_ID(id)` | `PATCH /api/documents/:id` 🔒 | `updateDocument(id, data)` | `useUpdateDocument()` |
| `API.DOCUMENTS.BY_ID(id)` | `DELETE /api/documents/:id` 🔒 | `deleteDocument(id)` | `useDeleteDocument()` |

## Services

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.SERVICES.LIST` | `GET /api/services` | `listServices()` | public RSC / `useAdminServices()` |
| `API.SERVICES.LIST` | `POST /api/services` 🔒 | `createService(data)` | `useCreateService()` |
| `API.SERVICES.BY_ID(id)` | `PATCH /api/services/:id` 🔒 | `updateService(id, data)` | `useUpdateService()` |
| `API.SERVICES.BY_ID(id)` | `DELETE /api/services/:id` 🔒 | `deleteService(id)` | `useDeleteService()` |

## Content

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.CONTENT.STATS` | `GET /api/content/stats` | `listContentStats()` | `useContentStats()` |
| `API.CONTENT.STATS` | `POST /api/content/stats` 🔒 | `createContentStat(data)` | `useCreateContentStat()` |
| `API.CONTENT.STATS_BY_ID(id)` | `PATCH /api/content/stats/:id` 🔒 | `updateContentStat(id, data)` | `useUpdateContentStat()` |
| `API.CONTENT.STATS_BY_ID(id)` | `DELETE /api/content/stats/:id` 🔒 | `deleteContentStat(id)` | `useDeleteContentStat()` |
| `API.CONTENT.METHODOLOGY` | `GET /api/content/methodology` | `listMethodologySteps()` | `useMethodologySteps()` |
| `API.CONTENT.METHODOLOGY` | `POST /api/content/methodology` 🔒 | `createMethodologyStep(data)` | `useCreateMethodologyStep()` |
| `API.CONTENT.METHODOLOGY_BY_ID(id)` | `PATCH /api/content/methodology/:id` 🔒 | `updateMethodologyStep(id, data)` | `useUpdateMethodologyStep()` |
| `API.CONTENT.METHODOLOGY_BY_ID(id)` | `DELETE /api/content/methodology/:id` 🔒 | `deleteMethodologyStep(id)` | `useDeleteMethodologyStep()` |
| `API.CONTENT.SETTINGS(key)` | `GET /api/content/settings/:key` | `getOrCreateSetting(key)` | `useGetSiteSettings(key)` |
| `API.CONTENT.SETTINGS(key)` | `PATCH /api/content/settings/:key` 🔒 | `upsertSetting(key, value)` | `useUpdateSiteSettings()` |

## Testimonials

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.TESTIMONIALS.LIST` | `GET /api/testimonials` | `listTestimonials()` | `useAdminTestimonials()` / public RSC |
| `API.TESTIMONIALS.LIST` | `POST /api/testimonials` 🔒 | `createTestimonial(data)` | `useCreateTestimonial()` |
| `API.TESTIMONIALS.BY_ID(id)` | `PATCH /api/testimonials/:id` 🔒 | `updateTestimonial(id, data)` | `useUpdateTestimonial()` |
| `API.TESTIMONIALS.BY_ID(id)` | `DELETE /api/testimonials/:id` 🔒 | `deleteTestimonial(id)` | `useDeleteTestimonial()` |

## Stats

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.STATS.ROOT` | `GET /api/stats` 🔒 | `getDashboardStats()` | `useDashboardStats()` |
| `API.STATS.PROJECTS` | `GET /api/stats/projects` 🔒 | `getProjectStats()` | `useProjectStats()` |

## Audit

| Frontend Constant | Backend Route | Service Fn | Frontend Hook |
|------------------|--------------|------------|---------------|
| `API.AUDIT.LIST` | `GET /api/audit` 🔒 | `listAuditLogs(query)` | `useAuditLogs()` |
| `API.AUDIT.LIST` | `DELETE /api/audit` 🔒 | `clearAuditLogs()` | `useClearAuditLogs()` |

## Notifications

| Frontend Constant | Backend Route | Frontend Usage |
|------------------|--------------|---------------|
| `API.NOTIFICATIONS.STATUS` | `GET /api/notifications/status` 🔒 | `SettingsPanel` via `apiAxios` |
| `API.NOTIFICATIONS.TEST` | `POST /api/notifications/test` 🔒 | `SettingsPanel` via `apiAxios` |

🔒 = requires `access_token` cookie
