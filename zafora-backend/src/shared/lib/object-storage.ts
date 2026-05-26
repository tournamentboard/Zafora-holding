import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

export const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
] as const;

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function buildS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_S3_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
}

function buildPublicUrl(key: string): string {
  const bucket = process.env.AWS_S3_BUCKET ?? "";
  const region = process.env.AWS_S3_REGION ?? "us-east-1";
  const customDomain = (process.env.AWS_S3_CUSTOM_DOMAIN ?? "").replace(/\/$/, "");

  if (customDomain) return `${customDomain}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function getPresignedPutUrl(
  folder: string,
  fileName: string,
  contentType: string,
  expiresIn = 3600,
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const bucket = process.env.AWS_S3_BUCKET ?? "";
  if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");

  const rawExt = fileName.includes(".") ? fileName.split(".").pop() : "";
  const key = `${folder}/${randomUUID()}${rawExt ? `.${rawExt}` : ""}`;

  const client = buildS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  const publicUrl = buildPublicUrl(key);

  return { uploadUrl, publicUrl, key };
}

export async function deleteObject(key: string): Promise<void> {
  const bucket = process.env.AWS_S3_BUCKET ?? "";
  if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");

  const client = buildS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
