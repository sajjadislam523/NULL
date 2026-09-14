import mongoose from "mongoose";

/**
 * Imported for their model-registration side effect, not their exports.
 * Next.js code-splits per route, so a route that only directly imports
 * `Post` (and calls `.populate("category")`/`.populate("author")`) can
 * run before `models/Category.ts`/`models/User.ts` have ever been
 * imported anywhere in its module graph — Mongoose's populate then fails
 * with "Schema hasn't been registered for model". Every data-layer
 * function already calls connectDB(), so registering all models here
 * guarantees they're always registered before any query runs.
 */
import "@/models/User";
import "@/models/Post";
import "@/models/Category";
import "@/models/Settings";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cached across hot-reloads in dev so each edit doesn't open a new connection.
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri);
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
