import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!isCloudinaryConfigured()) {
    return jsonError(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      503
    );
  }

  const rl = await rateLimit(`upload:${session!.user.id}`, 30, 60_000);
  if (!rl.success) return jsonError("Upload rate limit exceeded", 429);

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("file is required");

  if (!ALLOWED.has(file.type)) return jsonError("Only JPEG, PNG, WebP, GIF, AVIF allowed");
  if (file.size > MAX_BYTES) return jsonError("File too large (max 8MB)");

  const folder = String(form.get("folder") || "mohit-tiles");
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadImageBuffer(buffer, folder);

  return jsonOk(result, { status: 201 });
}
