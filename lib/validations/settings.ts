import { z } from "zod";

export const settingsSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required").max(120),
  siteDescription: z.string().max(400),
  authorName: z.string().max(120).optional().or(z.literal("")),
  authorBio: z.string().max(1000).optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        label: z.string().min(1).max(40),
        url: z.string().url(),
      }),
    )
    .max(10),
  seoDefaultTitle: z.string().max(120),
  seoDefaultDescription: z.string().max(300),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
