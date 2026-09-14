import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-background text-foreground md:flex-row flex-col">
      <AdminSidebar role={user.role} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
