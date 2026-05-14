import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET, secure: true });
}

export async function uploadImageFromUrl(url: string, folder = "pinfashion-ai") {
  if (!env.CLOUDINARY_CLOUD_NAME) return { secure_url: url, public_id: undefined };
  return cloudinary.uploader.upload(url, { folder, resource_type: "image", transformation: [{ width: 1000, height: 1500, crop: "fill" }] });
}
