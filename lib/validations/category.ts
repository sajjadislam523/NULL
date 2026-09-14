import { z } from "zod";
import { slugSchema } from "@/lib/validations/common";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: slugSchema,
  description: z.string().max(500).optional().or(z.literal("")),
});
export type CategoryInput = z.infer<typeof categorySchema>;
