"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { updateSettings } from "@/app/admin/settings/actions";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { SectionMarker } from "@/components/decorative/SectionMarker";

export function SettingsForm({ defaultValues }: { defaultValues: SettingsInput }) {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });

  async function onSubmit(data: SettingsInput) {
    setStatus("idle");
    setError(null);
    const result = await updateSettings(data);
    if (!result.success) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-10">
      <section className="space-y-4">
        <SectionMarker>SITE</SectionMarker>
        <div className="space-y-1.5">
          <label htmlFor="siteTitle">
            <TechnicalLabel>Site title</TechnicalLabel>
          </label>
          <Input id="siteTitle" {...register("siteTitle")} />
          {errors.siteTitle && <p className="text-xs text-foreground-secondary">{errors.siteTitle.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="siteDescription">
            <TechnicalLabel>Site description</TechnicalLabel>
          </label>
          <Textarea id="siteDescription" rows={3} {...register("siteDescription")} />
        </div>
      </section>

      <section className="space-y-4">
        <SectionMarker>AUTHOR</SectionMarker>
        <div className="space-y-1.5">
          <label htmlFor="authorName">
            <TechnicalLabel>Name</TechnicalLabel>
          </label>
          <Input id="authorName" {...register("authorName")} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="authorBio">
            <TechnicalLabel>Bio</TechnicalLabel>
          </label>
          <Textarea id="authorBio" rows={4} {...register("authorBio")} />
        </div>
      </section>

      <section className="space-y-4">
        <SectionMarker>SOCIAL LINKS</SectionMarker>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input placeholder="Label" {...register(`socialLinks.${i}.label`)} className="w-32" />
              <Input placeholder="https://…" {...register(`socialLinks.${i}.url`)} />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove"
                className="text-foreground-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => append({ label: "", url: "" })}>
          <Plus className="h-4 w-4" /> Add link
        </Button>
      </section>

      <section className="space-y-4">
        <SectionMarker>SEO DEFAULTS</SectionMarker>
        <div className="space-y-1.5">
          <label htmlFor="seoDefaultTitle">
            <TechnicalLabel>Default title</TechnicalLabel>
          </label>
          <Input id="seoDefaultTitle" {...register("seoDefaultTitle")} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="seoDefaultDescription">
            <TechnicalLabel>Default description</TechnicalLabel>
          </label>
          <Textarea id="seoDefaultDescription" rows={3} {...register("seoDefaultDescription")} />
        </div>
      </section>

      {status === "saved" && <p className="text-sm text-foreground-secondary">Saved.</p>}
      {status === "error" && (
        <p role="alert" className="text-sm text-foreground-secondary">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
