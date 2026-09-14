"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, KeyRound } from "lucide-react";
import {
  createUser,
  updateUserRole,
  updateUserStatus,
  updateUserProfile,
  changeUserPassword,
} from "@/app/admin/users/actions";
import {
  createUserSchema,
  type CreateUserInput,
  updateUserProfileSchema,
  type UpdateUserProfileInput,
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/user";
import { USER_ROLES, type UserRole, type UserStatus } from "@/lib/constants";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { Metadata } from "@/components/decorative/Metadata";

export interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
}

export function UserTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [resettingUser, setResettingUser] = useState<UserRow | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> New User
        </Button>
      </div>

      {/* Desktop table */}
      <table className="hidden w-full border border-border text-left text-sm md:table">
        <thead>
          <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-foreground-secondary">
            <th className="px-6 py-3 font-normal">Name</th>
            <th className="px-4 py-3 font-normal">Email</th>
            <th className="px-4 py-3 font-normal">Role</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 font-normal">Last login</th>
            <th className="px-6 py-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRowDesktop
              key={u._id}
              user={u}
              isSelf={u._id === currentUserId}
              onEdit={() => setEditingUser(u)}
              onResetPassword={() => setResettingUser(u)}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile stacked cards */}
      <div className="space-y-3 md:hidden">
        {users.map((u) => (
          <UserRowMobile
            key={u._id}
            user={u}
            isSelf={u._id === currentUserId}
            onEdit={() => setEditingUser(u)}
            onResetPassword={() => setResettingUser(u)}
          />
        ))}
      </div>

      <CreateUserDialog open={creating} onClose={() => setCreating(false)} />
      {editingUser && <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} />}
      {resettingUser && <ResetPasswordDialog user={resettingUser} onClose={() => setResettingUser(null)} />}
    </div>
  );
}

function useUserRowActions(user: UserRow) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function changeRole(role: UserRole) {
    startTransition(async () => {
      const result = await updateUserRole(user._id, { role });
      setError(result.success ? null : result.error);
    });
  }

  function toggleStatus() {
    const next: UserStatus = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    startTransition(async () => {
      const result = await updateUserStatus(user._id, { status: next });
      setError(result.success ? null : result.error);
    });
  }

  return { error, isPending, changeRole, toggleStatus };
}

interface RowActionProps {
  user: UserRow;
  isSelf: boolean;
  onEdit: () => void;
  onResetPassword: () => void;
}

function UserRowDesktop({ user, isSelf, onEdit, onResetPassword }: RowActionProps) {
  const { error, isPending, changeRole, toggleStatus } = useUserRowActions(user);

  return (
    <tr className="border-b border-border align-top">
      <td className="px-6 py-3 text-foreground">
        {user.name} {isSelf && <span className="text-foreground-secondary">(you)</span>}
      </td>
      <td className="px-4 py-3 text-foreground-secondary">{user.email}</td>
      <td className="px-4 py-3">
        <Select
          value={user.role}
          disabled={isPending || (isSelf && user.role === "ADMIN")}
          onChange={(e) => changeRole(e.target.value as UserRole)}
          className="w-32"
        >
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </td>
      <td className="px-4 py-3">
        <Badge variant={user.status === "ACTIVE" ? "solid" : "outline"}>{user.status}</Badge>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-foreground-secondary">
        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit"
            className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onResetPassword}
            aria-label="Reset password"
            className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
          >
            <KeyRound className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleStatus}
            disabled={isPending || isSelf}
            className="font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground disabled:opacity-40"
          >
            {user.status === "ACTIVE" ? "Disable" : "Enable"}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-foreground-secondary">{error}</p>}
      </td>
    </tr>
  );
}

function UserRowMobile({ user, isSelf, onEdit, onResetPassword }: RowActionProps) {
  const { error, isPending, changeRole, toggleStatus } = useUserRowActions(user);

  return (
    <div className="space-y-3 rounded-sm border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-foreground">
            {user.name} {isSelf && <span className="text-foreground-secondary">(you)</span>}
          </div>
          <Metadata items={[user.email]} className="mt-1" />
        </div>
        <Badge variant={user.status === "ACTIVE" ? "solid" : "outline"}>{user.status}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={user.role}
          disabled={isPending || (isSelf && user.role === "ADMIN")}
          onChange={(e) => changeRole(e.target.value as UserRole)}
          className="w-32"
        >
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit"
          className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onResetPassword}
          aria-label="Reset password"
          className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
        >
          <KeyRound className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={toggleStatus}
          disabled={isPending || isSelf}
          className="font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground disabled:opacity-40"
        >
          {user.status === "ACTIVE" ? "Disable" : "Enable"}
        </button>
      </div>
      {error && <p className="text-xs text-foreground-secondary">{error}</p>}
    </div>
  );
}

function CreateUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "AUTHOR" },
  });

  async function onSubmit(data: CreateUserInput) {
    setServerError(null);
    const result = await createUser(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="New user">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="user-name">
            <TechnicalLabel>Name</TechnicalLabel>
          </label>
          <Input id="user-name" {...register("name")} />
          {errors.name && <p className="text-xs text-foreground-secondary">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="user-email">
            <TechnicalLabel>Email</TechnicalLabel>
          </label>
          <Input id="user-email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-foreground-secondary">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="user-password">
            <TechnicalLabel>Password</TechnicalLabel>
          </label>
          <Input id="user-password" type="password" {...register("password")} />
          {errors.password && <p className="text-xs text-foreground-secondary">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="user-role">
            <TechnicalLabel>Role</TechnicalLabel>
          </label>
          <Select id="user-role" {...register("role")}>
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function EditUserDialog({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserProfileInput>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  async function onSubmit(data: UpdateUserProfileInput) {
    setServerError(null);
    const result = await updateUserProfile(user._id, data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    onClose();
  }

  return (
    <Dialog open onClose={onClose} title="Edit user">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="edit-name">
            <TechnicalLabel>Name</TechnicalLabel>
          </label>
          <Input id="edit-name" {...register("name")} />
          {errors.name && <p className="text-xs text-foreground-secondary">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="edit-email">
            <TechnicalLabel>Email</TechnicalLabel>
          </label>
          <Input id="edit-email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-foreground-secondary">{errors.email.message}</p>}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function ResetPasswordDialog({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "" },
  });

  async function onSubmit(data: ChangePasswordInput) {
    setServerError(null);
    const result = await changeUserPassword(user._id, data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    onClose();
  }

  return (
    <Dialog open onClose={onClose} title={`Reset password — ${user.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reset-password">
            <TechnicalLabel>New password</TechnicalLabel>
          </label>
          <Input id="reset-password" type="password" autoComplete="new-password" {...register("password")} />
          {errors.password && <p className="text-xs text-foreground-secondary">{errors.password.message}</p>}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Set password"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
