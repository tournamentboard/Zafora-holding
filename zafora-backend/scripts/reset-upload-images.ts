/**
 * Reset & Re-upload Seed Images
 *
 * 1. Deletes ALL existing objects from every Zafora S3 folder.
 * 2. Re-uploads the EXACT default images defined in the frontend
 *    (ImagesEditor.tsx IMAGE_DEFAULTS — no substitutions).
 * 3. Updates the DB with the new S3 URLs.
 *
 * Run:  npx tsx --env-file=.env scripts/reset-upload-images.ts
 */

import "dotenv/config";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  PutObjectCommand,
  type ObjectIdentifier,
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

function publicUrl(key: string): string {
  const bucket = process.env["AWS_S3_BUCKET"] ?? "";
  const region = process.env["AWS_S3_REGION"] ?? "us-east-1";
  const cdn = (process.env["AWS_S3_CUSTOM_DOMAIN"] ?? "").replace(/\/$/, "");
  return cdn ? `${cdn}/${key}` : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function deleteAllInFolder(client: S3Client, prefix: string): Promise<number> {
  const bucket = process.env["AWS_S3_BUCKET"] ?? "";
  let deleted = 0;
  let continuationToken: string | undefined;

  do {
    const listRes = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    const keys: ObjectIdentifier[] = (listRes.Contents ?? []).map((o) => ({
      Key: o.Key!,
    }));

    if (keys.length > 0) {
      await client.send(
        new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: keys } }),
      );
      deleted += keys.length;
    }

    continuationToken = listRes.IsTruncated ? listRes.NextContinuationToken : undefined;
  } while (continuationToken);

  return deleted;
}

async function download(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "ZaforaImageSync/1.0" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const ct = (res.headers.get("content-type") ?? "image/jpeg").split(";")[0]?.trim() ?? "image/jpeg";
  return { buffer, contentType: ct };
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
  return publicUrl(key);
}

