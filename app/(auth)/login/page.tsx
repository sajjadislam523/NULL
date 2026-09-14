import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { safeRedirect } from "@/lib/utils/safe-redirect";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { FadeIn } from "@/components/motion/FadeIn";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "NULL / ACCESS" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <FadeIn className="w-full max-w-sm space-y-8">
        <div className="space-y-2">
          <TechnicalLabel>NULL / ACCESS</TechnicalLabel>
          <h1 className="text-3xl">Welcome back.</h1>
        </div>
        <LoginForm callbackUrl={safeRedirect(callbackUrl, "/admin")} />
      </FadeIn>
    </main>
  );
}
