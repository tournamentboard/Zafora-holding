import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@/db/index.js";
import { AuditAction } from "@/shared/enums/index.js";
import type { AuthSession, VerifyResult } from "./auth.types.js";

const SALT_ROUNDS = 12;

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);
  return user ?? null;
}

export async function validateCredentials(
  email: string,
  password: string,
): Promise<{ userId: number; email: string; role: string } | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.active) return null;

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;

  return { userId: user.id, email: user.email, role: user.role };
}

export function getSessionUser(session: Record<string, unknown>): AuthSession | null {
  if (
    typeof session["userId"] === "number" &&
    typeof session["email"] === "string" &&
    typeof session["role"] === "string"
  ) {
    return {
      userId: session["userId"],
      email: session["email"],
      role: session["role"],
    };
  }
  return null;
}

export function setSessionUser(session: Record<string, unknown>, user: AuthSession): void {
  session["userId"] = user.userId;
  session["email"] = user.email;
  session["role"] = user.role;
}

export function clearSession(session: Record<string, unknown>): void {
  delete session["userId"];
  delete session["email"];
  delete session["role"];
}

export function verifySession(session: Record<string, unknown>): VerifyResult {
  const user = getSessionUser(session);
  if (!user) return { authenticated: false };
  return {
    authenticated: true,
    user: { id: user.userId, email: user.email, role: user.role },
  };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) return { ok: false, error: "User not found" };

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) return { ok: false, error: "Current password is incorrect" };

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, userId));

  return { ok: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function createUser(email: string, password: string, role = "admin"): Promise<number> {
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ email: email.toLowerCase().trim(), passwordHash, role })
    .returning({ id: usersTable.id });
  return user!.id;
}
