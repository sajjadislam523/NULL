/**
 * Development seed data (§45): one admin, one editor, one author,
 * several categories, several posts spanning DRAFT/PUBLISHED/UNPUBLISHED
 * and 0/1/many images (to exercise the gallery rendering rules).
 *
 * Gated behind ALLOW_SEED=true so it can't accidentally wipe a non-dev
 * database — see .env.example. Run with `pnpm seed`.
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User, type UserRole } from "@/models/User";
import { Category } from "@/models/Category";
import { Post, type PostStatus } from "@/models/Post";
import { slugify } from "@/lib/utils/slug";
import mongoose from "mongoose";

if (process.env.ALLOW_SEED !== "true") {
  console.error(
    "Refusing to seed: set ALLOW_SEED=true in your env to confirm this is a development database.",
  );
  process.exit(1);
}

function paragraph(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}
function heading(level: number, text: string) {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] };
}
function bulletList(items: string[]) {
  return {
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [paragraph(item)],
    })),
  };
}
function blockquote(text: string) {
  return { type: "blockquote", content: [paragraph(text)] };
}
function doc(...content: object[]) {
  return { type: "doc", content };
}

const FAKE_PASSWORD = "dev-password-123";

const USERS: Array<{ name: string; email: string; role: UserRole }> = [
  { name: "Ada Command", email: "admin@null.dev", role: "ADMIN" },
  { name: "Edie Torres", email: "editor@null.dev", role: "EDITOR" },
  { name: "Author Kim", email: "author@null.dev", role: "AUTHOR" },
];

const CATEGORIES = [
  { name: "Development", description: "Code, architecture, and the craft of building things." },
  { name: "Design", description: "Visual systems, typography, and editorial composition." },
  { name: "Technology", description: "Tools, platforms, and where things are headed." },
  { name: "Thoughts", description: "Observations that don't fit anywhere else." },
];

const PICSUM = (seed: string, w = 1600, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  await connectDB();

  console.log("Wiping existing User/Post/Category collections (dev seed)...");
  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Category.deleteMany({})]);

  const passwordHash = await bcrypt.hash(FAKE_PASSWORD, 12);
  const users = await User.insertMany(
    USERS.map((u) => ({ ...u, passwordHash, status: "ACTIVE" })),
  );
  const [admin, editor, author] = users;

  const categories = await Category.insertMany(
    CATEGORIES.map((c) => ({ ...c, slug: slugify(c.name) })),
  );

  type SeedPost = {
    title: string;
    excerpt: string;
    body: object;
    category: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    tags: string[];
    status: PostStatus;
    images: string[];
    coverImage?: string;
    publishedAt?: Date;
  };

  const posts: SeedPost[] = [
    {
      title: "Building a CMS Without Making It Boring",
      excerpt:
        "Most content platforms default to generic dashboards. Here's what it takes to make one feel intentional instead.",
      body: doc(
        heading(2, "Start with restraint"),
        paragraph(
          "A monochrome interface has nowhere to hide a bad decision. Every border, every spacing choice has to earn its place.",
        ),
        paragraph(
          "The temptation with any admin surface is to reach for a component library and call it done. That's how you end up with something that looks like every other SaaS dashboard.",
        ),
        bulletList([
          "Typography carries more weight than color ever could.",
          "Whitespace is a design decision, not empty space to fill.",
          "Motion should be felt, not noticed.",
        ]),
        blockquote("Precision is a design language on its own."),
      ),
      category: categories[0]._id,
      author: author._id,
      tags: ["cms", "architecture", "design-systems"],
      status: "PUBLISHED",
      images: [],
      coverImage: PICSUM("cms-boring"),
      publishedAt: new Date("2026-09-12T09:00:00Z"),
    },
    {
      title: "A Field Guide to Editorial Grids",
      excerpt: "Grid systems borrowed from print still hold up on screen — if you resist the urge to fill every cell.",
      body: doc(
        paragraph(
          "Print designers spent a century figuring out how to organize dense information without it feeling dense. Most of that knowledge translates directly to the web.",
        ),
        heading(2, "Asymmetry is not chaos"),
        paragraph(
          "A grid with intentional imbalance reads as more considered than one that's perfectly even — as long as the imbalance repeats.",
        ),
      ),
      category: categories[1]._id,
      author: editor._id,
      tags: ["grids", "typography"],
      status: "PUBLISHED",
      images: [PICSUM("editorial-grid-1"), PICSUM("editorial-grid-2"), PICSUM("editorial-grid-3")],
      coverImage: PICSUM("editorial-grid-cover"),
      publishedAt: new Date("2026-09-10T09:00:00Z"),
    },
    {
      title: "Notes on Server Components, Six Months In",
      excerpt: "What changed about how we think about the client/server boundary, and what still feels unsettled.",
      body: doc(
        paragraph(
          "The mental model takes longer to click than the migration itself. Once it does, most components have an obvious default.",
        ),
        heading(2, "Where it still gets messy"),
        paragraph("Anything stateful that needs to cross the boundary still requires real thought about where the line goes."),
      ),
      category: categories[0]._id,
      author: admin._id,
      tags: ["nextjs", "react", "server-components"],
      status: "PUBLISHED",
      images: [PICSUM("server-components")],
      coverImage: PICSUM("server-components-cover"),
      publishedAt: new Date("2026-09-05T09:00:00Z"),
    },
    {
      title: "Why Most 'Futuristic' UI Ages Badly",
      excerpt: "Neon and glow date faster than almost any other aesthetic choice. Precision doesn't.",
      body: doc(
        paragraph("Look back at anything marketed as futuristic ten years ago. Most of it now reads as dated, not ahead of its time."),
        paragraph("What holds up is restraint: typography, grid, and composition choices that were never trying to look like the future in the first place."),
      ),
      category: categories[3]._id,
      author: author._id,
      tags: ["design", "opinion"],
      status: "DRAFT",
      images: [],
    },
    {
      title: "An Early Draft About Nothing in Particular",
      excerpt: "Placeholder excerpt for an unpublished post.",
      body: doc(paragraph("This post is intentionally unfinished — it exists to exercise the DRAFT/UNPUBLISHED states.")),
      category: categories[2]._id,
      author: editor._id,
      tags: ["misc"],
      status: "UNPUBLISHED",
      images: [],
    },
  ];

  await Post.create(
    posts.map((p) => ({
      title: p.title,
      slug: slugify(p.title),
      excerpt: p.excerpt,
      content: p.body,
      coverImage: p.coverImage,
      images: p.images,
      category: p.category,
      author: p.author,
      tags: p.tags,
      status: p.status,
      publishedAt: p.publishedAt,
    })),
  );

  console.log("\nSeeded:");
  console.log(`  ${users.length} users, ${categories.length} categories, ${posts.length} posts`);
  console.log("\nDev credentials (fake — do not reuse anywhere real):");
  for (const u of USERS) {
    console.log(`  ${u.role.padEnd(7)} ${u.email} / ${FAKE_PASSWORD}`);
  }
}

main()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  });
