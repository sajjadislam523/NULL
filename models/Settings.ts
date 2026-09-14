import { Schema, model, models, type Types } from "mongoose";

/**
 * Singleton document (§34) — site title/description/author/social/SEO
 * defaults. Not one of PROMPT.md's three named models, but required to
 * implement the settings feature it describes. Always accessed via
 * lib/db/settings.ts's getSettings()/updateSettings(), which enforce the
 * single-document convention rather than callers hand-rolling a query.
 */
export interface ISettings {
  _id: Types.ObjectId;
  siteTitle: string;
  siteDescription: string;
  authorName: string;
  authorBio: string;
  socialLinks: { label: string; url: string }[];
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    siteTitle: { type: String, required: true, default: "NULL /" },
    siteDescription: {
      type: String,
      required: true,
      default:
        "A monochrome digital journal for ideas, experiments, technology, design, and things worth thinking about.",
    },
    authorName: { type: String, default: "" },
    authorBio: { type: String, default: "" },
    socialLinks: {
      type: [{ label: { type: String, required: true }, url: { type: String, required: true } }],
      default: [],
    },
    seoDefaultTitle: { type: String, default: "NULL /" },
    seoDefaultDescription: { type: String, default: "" },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

export const Settings = models.Settings ?? model<ISettings>("Settings", settingsSchema);
