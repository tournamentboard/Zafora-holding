import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const accessSecret = process.env["JWT_ACCESS_SECRET"];
const refreshSecret = process.env["JWT_REFRESH_SECRET"];

if (!accessSecret || !refreshSecret) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET environment variables are required");
}

const ACCESS_EXPIRY_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: (process.env["NODE_ENV"] === "production" ? "none" : "lax") as "none" | "lax",
  path: "/",
};

export const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_BASE,
  maxAge: ACCESS_EXPIRY_SECONDS * 1000,
};

export const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_BASE,
  maxAge: REFRESH_EXPIRY_MS,
};

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  tokenId: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, accessSecret!, { expiresIn: ACCESS_EXPIRY_SECONDS });
}

export function generateRefreshToken(payload: TokenPayload): {
  token: string;
  tokenId: string;
  expiresAt: Date;
} {
  const tokenId = randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRY_MS);
  const token = jwt.sign({ ...payload, tokenId }, refreshSecret!, { expiresIn: "7d" });
  return { token, tokenId, expiresAt };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, accessSecret!) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const payload = jwt.verify(token, refreshSecret!) as RefreshTokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export function clearAuthCookies(res: import("express").Response): void {
  res.clearCookie(ACCESS_COOKIE, COOKIE_BASE);
  res.clearCookie(REFRESH_COOKIE, COOKIE_BASE);
}
