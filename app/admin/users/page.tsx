import { forbidden } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/permissions";
import { getUsers } from "@/lib/db/users";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { UserTable, type UserRow } from "@/components/admin/UserTable";

export const metadata = { title: "NULL / COMMAND — Users" };

export default async function AdminUsersPage() {
  const user = await requireUser();
  if (!canManageUsers(user.role)) forbidden();

  const users = await getUsers();

  const rows: UserRow[] = users.map((u) => ({
    _id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6 px-6 py-10">
      <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
      <h1 className="text-2xl">Users</h1>
      <UserTable users={rows} currentUserId={user.id} />
    </div>
  );
}
