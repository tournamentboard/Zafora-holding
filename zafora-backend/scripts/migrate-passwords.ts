/**
 * migrate-passwords.ts
 *
 * One-time migration script: reads the plaintext admin_password from site_settings
 * and creates (or updates) the admin user in the users table with a bcrypt hash.
 *
 * Usage: npm run migrate:passwords
 */

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable, usersTable } from "../src/db/index.js";
import { hashPassword } from "../src/modules/auth/auth.service.js";

const DEFAULT_PASSWORD = "zafora2024";
const DEFAULT_EMAIL = process.env["ADMIN_EMAIL"] ?? "admin@zaforaholding.com";

async function run() {
  console.log("Starting password migration...");

  // 1. Read plaintext password from site_settings
  let plaintext = DEFAULT_PASSWORD;
  const [row] = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.key, "admin_password"))
    .limit(1);

  if (row?.value && !row.value.startsWith("$2")) {
    plaintext = row.value;
    console.log(`Found plaintext password in site_settings.`);
  } else if (row?.value?.startsWith("$2")) {
    console.log("Password in site_settings is already hashed — skipping site_settings update.");
  } else {
    console.log(`No admin_password in site_settings. Using default: "${DEFAULT_PASSWORD}".`);
  }

  // 2. Hash the password
  const passwordHash = await hashPassword(plaintext);

  // 3. Upsert admin user
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, DEFAULT_EMAIL))
    .limit(1);

  if (existingUser) {
    await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, existingUser.id));
    console.log(`Updated password hash for user: ${DEFAULT_EMAIL} (id=${existingUser.id})`);
  } else {
    const [newUser] = await db
      .insert(usersTable)
      .values({ email: DEFAULT_EMAIL, passwordHash, role: "admin" })
      .returning({ id: usersTable.id });
    console.log(`Created admin user: ${DEFAULT_EMAIL} (id=${newUser!.id})`);
  }

  // 4. Nullify plaintext in site_settings (security)
  if (row && !row.value.startsWith("$2")) {
    await db
      .update(siteSettingsTable)
      .set({ value: "[migrated]" })
      .where(eq(siteSettingsTable.key, "admin_password"));
    console.log("Cleared plaintext password from site_settings.");
  }

  console.log("Migration complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
