import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/utils/slug";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(200)
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and hyphens only");
