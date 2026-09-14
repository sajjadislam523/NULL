import { forbidden } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { canManageCategories } from "@/lib/permissions";
import { getCategories, getCategoryPostCounts } from "@/lib/db/categories";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { CategoryManager, type CategoryRow } from "@/components/admin/CategoryManager";

export const metadata = { title: "NULL / COMMAND — Categories" };

export default async function AdminCategoriesPage() {
  const user = await requireUser();
  if (!canManageCategories(user.role)) forbidden();

  const [categories, counts] = await Promise.all([getCategories(), getCategoryPostCounts()]);

  const rows: CategoryRow[] = categories.map((c) => ({
    _id: String(c._id),
    name: c.name,
    slug: c.slug,
    description: c.description,
    postCount: counts.get(String(c._id)) ?? 0,
  }));

  return (
    <div className="space-y-6 px-6 py-10">
      <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
      <h1 className="text-2xl">Categories</h1>
      <CategoryManager categories={rows} />
    </div>
  );
}
