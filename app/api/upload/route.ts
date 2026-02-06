import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, CreateBucketCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const rawEndpoint = process.env.S3_ENDPOINT ?? "";
// supabaseOrigin is used for public URLs and REST calls. If S3_ENDPOINT contains
// the /storage/v1/s3 suffix, strip that to get the origin.
const supabaseOrigin = rawEndpoint
  ? rawEndpoint.replace(/\/storage\/v1\/s3\/?$/i, "").replace(/\/$/, "")
  : (process.env.SUPABASE_URL ?? "");

// s3SdkEndpoint should include the /storage/v1/s3 suffix (AWS SDK expects the S3-compatible path)
const s3SdkEndpoint = rawEndpoint
  ? (rawEndpoint.includes("/storage/v1/s3") ? rawEndpoint.replace(/\/$/, "") : `${rawEndpoint.replace(/\/$/, "")}/storage/v1/s3`)
  : undefined;

// For Supabase it's safer to default to path-style addressing to avoid SNI/virtual-host issues
const forcePathStyle = process.env.S3_FORCE_PATH_STYLE !== "false"; // default true unless explicitly set to 'false'

const s3Client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: s3SdkEndpoint || undefined,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle,
});

// Helper type guards
function isAsyncIterable(x: unknown): x is AsyncIterable<unknown> {
  return !!x && typeof (x as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function";
}
function isString(x: unknown): x is string {
  return typeof x === "string";
}
function isUint8Array(x: unknown): x is Uint8Array {
  return x instanceof Uint8Array;
}
function isBuffer(x: unknown): x is Buffer {
  return Buffer.isBuffer(x as unknown as Buffer);
}

async function streamToString(stream: unknown): Promise<string> {
  if (!stream) return "";
  if (isString(stream)) return stream;
  if (isBuffer(stream) || isUint8Array(stream)) return Buffer.from(stream as Uint8Array).toString("utf8");

  const chunks: Buffer[] = [];
  if (isAsyncIterable(stream)) {
    for await (const chunk of stream as AsyncIterable<unknown>) {
      if (isString(chunk)) {
        chunks.push(Buffer.from(chunk));
      } else if (isBuffer(chunk) || isUint8Array(chunk)) {
        chunks.push(Buffer.from(chunk as Uint8Array));
      } else {
        // Fallback: stringify other chunk types
        chunks.push(Buffer.from(String(chunk)));
      }
    }
  }

  if (chunks.length === 0) return "";
  return Buffer.concat(chunks).toString("utf8");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const bucketName = process.env.S3_BUCKET_NAME || "uploads";

    // Build supabase URL and require a service role key for REST PUT
    const supabaseUrl = supabaseOrigin || (process.env.SUPABASE_URL ?? "");
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Diagnostic: mask serviceRole for logs (don't print whole secret). Also log presence of other keys.
    const mask = (s?: string) => {
      if (!s) return "(not set)";
      if (s.length <= 10) return s.replace(/.(?=.{4})/g, "*");
      return `${s.slice(0, 6)}...${s.slice(-4)}`;
    };
    console.log("Upload diag: supabaseUrl=", !!supabaseUrl, "serviceRole=", serviceRole ? mask(serviceRole) : "(not set)", "S3_ACCESS_KEY_ID=", !!process.env.S3_ACCESS_KEY_ID, "S3_SECRET_ACCESS_KEY=", !!process.env.S3_SECRET_ACCESS_KEY, "forcePathStyle=", forcePathStyle);

    // If we have a service role key, prefer using the Supabase Storage REST PUT endpoint
    // since the AWS SDK can fail deserializing Supabase's responses or suffer TLS/SNI issues.
    if (supabaseUrl && serviceRole) {
      console.log("Using Supabase REST PUT for upload", supabaseUrl, bucketName, uniqueName);
      const putUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucketName}/${uniqueName}`;
      try {
        const res = await fetch(putUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${serviceRole}`,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: buffer,
        });
        const text = await res.text();
        console.log("Supabase PUT response status:", res.status, text);
        if (!res.ok) {
          // Provide a clearer error when the token is invalid
          if (res.status === 403 && text.includes("Invalid Compact JWS")) {
            return NextResponse.json({ error: "Supabase REST PUT failed: Invalid service role key (Invalid Compact JWS). Ensure SUPABASE_SERVICE_ROLE_KEY is the service_role from your Supabase project settings and is set in server env." }, { status: 403 });
          }
          return NextResponse.json({ error: `Supabase PUT failed: ${res.status} ${text}` }, { status: 500 });
        }

        const publicUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucketName}/${uniqueName}`;
        return NextResponse.json({ url: publicUrl });
      } catch (restErr: unknown) {
        console.error("Supabase REST PUT error:", restErr);
        return NextResponse.json({ error: (restErr instanceof Error ? restErr.message : String(restErr)) || "Supabase REST PUT error" }, { status: 500 });
      }
    }

    // Otherwise, fall back to the S3-compatible AWS SDK flow
    // Construct PutObjectCommand and attempt upload via AWS SDK
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueName,
      Body: buffer,
      ContentType: file.type,
    });

    console.log("S3 upload (SDK): endpoint:", s3SdkEndpoint, "bucket:", bucketName, "key:", uniqueName, "forcePathStyle:", forcePathStyle);

    try {
      await s3Client.send(command);
    } catch (awsErr: unknown) {
      console.error("AWS SDK upload error:", awsErr);

      // Check if it's NoSuchBucket and try to create the bucket
      const awsError = awsErr as { Code?: string; message?: string; $response?: { body?: unknown } };
      if (awsError.Code === 'NoSuchBucket') {
        console.log("Bucket not found, attempting to create bucket:", bucketName);
        try {
          const createCmd = new CreateBucketCommand({ Bucket: bucketName });
          await s3Client.send(createCmd);
          console.log("Bucket created successfully, retrying upload");
          // Retry the upload
          await s3Client.send(command);
        } catch (createErr: unknown) {
          console.error("Failed to create bucket or retry upload:", createErr);
          return NextResponse.json({ error: `Bucket creation failed or upload retry failed: ${(createErr as Error).message || String(createErr)}` }, { status: 500 });
        }
      } else {
        // detect TLS handshake failures and give actionable guidance
        const errMsg = awsErr instanceof Error ? awsErr.message : String(awsErr);
        if (errMsg.includes("EPROTO") || /SSL routines|ssl3_read_bytes|tls alert/i.test(errMsg)) {
          return NextResponse.json({ error: "TLS handshake failure with S3 endpoint. Upgrade Node/OpenSSL or ensure endpoint/host is correct and use path-style. See docs: use S3_ENDPOINT with /storage/v1/s3 and set S3_FORCE_PATH_STYLE=true." }, { status: 502 });
        }

        if (awsError?.$response) {
          try {
            const raw = await streamToString(awsError.$response.body);
            console.error("AWS raw response body:", raw);
          } catch (e) {
            console.error("Failed to read AWS raw response body:", e);
          }
        }

        return NextResponse.json({ error: awsError.message ?? String(awsError) }, { status: 500 });
      }
    }

    const publicUrl = `${(supabaseUrl || s3SdkEndpoint?.replace(/\/storage\/v1\/s3\/?$/i, "") || "").replace(/\/$/, "")}/storage/v1/object/public/${bucketName}/${uniqueName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err: unknown) {
    // Safely extract a message from unknown
    const message = err instanceof Error ? err.message : String(err);
    console.error("S3 Upload Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const urlObj = new URL(req.url);
    let key = urlObj.searchParams.get('key');
    const urlParam = urlObj.searchParams.get('url');

    // Blob URLs are local and don't need deletion
    if (urlParam && urlParam.startsWith('blob:')) {
      return NextResponse.json({ success: true });
    }

    if (!key && urlParam) {
      // Extract key from Supabase public URL: https://project.supabase.co/storage/v1/object/public/bucket/key
      const parts = urlParam.split('/storage/v1/object/public/');
      if (parts.length === 2) {
        const bucketAndKey = parts[1].split('/');
        if (bucketAndKey.length >= 2) {
          key = bucketAndKey.slice(1).join('/'); // everything after bucket/
        }
      }
    }

    if (!key) {
      return NextResponse.json({ error: "No key or valid url provided" }, { status: 400 });
    }

    const bucketName = process.env.S3_BUCKET_NAME || "uploads";
    const supabaseUrl = supabaseOrigin || (process.env.SUPABASE_URL ?? "");
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRole) {
      console.log("Using Supabase REST DELETE for", bucketName, key);
      const deleteUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucketName}/${key}`;
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${serviceRole}`,
        },
      });
      const text = await res.text();
      console.log("Supabase DELETE response status:", res.status, text);
      if (!res.ok) {
        return NextResponse.json({ error: `Delete failed: ${res.status} ${text}` }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    } else {
      console.log("Using S3 SDK DELETE for", bucketName, key);
      const deleteCmd = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await s3Client.send(deleteCmd);
      return NextResponse.json({ success: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Delete Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
