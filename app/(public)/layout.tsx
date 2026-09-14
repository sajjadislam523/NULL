import type { ReactNode } from "react";
import { getSettings } from "@/lib/db/settings";
import { PublicShell } from "@/components/layout/PublicShell";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <PublicShell siteTitle={settings.siteTitle} socialLinks={settings.socialLinks}>
      {children}
    </PublicShell>
  );
}
