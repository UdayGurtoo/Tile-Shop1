import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function cloudinaryThumb(url: Stringish, width = 400) {
  if (!url) return "";
  const u = String(url);
  if (u.includes("res.cloudinary.com") && u.includes("/upload/")) {
    return u.replace("/upload/", `/upload/c_fill,g_auto,f_auto,q_auto,w_${width}/`);
  }
  return u;
}

export function cloudinaryOptimized(url: Stringish, width = 1200) {
  if (!url) return "";
  const u = String(url);
  if (u.includes("res.cloudinary.com") && u.includes("/upload/")) {
    return u.replace("/upload/", `/upload/c_limit,f_auto,q_auto,w_${width}/`);
  }
  return u;
}

type Stringish = string | null | undefined;

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = "mohit-tiles",
  filename?: string
) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_* env vars.");
  }

  return new Promise<{
    url: string;
    publicId: string;
    width: number;
    height: number;
    thumbnailUrl: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          thumbnailUrl: cloudinaryThumb(result.secure_url, 400),
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteCloudinaryImage(publicId: string) {
  if (!isCloudinaryConfigured() || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
