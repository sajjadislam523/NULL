"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deletePost, setPostStatus } from "@/app/admin/posts/actions";
import { canDeletePost, canEditPost, canPublish } from "@/lib/permissions";
import type { PostStatus, UserRole } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Metadata } from "@/components/decorative/Metadata";

export interface PostRow {
  _id: string;
  title: string;
  slug: string;
  status: PostStatus;
  updatedAt: string;
  category: { name: string; slug: string } | null;
  author: { _id: string; name: string } | null;
}

interface PostTableProps {
  posts: PostRow[];
  currentUserId: string;
  currentUserRole: UserRole;
}

const STATUS_VARIANT = {
  PUBLISHED: "solid",
  DRAFT: "default",
  UNPUBLISHED: "outline",
} as const;

export function PostTable({ posts, currentUserId, currentUserRole }: PostTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deletePost(deleteTarget._id);
      if (!result.success) {
        setError(result.error);
      } else {
        setDeleteTarget(null);
        setError(null);
      }
    });
  }

  function handleToggleStatus(post: PostRow) {
    const next: PostStatus = post.status === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";
    startTransition(async () => {
      await setPostStatus(post._id, next);
    });
  }

  if (posts.length === 0) {
    return <p className="px-6 py-12 text-sm text-foreground-secondary">No posts yet.</p>;
  }

  return (
    <>
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-foreground-secondary">
            <th className="px-6 py-3 font-normal">Title</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 font-normal">Author</th>
            <th className="px-4 py-3 font-normal">Updated</th>
            <th className="px-6 py-3 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id} className="border-b border-border">
              <td className="px-6 py-3">
                <div className="text-foreground">{post.title}</div>
                {post.category && <Metadata items={[post.category.name]} className="mt-1" />}
              </td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[post.status]}>{post.status}</Badge>
              </td>
              <td className="px-4 py-3 text-foreground-secondary">{post.author?.name ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-foreground-secondary">
                {new Date(post.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-3">
                <PostActions
                  post={post}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  onDelete={() => setDeleteTarget(post)}
                  onToggleStatus={() => handleToggleStatus(post)}
                  align="right"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile stacked cards (§50) */}
      <div className="space-y-3 p-4 md:hidden">
        {posts.map((post) => (
          <div key={post._id} className="space-y-2 rounded-sm border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="text-foreground">{post.title}</span>
              <Badge variant={STATUS_VARIANT[post.status]}>{post.status}</Badge>
            </div>
            <Metadata
              items={[post.category?.name, post.author?.name, new Date(post.updatedAt).toLocaleDateString()]}
            />
            <PostActions
              post={post}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onDelete={() => setDeleteTarget(post)}
              onToggleStatus={() => handleToggleStatus(post)}
              align="left"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete post?">
        <p className="mb-4 text-sm text-foreground-secondary">
          {`"${deleteTarget?.title}" will be permanently deleted. This can't be undone.`}
        </p>
        {error && (
          <p role="alert" className="mb-4 text-sm text-foreground-secondary">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}

function PostActions({
  post,
  currentUserId,
  currentUserRole,
  onDelete,
  onToggleStatus,
  align,
}: {
  post: PostRow;
  currentUserId: string;
  currentUserRole: UserRole;
  onDelete: () => void;
  onToggleStatus: () => void;
  align: "left" | "right";
}) {
  const authorId = post.author?._id ?? "";
  const canEdit = canEditPost(currentUserRole, authorId, currentUserId);
  const canDelete = canDeletePost(currentUserRole, authorId, currentUserId);
  const canTogglePublish = canPublish(currentUserRole) && post.status !== "DRAFT";

  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "justify-end" : ""}`}>
      <Link
        href={`/blog/${post.slug}`}
        target="_blank"
        aria-label="Preview"
        className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
      >
        <Eye className="h-4 w-4" />
      </Link>
      {canEdit && (
        <Link
          href={`/admin/posts/${post._id}/edit`}
          aria-label="Edit"
          className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}
      {canTogglePublish && (
        <button
          type="button"
          onClick={onToggleStatus}
          className="font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground"
        >
          {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
        </button>
      )}
      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete"
          className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
