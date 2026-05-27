import COS from "cos-nodejs-sdk-v5";

let cosClient: COS | null = null;

function getCosClient(): COS {
  if (cosClient) return cosClient;
  cosClient = new COS({
    SecretId: process.env.COS_SECRET_ID!,
    SecretKey: process.env.COS_SECRET_KEY!,
  });
  return cosClient;
}

const BUCKET = () => process.env.COS_BUCKET!;
const REGION = () => process.env.COS_REGION!;

export function getCosUrl(cosKey: string): string {
  return `https://${BUCKET()}.cos.${REGION()}.myqcloud.com/${cosKey}`;
}

export function getSignedCosUrl(cosKey: string, expires: number = 7200): string {
  const client = getCosClient();
  return client.getObjectUrl({
    Bucket: BUCKET(),
    Region: REGION(),
    Key: cosKey,
    Sign: true,
    Expires: expires,
  });
}

export function isCosConfigured(): boolean {
  return !!(
    process.env.COS_SECRET_ID &&
    process.env.COS_SECRET_KEY &&
    process.env.COS_BUCKET &&
    process.env.COS_REGION
  );
}

/**
 * Upload a Buffer to COS, returns the public URL.
 */
export function uploadBufferToCos(
  buffer: Buffer,
  cosKey: string,
  contentType: string = "image/png"
): Promise<string> {
  const client = getCosClient();
  return new Promise((resolve, reject) => {
    client.putObject(
      {
        Bucket: BUCKET(),
        Region: REGION(),
        Key: cosKey,
        Body: buffer,
        ContentType: contentType,
      },
      (err) => {
        if (err) reject(err);
        else resolve(getCosUrl(cosKey));
      }
    );
  });
}

/**
 * Upload a base64 data-URI to COS.
 */
export async function uploadBase64ToCos(
  base64DataUri: string,
  cosKey: string
): Promise<string> {
  // Strip data:image/png;base64, prefix
  const matches = base64DataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 data URI");
  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  return uploadBufferToCos(buffer, cosKey, contentType);
}

/**
 * Upload from a remote URL to COS (download then upload).
 */
export async function uploadUrlToCos(
  remoteUrl: string,
  cosKey: string
): Promise<string> {
  const res = await fetch(remoteUrl);
  if (!res.ok) throw new Error(`Failed to fetch remote image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/png";
  return uploadBufferToCos(buffer, cosKey, contentType);
}

/**
 * Delete an object from COS.
 */
export function deleteFromCos(cosKey: string): Promise<void> {
  const client = getCosClient();
  return new Promise((resolve, reject) => {
    client.deleteObject(
      { Bucket: BUCKET(), Region: REGION(), Key: cosKey },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}
