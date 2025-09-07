import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_PUBLIC_BASE_URL,
} = process.env;

export const isS3Enabled = Boolean(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && S3_BUCKET);

let s3: S3Client | null = null;
function getS3(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: S3_REGION || "us-east-1",
      endpoint: S3_ENDPOINT || undefined,
      // If using custom endpoints (R2/MinIO), path style avoids virtual host issues
      forcePathStyle: Boolean(S3_ENDPOINT),
      credentials:
        AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
          ? { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
          : undefined,
    });
  }
  return s3;
}

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

async function ensureUploadsDir() {
  await fsp.mkdir(UPLOADS_DIR, { recursive: true });
}

export type StoreInput = {
  data: Buffer | Uint8Array;
  contentType?: string;
  filename?: string;   // used only to infer extension
  prefix?: string;     // optional key prefix, e.g. "images/"
};

export type StoreResult = {
  key: string;
  url: string;
  provider: "s3" | "local";
};

export async function storeObject(input: StoreInput): Promise<StoreResult> {
  const ext = input.filename && input.filename.includes(".")
    ? "." + input.filename.split(".").pop()
    : "";
  const key = (input.prefix || "") + randomUUID().replace(/-/g, "") + ext;

  if (isS3Enabled) {
    const client = getS3();
    await client.send(new PutObjectCommand({
      Bucket: S3_BUCKET!,
      Key: key,
      Body: input.data,
      ContentType: input.contentType || "application/octet-stream",
    }));
    const base =
      S3_PUBLIC_BASE_URL
        || (S3_ENDPOINT ? `${S3_ENDPOINT.replace(/\/$/, "")}/${S3_BUCKET}` : `https://${S3_BUCKET}.s3.${S3_REGION || "us-east-1"}.amazonaws.com`);
    return { key, url: `${base}/${key}`, provider: "s3" };
  } else {
    await ensureUploadsDir();
    const filePath = path.join(UPLOADS_DIR, key);
    await fsp.writeFile(filePath, input.data);
    return { key, url: `/uploads/${key}`, provider: "local" };
  }
}