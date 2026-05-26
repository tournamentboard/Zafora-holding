const API_PREFIX = "/api";

export const API = {
  HEALTH: {
    CHECK: `${API_PREFIX}/healthz`,
  },
  AUTH: {
    LOGIN: `${API_PREFIX}/auth/login`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    VERIFY: `${API_PREFIX}/auth/verify`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    CHANGE_PASSWORD: `${API_PREFIX}/auth/change-password`,
    SETUP_STATUS: `${API_PREFIX}/auth/setup-status`,
    SETUP: `${API_PREFIX}/auth/setup`,
    RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
  },
  LEADS: {
    LIST: `${API_PREFIX}/leads`,
    BY_ID: (id: number | string) => `${API_PREFIX}/leads/${id}`,
  },
  PROJECTS: {
    LIST: `${API_PREFIX}/projects`,
    BY_ID: (id: number | string) => `${API_PREFIX}/projects/${id}`,
    INTERESTS: (id: number | string) => `${API_PREFIX}/projects/${id}/interests`,
  },
  DOCUMENTS: {
    LIST: `${API_PREFIX}/documents`,
    BY_ID: (id: number | string) => `${API_PREFIX}/documents/${id}`,
  },
  STATS: {
    ROOT: `${API_PREFIX}/stats`,
    PROJECTS: `${API_PREFIX}/stats/projects`,
  },
  SERVICES: {
    LIST: `${API_PREFIX}/services`,
    BY_ID: (id: number | string) => `${API_PREFIX}/services/${id}`,
  },
  CONTENT: {
    STATS: `${API_PREFIX}/content/stats`,
    STATS_BY_ID: (id: number | string) => `${API_PREFIX}/content/stats/${id}`,
    METHODOLOGY: `${API_PREFIX}/content/methodology`,
    METHODOLOGY_BY_ID: (id: number | string) =>
      `${API_PREFIX}/content/methodology/${id}`,
    SETTINGS: (key: string) => `${API_PREFIX}/content/settings/${key}`,
    FAQS: `${API_PREFIX}/content/faqs`,
    FAQS_BY_ID: (id: number | string) => `${API_PREFIX}/content/faqs/${id}`,
  },
  TESTIMONIALS: {
    LIST: `${API_PREFIX}/testimonials`,
    BY_ID: (id: number | string) => `${API_PREFIX}/testimonials/${id}`,
  },
  AUDIT: {
    LIST: `${API_PREFIX}/audit`,
  },
  NOTIFICATIONS: {
    STATUS: `${API_PREFIX}/notifications/status`,
    TEST: `${API_PREFIX}/notifications/test`,
  },
  STORAGE: {
    PRESIGN: `${API_PREFIX}/storage/presign`,
  },
} as const;
