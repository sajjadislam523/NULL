"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, Plus } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/categories/actions";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { slugify } from "@/lib/utils/slug";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { Metadata } from "@/components/decorative/Metadata";

export interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      <div className="divide-y divide-border border border-border">
        {categories.length === 0 && (
          <p className="px-6 py-12 text-sm text-foreground-secondary">No categories yet.</p>
        )}
        {categories.map((c) => (
          <div key={c._id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <div className="text-foreground">{c.name}</div>
              <Metadata items={[`/${c.slug}`, `${c.postCount} post${c.postCount === 1 ? "" : "s"}`]} className="mt-1" />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(c)}
                aria-label="Edit"
                className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(c)}
                aria-label="Delete"
                className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CategoryFormDialog
        open={creating}
        onClose={() => setCreating(false)}
        title="New category"
        onSubmitAction={createCategory}
      />
      {editing && (
        <CategoryFormDialog
          open={!!editing}
          onClose={() => setEditing(null)}
          title="Edit category"
          defaultValues={editing}
          onSubmitAction={(input) => updateCategory(editing._id, input)}
        />
      )}
      {deleteTarget && (
        <DeleteCategoryDialog
          category={deleteTarget}
          otherCategories={categories.filter((c) => c._id !== deleteTarget._id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function CategoryFormDialog({
  open,
  onClose,
  title,
  defaultValues,
  onSubmitAction,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  defaultValues?: CategoryInput;
  onSubmitAction: (input: CategoryInput) => Promise<{ success: boolean; error?: string }>;
}) {
  const [slugTouched, setSlugTouched] = useState(!!defaultValues);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { name: "", slug: "", description: "" },
  });

  const name = watch("name");

  async function onSubmit(data: CategoryInput) {
    setServerError(null);
    const result = await onSubmitAction(data);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong.");
      return;
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="cat-name">
            <TechnicalLabel>Name</TechnicalLabel>
          </label>
          <Input
            id="cat-name"
            {...register("name", {
              onChange: (e) => {
                if (!slugTouched) setValue("slug", slugify(e.target.value));
              },
            })}
          />
          {errors.name && <p className="text-xs text-foreground-secondary">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cat-slug">
            <TechnicalLabel>Slug</TechnicalLabel>
          </label>
          <Input id="cat-slug" {...register("slug", { onChange: () => setSlugTouched(true) })} />
          {errors.slug && <p className="text-xs text-foreground-secondary">{errors.slug.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cat-description">
            <TechnicalLabel>Description</TechnicalLabel>
          </label>
          <Textarea id="cat-description" rows={3} {...register("description")} />
        </div>
        {serverError && (
          <p role="alert" className="text-sm text-foreground-secondary">
            {serverError}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !name}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function DeleteCategoryDialog({
  category,
  otherCategories,
  onClose,
}: {
  category: CategoryRow;
  otherCategories: CategoryRow[];
  onClose: () => void;
}) {
  const [reassignTo, setReassignTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const needsReassignment = category.postCount > 0;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategory(category._id, reassignTo || undefined);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onClose();
    });
  }

  return (
    <Dialog open onClose={onClose} title="Delete category?">
      <div className="space-y-4">
        <p className="text-sm text-foreground-secondary">
          {needsReassignment
            ? `${category.postCount} post${category.postCount === 1 ? "" : "s"} use "${category.name}". Choose a category to reassign them to before deleting.`
            : `"${category.name}" will be permanently deleted.`}
        </p>
        {needsReassignment && (
          <Select value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
            <option value="" disabled>
              Select a category
            </option>
            {otherCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
        )}
        {error && (
          <p role="alert" className="text-sm text-foreground-secondary">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isPending || (needsReassignment && !reassignTo)}>
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
