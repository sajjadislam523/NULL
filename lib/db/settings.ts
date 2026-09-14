import { connectDB } from "@/lib/db/connect";
import { Settings } from "@/models/Settings";

/** Settings is a singleton — this creates the one document on first read. */
export async function getSettings() {
  await connectDB();
  const existing = await Settings.findOne();
  if (existing) return existing;
  return Settings.create({});
}
