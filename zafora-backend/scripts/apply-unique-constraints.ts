/**
 * One-time script to apply unique constraints that Drizzle generated.
 * Run: npx tsx scripts/apply-unique-constraints.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/db/index.js";

async function applyConstraints() {
  console.log("🔧 Applying unique constraints...\n");

  const statements = [
    { name: "content_stats.label", sql: `ALTER TABLE content_stats ADD CONSTRAINT content_stats_label_unique UNIQUE (label)` },
    { name: "methodology_steps.step_number", sql: `ALTER TABLE methodology_steps ADD CONSTRAINT methodology_steps_step_number_unique UNIQUE (step_number)` },
    { name: "services.name", sql: `ALTER TABLE services ADD CONSTRAINT services_name_unique UNIQUE (name)` },
    { name: "faqs.question", sql: `ALTER TABLE faqs ADD CONSTRAINT faqs_question_unique UNIQUE (question)` },
    { name: "documents.title", sql: `ALTER TABLE documents ADD CONSTRAINT documents_title_unique UNIQUE (title)` },
    { name: "projects.name", sql: `ALTER TABLE projects ADD CONSTRAINT projects_name_unique UNIQUE (name)` },
  ];

  for (const stmt of statements) {
    try {
      await db.execute(sql.raw(stmt.sql));
      console.log(`  ✓ ${stmt.name}`);
    } catch (err: any) {
      if (err?.message?.includes("already exists")) {
        console.log(`  ⟳ ${stmt.name} (already exists — skipped)`);
      } else {
        console.error(`  ✗ ${stmt.name}: ${err?.message}`);
      }
    }
  }

  console.log("\n✅ Done.");
  process.exit(0);
}

applyConstraints().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
