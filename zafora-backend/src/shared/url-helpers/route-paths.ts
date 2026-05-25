export const ROUTE_PATHS = {
  HEALTH: "/healthz",

  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY: "/auth/verify",
    REFRESH: "/auth/refresh",
    CHANGE_PASSWORD: "/auth/change-password",
    SETUP_STATUS: "/auth/setup-status",
    SETUP: "/auth/setup",
    RESET_PASSWORD: "/auth/reset-password",
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
    FAQS: "/content/faqs",
    FAQS_BY_ID: "/content/faqs/:id",
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