async function fetchAndUpload(
  client: S3Client,
  key: string,
  srcUrl: string,
  label: string,
): Promise<string> {
  try {
    const { buffer, contentType } = await download(srcUrl);
    const url = await uploadToS3(client, key, buffer, contentType);
    console.log(`  ✓  ${label}  (${Math.round(buffer.length / 1024)}KB)  →  ${key}`);
    return url;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗  ${label}  FAILED: ${msg}`);
    // Return the original source URL so the page still loads via Unsplash fallback
    return srcUrl;
  }
}

// ─── Exact frontend defaults (ImagesEditor.tsx IMAGE_DEFAULTS) ────────────────
// These are the ONLY authoritative source for site image defaults.
// Do NOT change these — they must match what ImagesEditor.tsx shows as fallback.

const SITE_IMAGE_DEFAULTS = {
  home: {
    heroPanel:  { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/hero-panel.jpg`,  src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80" },
    band1:      { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/band-1.jpg`,      src: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=900&q=80" },
    band2:      { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/band-2.jpg`,      src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80" },
    band3:      { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/band-3.jpg`,      src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80" },
    pillar1:    { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/pillar-1.jpg`,    src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=700&q=80" },
    pillar2:    { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/pillar-2.jpg`,    src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=700&q=80" },
    pillar3:    { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/pillar-3.jpg`,    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80" },
    engage1:    { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/engage-1.jpg`,    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80" },
    engage2:    { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/engage-2.jpg`,    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80" },
    engage3:    { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/engage-3.jpg`,    src: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=700&q=80" },
    collage1:   { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/collage-1.jpg`,   src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80" },
    collage2:   { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/collage-2.jpg`,   src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80" },
    collage3:   { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/collage-3.jpg`,   src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80" },
    collage4:   { key: `${S3_FOLDERS.SITE_IMAGES_HOME}/collage-4.jpg`,   src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" },
  },
  services: {
    mosaicLeft:  { key: `${S3_FOLDERS.SITE_IMAGES_SERVICES}/mosaic-left.jpg`,  src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=700&q=80" },
    mosaicRight: { key: `${S3_FOLDERS.SITE_IMAGES_SERVICES}/mosaic-right.jpg`, src: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=700&q=80" },
  },
  government: {
    heroImage: { key: `${S3_FOLDERS.SITE_IMAGES_GOVERNMENT}/hero-image.jpg`,  src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80" },
    mainLeft:  { key: `${S3_FOLDERS.SITE_IMAGES_GOVERNMENT}/main-left.jpg`,   src: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80" },
    mainRight: { key: `${S3_FOLDERS.SITE_IMAGES_GOVERNMENT}/main-right.jpg`,  src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80" },
  },
} as const;

// ─── Project images (sector-relevant stock photos) ────────────────────────────

const PROJECT_IMAGES: Record<string, { key: string; src: string }> = {
  "Rwanda Smart Grid Modernization": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/rwanda-smart-grid.jpg`,
    src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80",
  },
  "Mozambique LNG Access Roads": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/mozambique-lng-roads.jpg`,
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
  },
  "Lagos-Ibadan Healthcare Infrastructure": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/lagos-healthcare.jpg`,
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
  },
  "Nairobi Urban Water Resilience Program": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/nairobi-water.jpg`,
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
  },
  "Sahel Solar Energy Corridor": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/sahel-solar.jpg`,
    src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80",
  },
  "Lamu Port Expansion Phase II": {
    key: `${S3_FOLDERS.PROJECTS_IMAGES}/lamu-port.jpg`,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  },
};

// ─── Service images (practice-area-relevant stock photos) ─────────────────────

const SERVICE_IMAGES: Record<string, { key: string; src: string }> = {
  "Government Advisory": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/government-advisory.jpg`,
    src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
  },
  "Contracting & Procurement": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/contracting-procurement.jpg`,
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
  },
  "Project Development": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/project-development.jpg`,
    src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  },
  "Funding Advisory": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/funding-advisory.jpg`,
    src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
  },
  "Project Management Support": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/project-management.jpg`,
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  },
  "Market Entry Consulting": {
    key: `${S3_FOLDERS.SERVICES_IMAGES}/market-entry.jpg`,
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const bucket = process.env["AWS_S3_BUCKET"];
  const accessKey = process.env["AWS_ACCESS_KEY_ID"];
  const secretKey = process.env["AWS_SECRET_ACCESS_KEY"];

  if (!bucket || !accessKey || !secretKey) {
    console.error("❌ Missing AWS env vars: AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY");
    process.exit(1);
  }

  console.log("🗑️  Step 1 — Delete all existing images from S3\n");
  console.log(`   Bucket : ${bucket}`);
  console.log(`   Region : ${process.env["AWS_S3_REGION"] ?? "us-east-1"}\n`);

  const client = buildClient();

  const foldersToDelete = [
    "site-images/",
    "projects/images/",
    "services/images/",
    "branding/",
    "team/",
    "testimonials/",
  ];

  let totalDeleted = 0;
  for (const prefix of foldersToDelete) {
    const n = await deleteAllInFolder(client, prefix);
    if (n > 0) console.log(`  🗑  Deleted ${n} object(s) under ${prefix}`);
    else console.log(`  –  No objects found under ${prefix}`);
    totalDeleted += n;
  }
  console.log(`\n  ✅ ${totalDeleted} total objects deleted\n`);

  // ── Upload site_images (exact frontend defaults) ──────────────────

  console.log("📂 Step 2 — Upload site images (exact ImagesEditor.tsx defaults)\n");

  const siteResult = {
    home: {} as Record<string, string>,
    services: {} as Record<string, string>,
    government: {} as Record<string, string>,
  };

  console.log("  → Home page (14 images)");
  for (const [slot, { key, src }] of Object.entries(SITE_IMAGE_DEFAULTS.home)) {
    siteResult.home[slot] = await fetchAndUpload(client, key, src, `home.${slot}`);
  }

  console.log("\n  → Services page (2 images)");
  for (const [slot, { key, src }] of Object.entries(SITE_IMAGE_DEFAULTS.services)) {
    siteResult.services[slot] = await fetchAndUpload(client, key, src, `services.${slot}`);
  }

  console.log("\n  → Government page (3 images)");
  for (const [slot, { key, src }] of Object.entries(SITE_IMAGE_DEFAULTS.government)) {
    siteResult.government[slot] = await fetchAndUpload(client, key, src, `government.${slot}`);
  }

  await db
    .update(siteSettingsTable)
    .set({ value: JSON.stringify(siteResult) })
    .where(eq(siteSettingsTable.key, "site_images"));
  console.log("\n  ✅ site_images DB record updated\n");

  // ── Upload project images ─────────────────────────────────────────

  console.log("📂 Step 3 — Upload project images (6 projects)\n");
  for (const [name, { key, src }] of Object.entries(PROJECT_IMAGES)) {
    const imageUrl = await fetchAndUpload(client, key, src, name);
    await db
      .update(projectsTable)
      .set({ imageUrl })
      .where(eq(projectsTable.name, name));
  }
  console.log("\n  ✅ Project imageUrl columns updated\n");

  // ── Upload service images ─────────────────────────────────────────

  console.log("📂 Step 4 — Upload service images (6 services)\n");
  for (const [name, { key, src }] of Object.entries(SERVICE_IMAGES)) {
    const imageUrl = await fetchAndUpload(client, key, src, name);
    await db
      .update(servicesTable)
      .set({ imageUrl })
      .where(eq(servicesTable.name, name));
  }
  console.log("\n  ✅ Service imageUrl columns updated\n");

  // ── Summary ───────────────────────────────────────────────────────

  console.log(`✅ Done. Final S3 structure:\n
   ${bucket}/
   ├── site-images/
   │   ├── home/          (14 images — hero-panel, band-1/2/3, pillar-1/2/3, engage-1/2/3, collage-1/2/3/4)
   │   ├── services/      (2 images  — mosaic-left, mosaic-right)
   │   └── government/    (3 images  — hero-image, main-left, main-right)
   ├── projects/images/   (6 images  — one per project, named by slug)
   └── services/images/   (6 images  — one per service, named by slug)
`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
