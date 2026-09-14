import { forbidden } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { canManageSettings } from "@/lib/permissions";
import { getSettings } from "@/lib/db/settings";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "NULL / COMMAND — Settings" };

export default async function AdminSettingsPage() {
  const user = await requireUser();
  if (!canManageSettings(user.role)) forbidden();

  const settings = await getSettings();

  return (
    <div className="space-y-6 px-6 py-10">
      <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
      <h1 className="text-2xl">Settings</h1>
      <SettingsForm
        defaultValues={{
          siteTitle: settings.siteTitle,
          siteDescription: settings.siteDescription,
          authorName: settings.authorName,
          authorBio: settings.authorBio,
          socialLinks: settings.socialLinks,
          seoDefaultTitle: settings.seoDefaultTitle,
          seoDefaultDescription: settings.seoDefaultDescription,
        }}
      />
    </div>
  );
}
