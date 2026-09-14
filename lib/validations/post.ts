import { z } from "zod";
import { POST_STATUSES } from "@/lib/constants";
import { objectIdSchema, slugSchema } from "@/lib/validations/common";

/**
 * Tiptap/ProseMirror documents are deeply recursive and validated by the
 * editor itself client-side. Server-side we only need to guard the
 * envelope shape so a malformed payload can't reach the DB or crash the
 * plain-text/reading-time extraction — not reimplement Tiptap's full
 * node schema.
 *
 * Fields are required (no `.default()`) rather than optional-with-default:
 * mixing `.default()` with react-hook-form's zodResolver makes the
 * resolver's input type diverge from useForm's output type and fails to
 * typecheck. Callers (PostEditor, the Server Actions) always supply an
 * explicit `[]` instead.
 */
const tiptapDocSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.record(z.string(), z.unknown())),
});

const imageUrlSchema = z.string().url("Must be a valid image URL");

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  excerpt: z.string().min(1, "Excerpt is required").max(400),
  content: tiptapDocSchema,
  coverImage: imageUrlSchema.optional().or(z.literal("")),
  images: z.array(imageUrlSchema).max(30, "Too many images"),
  category: objectIdSchema,
  tags: z.array(z.string().min(1).max(40)).max(20, "Too many tags"),
  author: objectIdSchema,
  status: z.enum(POST_STATUSES),
  publishedAt: z.coerce.date().optional(),
});
export type PostInput = z.infer<typeof postSchema>;

/**
 * Same shape minus `publishedAt`: `z.coerce.date()` has a different
 * input type (effectively `unknown`) than its `Date` output type, which
 * fails to typecheck against react-hook-form's zodResolver no matter
 * what useForm's generic is set to. PostEditor manages that one field as
 * plain local state instead and merges it back in right before calling
 * the Server Action, which validates the full postSchema (including
 * publishedAt) server-side regardless.
 */
export const postFormSchema = postSchema.omit({ publishedAt: true });
export type PostFormInput = z.infer<typeof postFormSchema>;
