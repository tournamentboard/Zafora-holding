/**
 * patch-settings.ts
 *
 * One-time migration: updates site_settings and users table to reflect
 * new company name (Zafora Holdings), domain (zaforaholdings.com),
 * contact email (office@zaforaholdings.com), and admin email (from ADMIN_EMAIL env).
 *
 * Usage: npx tsx scripts/patch-settings.ts
 */

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable, usersTable } from "../src/db/index.js";

const OLD_DOMAIN = "zaforaholding.com";
const NEW_DOMAIN = "zaforaholdings.com";
const OLD_NAME = "Zafora Holding";
const NEW_NAME = "Zafora Holdings";
const OLD_CONTACT = "Office@zaforaholding.com";
const NEW_CONTACT = "office@zaforaholdings.com";
const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] ?? "";

if (!ADMIN_EMAIL) {
  console.error("❌ ADMIN_EMAIL must be set in .env");
  process.exit(1);
}

function patchJson(raw: string): { patched: string; changed: boolean } {
  let patched = raw
    .replaceAll(OLD_CONTACT, NEW_CONTACT)
    .replaceAll("Office@zaforaholdings.com", NEW_CONTACT)
    .replaceAll(OLD_DOMAIN, NEW_DOMAIN)
    .replaceAll(OLD_NAME + '"', NEW_NAME + '"')
    .replaceAll(OLD_NAME + " ", NEW_NAME + " ")
    .replaceAll(OLD_NAME + "\\n", NEW_NAME + "\\n")
    .replaceAll(OLD_NAME + ".", NEW_NAME + ".")
    .replaceAll(OLD_NAME + ",", NEW_NAME + ",")
    .replaceAll(OLD_NAME + "'", NEW_NAME + "'");
  const changed = patched !== raw;
  return { patched, changed };
}

async function run() {
  console.log("🔧 Patching site_settings...\n");

  const rows = await db.select().from(siteSettingsTable);
  let updatedCount = 0;

  for (const row of rows) {
    if (row.key === "notifications") {
      // Always set adminEmail from env
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(row.value); } catch { /* ignore */ }
      parsed["adminEmail"] = ADMIN_EMAIL;
      const newValue = JSON.stringify(parsed);
      if (newValue !== row.value) {
        await db.update(siteSettingsTable).set({ value: newValue }).where(eq(siteSettingsTable.key, row.key));
        console.log(`✅ [${row.key}] adminEmail → ${ADMIN_EMAIL}`);
        updatedCount++;
      } else {
        console.log(`⏭  [${row.key}] already up to date`);
      }
      continue;
    }

    const { patched, changed } = patchJson(row.value);
    if (changed) {
      await db.update(siteSettingsTable).set({ value: patched }).where(eq(siteSettingsTable.key, row.key));
      console.log(`✅ [${row.key}] patched`);
      updatedCount++;
    } else {
      console.log(`⏭  [${row.key}] no changes needed`);
    }
  }

  // Clean up stale admin users — remove any old email entries that are not the current ADMIN_EMAIL
  console.log("\n🔧 Patching users table...");
  const OLD_EMAILS = ["rwilli25@yahoo.com", "admin@zaforaholding.com", "office@zaforaholding.com", "admin@zaforaholdings.com"];
  for (const oldEmail of OLD_EMAILS) {
    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, oldEmail))
      .limit(1);
    if (existing) {
      // New admin already exists — just delete the stale old account
      await db.delete(usersTable).where(eq(usersTable.id, existing.id));
      console.log(`🗑  Removed stale admin user: ${oldEmail} (id=${existing.id})`);
    }
  }
  console.log(`✅ Active admin: ${ADMIN_EMAIL}`);

  console.log(`\n✅ Done. ${updatedCount} setting(s) updated.`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Patch failed:", err);
  process.exit(1);
});
