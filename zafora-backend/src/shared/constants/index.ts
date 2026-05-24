export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

export const APP_NAME = "Zafora Holding";
export const APP_URL = process.env["APP_URL"] ?? "https://zaforaholding.com";
