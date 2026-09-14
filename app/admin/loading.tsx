import { Skeleton } from "@/components/ui/Skeleton";

/**
 * A loading.tsx creates a Suspense boundary that wraps every nested route
 * below it, not just its own page — which prevents a descendant's
 * notFound() (e.g. /admin/posts/[id]/edit for a deleted post) from
 * sending a real 404 status (it can only affect the UI, not a status
 * already committed to 200 by the stream). That distinction is kept for
 * /blog/[slug] since it's public and SEO-indexed; here under /admin it's
 * disallowed in robots.txt and auth-gated, so the wire status code has no
 * practical audience and the loading skeleton is worth keeping.
 */
export default function AdminDashboardLoading() {
  return (
    <div className="space-y-10 px-6 py-10">
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 bg-background p-6">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="space-y-px border border-border bg-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-background px-6 py-4">
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
