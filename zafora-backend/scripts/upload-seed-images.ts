/**
 * Upload Seed Images to S3
 *
 * Downloads all default placeholder images and uploads them to their
 * correct S3 folders, then syncs every image URL back to the DB.
 *
 * Run AFTER seed.ts:
 *   npx tsx --env-file=.env scripts/upload-seed-images.ts
 *
 * Idempotent: already-uploaded S3 keys are skipped (HEAD check),
 * but DB URLs are always refreshed so a re-seed followed by re-run
 * of this script fully restores all image URLs.
 */

import "dotenv/config";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { db } from "../src/db/index.js";
import {
  siteSettingsTable,
  projectsTable,
  servicesTable,
} from "../src/db/schema/index.js";
import { eq } from "drizzle-orm";
import { S3_FOLDERS } from "../src/shared/constants/storage-folders.js";

// ─── S3 helpers ───────────────────────────────────────────────────────────────

function buildClient(): S3Client {
  return new S3Client({
    region: process.env["AWS_S3_REGION"] ?? "us-east-1",
    credentials: {
      accessKeyId: process.env["AWS_ACCESS_KEY_ID"] ?? "",
      secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] ?? "",
    },
  });
}

function buildPublicUrl(key: string): string {
  const bucket = process.env["AWS_S3_BUCKET"] ?? "";
  const region = process.env["AWS_S3_REGION"] ?? "us-east-1";
  const customDomain = (process.env["AWS_S3_CUSTOM_DOMAIN"] ?? "").replace(/\/$/, "");
  if (customDomain) return `${customDomain}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function s3KeyExists(client: S3Client, key: string): Promise<boolean> {
  const bucket = process.env["AWS_S3_BUCKET"] ?? "";
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(
  url: string,
): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "ZaforaImageSync/1.0" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const raw = res.headers.get("content-type") ?? "image/jpeg";
  const contentType = raw.split(";")[0]?.trim() ?? "image/jpeg";
  return { buffer, contentType };
}

async function uploadToS3(
  client: S3Client,
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const bucket = process.env["AWS_S3_BUCKET"] ?? "";
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return buildPublicUrl(key);
}

/**
 * Download source → upload to S3 → return public URL.
 * Skips the download+upload step if the key already exists in S3.
 */
async function ensureS3Image(
  client: S3Client,
  key: string,
  sourceUrl: string,
  label: string,
): Promise<string> {
  const exists = await s3KeyExists(client, key);
  const publicUrl = buildPublicUrl(key);

  if (exists) {
    console.log(`  ↩  [skip] ${label} — already in S3`);
    return publicUrl;
  }

  try {
    const { buffer, contentType } = await downloadImage(sourceUrl);
    await uploadToS3(client, key, buffer, contentType);
    const sizeKb = Math.round(buffer.length / 1024);
    console.log(`  ✓  [upload] ${label} — ${sizeKb}KB → ${key}`);
    return publicUrl;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`  ⚠  [failed] ${label} — ${msg} (keeping source URL)`);
    return sourceUrl;
  }
}

// ─── Image definitions ────────────────────────────────────────────────────────

const SITE_IMAGE_SOURCES = {
  home: {
    heroPanel:  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
    band1:      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=900&q=80",
    band2:      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
    band3:      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
    pillar1:    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=700&q=80",
    pillar2:    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=700&q=80",
    pillar3:    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
    engage1:    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80",
    engage2:    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80",
    engage3:    "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=700&q=80",
    collage1:   "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
    collage2:   "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
    collage3:   "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
    collage4:   "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
  },
  services: {
    mosaicLeft:  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=700&q=80",
    mosaicRight: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=700&q=80",
  },
  government: {
    heroImage:  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80",
    mainLeft:   "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
    mainRight:  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
  },
} as const;

const PROJECT_IMAGE_SOURCES: Record<string, { key: string; src: string }> = {
  "Rwanda Smart Grid Modernization": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/rwanda-smart-grid.jpg`,
    src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  },
  "Mozambique LNG Access Roads": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/mozambique-lng-roads.jpg`,
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  },
  "Lagos-Ibadan Healthcare Infrastructure": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/lagos-healthcare.jpg`,
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  "Nairobi Urban Water Resilience Program": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/nairobi-water.jpg`,
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
  },
  "Sahel Solar Energy Corridor": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/sahel-solar.jpg`,
    src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
  },
  "Lamu Port Expansion Phase II": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/lamu-port.jpg`,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  },
};

const SERVICE_IMAGE_SOURCES: Record<string, { key: string; src: string }> = {
  "Government Advisory": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/government-advisory.jpg`,
    src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
  },
  "Contracting & Procurement": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/contracting-procurement.jpg`,
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  },
  "Project Development": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/project-development.jpg`,
    src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
  },
  "Funding Advisory": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/funding-advisory.jpg`,
    src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  },
  "Project Management Support": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/project-management.jpg`,
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
  },
  "Market Entry Consulting": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/market-entry.jpg`,
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
  },
};

// ─── Section runners ──────────────────────────────────────────────────────────

async function uploadSiteImages(client: S3Client) {
  console.log("\n📂 Site Images (site_images setting)");

  const result = {
    home: {} as Record<string, string>,
    services: {} as Record<string, string>,
    government: {} as Record<string, string>,
  };

  // home
  console.log("\n  → Home page");
  for (const [slot, src] of Object.entries(SITE_IMAGE_SOURCES.home)) {
    const key = `${S3_FOLDERS.SITE_IMAGES_HOME}/${slot.replace(/([A-Z])/g, "-$1").toLowerCase()}.jpg`;
    result.home[slot] = await ensureS3Image(client, key, src, `home.${slot}`);
  }

  // services page
  console.log("\n  → Services page");
  for (const [slot, src] of Object.entries(SITE_IMAGE_SOURCES.services)) {
    const key = `${S3_FOLDERS.SITE_IMAGES_SERVICES}/${slot.replace(/([A-Z])/g, "-$1").toLowerCase()}.jpg`;
    result.services[slot] = await ensureS3Image(client, key, src, `services.${slot}`);
  }

  // government page
  console.log("\n  → Government page");
  for (const [slot, src] of Object.entries(SITE_IMAGE_SOURCES.government)) {
    const key = `${S3_FOLDERS.SITE_IMAGES_GOVERNMENT}/${slot.replace(/([A-Z])/g, "-$1").toLowerCase()}.jpg`;
    result.government[slot] = await ensureS3Image(client, key, src, `government.${slot}`);
  }

  // update DB
  await db
    .update(siteSettingsTable)
    .set({ value: JSON.stringify(result) })
    .where(eq(siteSettingsTable.key, "site_images"));

  console.log("\n  ✅ site_images setting updated in DB");
  return result;
}

async function uploadProjectImages(client: S3Client) {
  console.log("\n📂 Project Images (projects table → image_url)");

  let updated = 0;
  for (const [name, { key, src }] of Object.entries(PROJECT_IMAGE_SOURCES)) {
    const imageUrl = await ensureS3Image(client, key, src, name);
    await db
      .update(projectsTable)
      .set({ imageUrl })
      .where(eq(projectsTable.name, name));
    updated++;
  }

  console.log(`\n  ✅ ${updated} project image URLs updated in DB`);
}

async function uploadServiceImages(client: S3Client) {
  console.log("\n📂 Service Images (services table → image_url)");

  let updated = 0;
  for (const [name, { key, src }] of Object.entries(SERVICE_IMAGE_SOURCES)) {
    const imageUrl = await ensureS3Image(client, key, src, name);
    await db
      .update(servicesTable)
      .set({ imageUrl })
      .where(eq(servicesTable.name, name));
    updated++;
  }

  console.log(`\n  ✅ ${updated} service image URLs updated in DB`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const bucket = process.env["AWS_S3_BUCKET"];
  const accessKey = process.env["AWS_ACCESS_KEY_ID"];
  const secretKey = process.env["AWS_SECRET_ACCESS_KEY"];

  if (!bucket || !accessKey || !secretKey) {
    console.error(
      "❌ Missing required env vars: AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY",
    );
    console.error(
      "   Set them in zafora-backend/.env before running this script.",
    );
    process.exit(1);
  }

  console.log("🚀 Zafora Image Sync — uploading default images to S3\n");
  console.log(`   Bucket : ${bucket}`);
  console.log(`   Region : ${process.env["AWS_S3_REGION"] ?? "us-east-1"}`);
  console.log(
    `   CDN    : ${process.env["AWS_S3_CUSTOM_DOMAIN"] ?? "(direct S3)"}`,
  );

  const client = buildClient();

  await uploadSiteImages(client);
  await uploadProjectImages(client);
  await uploadServiceImages(client);

  console.log("\n✅ All images synced. S3 structure:");
  console.log(`
   ${bucket}/
   ├── site-images/
   │   ├── home/          (14 images)
   │   ├── services/      (2 images)
   │   └── government/    (3 images)
   ├── projects/
   │   └── images/        (6 images)
   └── services/
       └── images/        (6 images)
`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
