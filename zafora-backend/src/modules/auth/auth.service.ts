import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db, usersTable, sessionsTable } from "@/db/index.js";

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

// ─── Refresh token DB operations ────────────────────────────────────────────

export async function storeRefreshToken(
  tokenId: string,
  userId: number,
  expiresAt: Date,
): Promise<void> {
  await db.insert(sessionsTable).values({ sessionId: tokenId, userId, expiresAt });
}

export async function findRefreshToken(tokenId: string) {
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.sessionId, tokenId))
    .limit(1);
  return session ?? null;
}

export async function deleteRefreshToken(tokenId: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.sessionId, tokenId));
}

export async function deleteAllUserTokens(userId: number): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}
