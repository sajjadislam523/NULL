"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { postFormSchema, type PostFormInput, type PostInput } from "@/lib/validations/post";
import { slugify } from "@/lib/utils/slug";
import { calculateReadingTime } from "@/lib/utils/tiptap";
import { createPost, updatePost } from "@/app/admin/posts/actions";
import { canPublish } from "@/lib/permissions";
import { POST_STATUSES, type UserRole } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { Metadata } from "@/components/decorative/Metadata";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ArticleContent } from "@/components/blog/ArticleContent";

const EMPTY_DOC: PostInput["content"] = { type: "doc", content: [{ type: "paragraph" }] };

type PostDefaultValues = Partial<PostFormInput> & { publishedAt?: string };

interface PostEditorProps {
  mode: "create" | "edit";
  postId?: string;
  currentUser: { id: string; role: UserRole };
  categories: { _id: string; name: string }[];
  authors: { _id: string; name: string }[];
  defaultValues?: PostDefaultValues;
}

export function PostEditor({ mode, postId, currentUser, categories, authors, defaultValues }: PostEditorProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"editor" | "preview">("editor");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [serverError, setServerError] = useState<string | null>(null);
  // Native <input type="date"> wants a "YYYY-MM-DD" string, but PostInput's
  // publishedAt is a Date (via z.coerce.date()) — kept outside react-hook-form's
  // typed fields to avoid fighting that coercion typing, merged back in on submit.
  const { publishedAt: defaultPublishedAt, ...formDefaultValues } = defaultValues ?? {};
  const [publishedAtInput, setPublishedAtInput] = useState(defaultPublishedAt ?? "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInput>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: EMPTY_DOC,
      coverImage: "",
      images: [],
      category: categories[0]?._id ?? "",
      tags: [],
      author: currentUser.id,
      status: "DRAFT",
      ...formDefaultValues,
    },
  });

  const content = watch("content");
  const coverImage = watch("coverImage") || "";
  const images = watch("images") || [];
  const tags = watch("tags") || [];
  const status = watch("status");
  const title = watch("title");
  const excerpt = watch("excerpt");
  const category = watch("category");

  const canSetPublished = canPublish(currentUser.role);
  const availableStatuses = canSetPublished ? POST_STATUSES : (["DRAFT"] as const);
  const categoryName = categories.find((c) => c._id === category)?.name ?? "";
  const readingTime = calculateReadingTime(content);

  async function onSubmit(data: PostFormInput) {
    setServerError(null);
    const payload = { ...data, publishedAt: publishedAtInput ? new Date(publishedAtInput) : undefined };
    const result = mode === "create" ? await createPost(payload) : await updatePost(postId!, payload);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
          <h1 className="text-2xl">{mode === "create" ? "New Post" : "Edit Post"}</h1>
        </div>
        <div className="flex items-center gap-1 rounded-sm border border-border p-1 lg:hidden">
          <button
            type="button"
            onClick={() => setTab("editor")}
            className={`rounded-xs px-3 py-1 text-sm ${tab === "editor" ? "bg-surface text-foreground" : "text-foreground-secondary"}`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-xs px-3 py-1 text-sm ${tab === "preview" ? "bg-surface text-foreground" : "text-foreground-secondary"}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className={tab === "editor" ? "space-y-6" : "hidden space-y-6 lg:block"}>
          <div className="space-y-1.5">
            <label htmlFor="title">
              <TechnicalLabel>Title</TechnicalLabel>
            </label>
            <Input
              id="title"
              {...register("title", {
                onChange: (e) => {
                  if (!slugTouched) setValue("slug", slugify(e.target.value));
                },
              })}
            />
            {errors.title && <p className="text-xs text-foreground-secondary">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="slug">
              <TechnicalLabel>Slug</TechnicalLabel>
            </label>
            <Input id="slug" {...register("slug", { onChange: () => setSlugTouched(true) })} />
            {errors.slug && <p className="text-xs text-foreground-secondary">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="excerpt">
              <TechnicalLabel>Excerpt</TechnicalLabel>
            </label>
            <Textarea id="excerpt" rows={3} {...register("excerpt")} />
            {errors.excerpt && <p className="text-xs text-foreground-secondary">{errors.excerpt.message}</p>}
          </div>

          <div className="space-y-1.5">
            <TechnicalLabel>Content</TechnicalLabel>
            <RichTextEditor content={content} onChange={(json) => setValue("content", json as PostFormInput["content"])} />
          </div>

          <MediaUploader label="Cover image" images={coverImage ? [coverImage] : []} onChange={(v) => setValue("coverImage", v[0] ?? "")} />
          <MediaUploader label="Article gallery" images={images} onChange={(v) => setValue("images", v)} multiple max={30} />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="category">
                <TechnicalLabel>Category</TechnicalLabel>
              </label>
              <Select id="category" {...register("category")}>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {errors.category && <p className="text-xs text-foreground-secondary">{errors.category.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="status">
                <TechnicalLabel>Status</TechnicalLabel>
              </label>
              <Select id="status" {...register("status")}>
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {canSetPublished && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="author">
                  <TechnicalLabel>Author</TechnicalLabel>
                </label>
                <Select id="author" {...register("author")}>
                  {authors.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </Select>
              </div>
              {status === "PUBLISHED" && (
                <div className="space-y-1.5">
                  <label htmlFor="publishedAt">
                    <TechnicalLabel>Published date</TechnicalLabel>
                  </label>
                  <Input
                    id="publishedAt"
                    type="date"
                    value={publishedAtInput}
                    onChange={(e) => setPublishedAtInput(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <TechnicalLabel>Tags</TechnicalLabel>
            <TagInput value={tags} onChange={(v) => setValue("tags", v)} />
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-foreground-secondary">
              {serverError}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/admin/posts")}>
              Cancel
            </Button>
          </div>
        </div>

        <div className={tab === "preview" ? "" : "hidden lg:block"}>
          <div className="sticky top-6 space-y-4 border border-border p-6">
            <Metadata items={[categoryName, `${readingTime} MIN READ`]} />
            <h2 className="text-2xl text-foreground">{title || "Untitled"}</h2>
            {excerpt && <p className="text-foreground-secondary">{excerpt}</p>}
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="" className="w-full rounded-sm border border-border" />
            )}
            <ArticleContent content={content} className="mx-auto max-w-none pt-4" />
          </div>
        </div>
      </div>
    </form>
  );
}

function TagInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-xs border border-border px-2 py-0.5 font-mono text-xs text-foreground-secondary"
            >
              {tag}
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
          } else if (e.key === "Backspace" && !input && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        placeholder="Add a tag and press Enter"
      />
    </div>
  );
}
