import { Schema, model, models, type Types } from "mongoose";
import { calculateReadingTime, extractPlainText } from "@/lib/utils/tiptap";
import { POST_STATUSES, type PostStatus } from "@/lib/constants";

export { POST_STATUSES, type PostStatus };

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  /** Tiptap/ProseMirror JSON document — source of truth for the article body. */
  content: unknown;
  /** Plain-text extraction of `content`, kept in sync via a pre-save hook, used only for search indexing. */
  contentText: string;
  coverImage?: string;
  images: string[];
  category: Types.ObjectId;
  tags: string[];
  author: Types.ObjectId;
  status: PostStatus;
  publishedAt?: Date;
  /** Minutes, computed automatically from content (§18) — not a manual field. */
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: { type: String, required: true, trim: true },
    content: { type: Schema.Types.Mixed, required: true },
    contentText: { type: String, default: "" },
    coverImage: { type: String },
    images: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: POST_STATUSES, required: true, default: "DRAFT" },
    publishedAt: { type: Date },
    readingTime: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

// Mongoose 9's 'save' pre-hook has no `next` callback — it resolves when
// the function returns (or its returned promise settles).
postSchema.pre("save", function () {
  if (this.isModified("content")) {
    this.contentText = extractPlainText(this.content);
    this.readingTime = calculateReadingTime(this.content);
  }
});

// Minimum indexes per CLAUDE.md §"Data models": slug (unique, above),
// status, publishedAt, category — plus a compound index for the
// PUBLISHED-sorted-by-date query the public blog listing runs constantly,
// and a text index backing search (§30).
postSchema.index({ status: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ title: "text", excerpt: "text", contentText: "text", tags: "text" });

export const Post = models.Post ?? model<IPost>("Post", postSchema);
