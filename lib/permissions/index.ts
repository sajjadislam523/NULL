import type { UserRole } from "@/lib/constants";

/**
 * Central RBAC vocabulary. Every privileged Server Action/page must go
 * through one of these rather than re-deriving role logic inline (§13,
 * §43). Ownership-aware checks take the acting user's id and the
 * resource's author id explicitly rather than a full user/post object,
 * so callers can't accidentally pass a stale or client-supplied role.
 *
 * Where PROMPT.md's per-role capability lists (§13) don't explicitly
 * mention delete, it's treated as bundled with edit rights: ADMIN/EDITOR
 * can edit any post, so they can delete any post; AUTHOR can edit only
 * their own, so they can delete only their own. Publishing is kept
 * separate and restricted to ADMIN/EDITOR — AUTHOR's list never mentions
 * publish/unpublish.
 */

export function canManageUsers(role: UserRole): boolean {
  return role === "ADMIN";
}

export function canManageSettings(role: UserRole): boolean {
  return role === "ADMIN";
}

export function canManageCategories(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canPublish(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canEditPost(role: UserRole, authorId: string, userId: string): boolean {
  if (role === "ADMIN" || role === "EDITOR") return true;
  return authorId === userId;
}

export function canDeletePost(role: UserRole, authorId: string, userId: string): boolean {
  return canEditPost(role, authorId, userId);
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** For use inside Server Actions/route handlers — throws rather than rendering a page. */
export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) throw new ForbiddenError(message);
}
