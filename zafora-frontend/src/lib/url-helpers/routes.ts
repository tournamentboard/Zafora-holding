export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  PROJECTS: "/projects",
  GOVERNMENT: "/government",
  GOVERNMENT_REVIEW: "/government-review",
  SUBMIT: "/submit",
  LOGIN: "/login",
  ADMIN: {
    ROOT: "/admin",
    LEADS: "/admin/leads",
    PROJECTS: "/admin/projects",
    DOCUMENTS: "/admin/documents",
    CONTENT: "/admin/content",
    AUDIT: "/admin/audit",
    SETTINGS: "/admin/settings",
  },
} as const;
