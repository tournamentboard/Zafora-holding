export const ROUTE_PATHS = {
  HEALTH: "/healthz",

  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY: "/auth/verify",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  LEADS: {
    LIST: "/leads",
    DETAIL: "/leads/:id",
  },

  PROJECTS: {
    LIST: "/projects",
    DETAIL: "/projects/:id",
    INTERESTS: "/projects/:id/interests",
  },

  DOCUMENTS: {
    LIST: "/documents",
    DETAIL: "/documents/:id",
  },

  SERVICES: {
    LIST: "/services",
    DETAIL: "/services/:id",
  },

  CONTENT: {
    SETTINGS: "/content/settings/:key",
    STATS: "/content/stats",
    METHODOLOGY: "/content/methodology",
  },

  TESTIMONIALS: {
    LIST: "/testimonials",
    DETAIL: "/testimonials/:id",
  },

  AUDIT: {
    LIST: "/audit",
  },

  STATS: {
    OVERVIEW: "/stats",
  },

  NOTIFICATIONS: {
    STATUS: "/notifications/status",
    SEND_TEST: "/notifications/test",
  },

  STORAGE: {
    PRESIGN: "/storage/presign",
  },
} as const;
