import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Returns a short-lived signed-upload payload so the browser can upload
 * directly to Cloudinary (image bytes never pass through our server).
 * Any authenticated CMS role may request one — all three can attach
 * images to a post.
 */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "null-cms";
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

  return NextResponse.json({ signature, timestamp, folder, apiKey, cloudName });
}
