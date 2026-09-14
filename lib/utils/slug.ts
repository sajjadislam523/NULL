/**
 * Pure title -> slug conversion (§18: auto-generated from title,
 * manually editable). Uniqueness against existing DB records is a
 * separate, data-touching concern handled where posts/categories are
 * actually written (admin Server Actions, Phase 5).
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics left by NFKD
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
