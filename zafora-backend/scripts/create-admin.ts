/**
 * Creates or updates the admin user from ADMIN_EMAIL + ADMIN_PASSWORD env vars.
 * Run: npx tsx scripts/create-admin.ts
 */

import "dotenv/config";
import bcrypt from "bcrypt";
import { db, usersTable } from "../src/db/index.js";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 12;

async function createAdmin() {
  const email = process.env["ADMIN_EMAIL"];
  const password = process.env["ADMIN_PASSWORD"];

  if (!email || !password) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  console.log(`🔐 Setting up admin account for: ${email}`);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing) {
    await db
      .update(usersTable)
      .set({ passwordHash, active: true })
      .where(eq(usersTable.id, existing.id));
    console.log(`✅ Admin password updated (id: ${existing.id})`);
  } else {
    const [created] = await db
      .insert(usersTable)
      .values({ email: email.toLowerCase().trim(), passwordHash, role: "admin", active: true })
      .returning({ id: usersTable.id });
    console.log(`✅ Admin account created (id: ${created!.id})`);
  }

  console.log(`\nLogin with password: ${password}`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
