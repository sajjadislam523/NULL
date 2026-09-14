/**
 * Domain enums shared between Mongoose models (server-only, pull in
 * Node/Mongoose internals) and Zod validation schemas (which also run in
 * client components via react-hook-form's zodResolver, e.g. LoginForm).
 * Keeping these here — with zero Mongoose/Node dependency — keeps a
 * client component's import graph from ever reaching into a model file
 * and pulling `mongoose` (and its Node-only `tls`/`net` deps) into the
 * browser bundle.
 */

export const USER_ROLES = ["ADMIN", "EDITOR", "AUTHOR"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "DISABLED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const POST_STATUSES = ["DRAFT", "PUBLISHED", "UNPUBLISHED"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];
