# NULL /

A monochrome digital journal for ideas, experiments, technology, design, and things worth thinking about — built as a premium editorial publication, not a generic blog starter or a SaaS dashboard.

**Live:** [null-six-tau.vercel.app](https://null-six-tau.vercel.app)

## Contents

- [Features](#features)
- [Stack](#stack)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Seed data](#seed-data)
- [Roles & permissions](#roles--permissions)
- [Authentication](#authentication)
- [Image storage](#image-storage)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Project structure](#project-structure)

## Features

- **Editorial public site** — homepage with a featured article, blog listing with category filters, category pages, and full article pages with a reading-progress indicator
- **Adaptive article gallery** — 0 images renders nothing, 1 renders a large editorial image, more than 1 renders a responsive asymmetric gallery with a keyboard- and touch-navigable lightbox
- **Search** — a Cmd/Ctrl+K overlay plus a standalone `/search` page, both backed by MongoDB text search
- **Admin CMS** ("NULL / COMMAND") — dashboard, full post CRUD with a Tiptap rich-text editor and live Editor|Preview split, category management with a delete-guard against orphaned posts, user management, and site settings
- **Cloudinary image pipeline** — cover images and drag-to-reorder galleries upload directly from the browser via short-lived signed uploads; image bytes never touch the Next.js server
- **Role-based access control** — enforced server-side on every mutation and every page, never by hiding a UI button (see [Roles & permissions](#roles--permissions))
- **SEO-complete** — per-page canonical URLs, Open Graph/Twitter metadata, JSON-LD article markup, a dynamic `sitemap.xml`, and `robots.txt`
- **Single fixed monochrome theme** — no light/dark toggle, no per-post colors; the "futuristic" feel comes from typography, grid, whitespace, and restrained motion, not neon or glassmorphism

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- MongoDB + Mongoose
- Auth.js / NextAuth v4 (Credentials provider, JWT sessions)
- Framer Motion
- Zod (server-side validation on every mutation)
- React Hook Form
- Lucide React
- Tiptap (rich text editor)
- Cloudinary (image storage)
- dnd-kit (gallery reordering)

## Requirements

- Node.js 20+
- pnpm
- Docker (for local MongoDB) — or your own MongoDB connection string

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill it in — see below
docker compose up -d         # local MongoDB
pnpm seed                    # dev users, categories, posts
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at `/admin` (redirects to `/login` if you're not signed in).

## Environment variables

| Variable | Description |
| -------- | ------------ |
| `MONGODB_URI` | MongoDB connection string. `docker-compose.yml` runs a local instance on port **27018** (not 27017, to avoid colliding with another local MongoDB). |
| `NEXTAUTH_SECRET` | Session signing secret. Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | The app's own URL (`http://localhost:3000` in dev). |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for canonical links, Open Graph, and `sitemap.xml`. Set to the real production domain when deploying. |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for cover/gallery image uploads. Without these, the upload endpoint returns a clear 503 rather than failing silently — everything else in the app works fine. |
| `ALLOW_SEED` | Safety switch the seed script checks before running, so it can't accidentally wipe a non-dev database. Only set this in development. |

## Database setup

Start the local MongoDB container:

```bash
docker compose up -d
```

This persists data in a named Docker volume, so it survives restarts. To reset it completely: `docker compose down -v`.

If you'd rather use MongoDB Atlas or another instance, just point `MONGODB_URI` at it — Docker Compose is optional.

## Seed data

```bash
pnpm seed
```

Wipes and reseeds the `User`, `Post`, and `Category` collections with one admin, one editor, one author, four categories, and five posts spanning `DRAFT`/`PUBLISHED`/`UNPUBLISHED` and 0/1/many images (to exercise the gallery rendering rules). Prints the seeded accounts' credentials on completion — all clearly fake, never reuse them anywhere real.

## Roles & permissions

RBAC is enforced server-side in every Server Action (`lib/permissions`) and on every page — never by hiding a button in the UI.

| | ADMIN | EDITOR | AUTHOR |
| --- | --- | --- | --- |
| Create / edit own posts | ✅ | ✅ | ✅ |
| Edit / delete *any* post | ✅ | ✅ | ❌ (own only) |
| Publish / unpublish | ✅ | ✅ | ❌ |
| Manage categories | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Manage site settings | ✅ | ❌ | ❌ |

## Authentication

Email/password via NextAuth's Credentials provider, JWT sessions (not database sessions — see the comment in `lib/auth/options.ts` for why: NextAuth refuses database sessions with a Credentials-only provider). The `jwt` callback re-validates the user against MongoDB on every session check, so disabling a user or changing their role takes effect on their very next request, without needing to wait out the session's `maxAge`.

There's no public sign-up — accounts are created by an admin from `/admin/users`.

## Image storage

Cover images and article galleries upload directly from the browser to Cloudinary via a short-lived signed upload (`/api/cloudinary/sign`) — image bytes never pass through the Next.js server. Requires the three `CLOUDINARY_*` env vars above.

## Scripts

```bash
pnpm dev        # development server
pnpm build      # production build
pnpm start      # run the production build
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
pnpm seed       # reseed the database (dev only)
```

## Deployment

Deployed on Vercel. To deploy your own copy:

1. Provision a MongoDB instance (Atlas or self-hosted).
2. `vercel link` to connect this directory to a Vercel project.
3. Set the production environment variables in the Vercel dashboard (or `vercel env add <NAME> production`): `MONGODB_URI`, `NEXTAUTH_SECRET` (a fresh one, not the dev value), `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` (the real assigned domain), and the three `CLOUDINARY_*` variables. Do **not** set `ALLOW_SEED`.
4. `vercel --prod` to build and deploy.
5. Seed the production database once, from a machine with `MONGODB_URI` pointed at it and `ALLOW_SEED=true` set only in that local environment — never on Vercel itself.

## Project structure

```text
app/                    # page.tsx, blog/, blog/[slug]/, category/[slug]/, search/, about/, (auth)/login/
app/admin/              # layout.tsx + dashboard, posts/, users/, categories/, settings/
components/{ui,layout,blog,admin,editor,motion,decorative}/
lib/{db,auth,permissions,validations,utils}/
models/{User,Post,Category,Settings}.ts
types/
```

See `CLAUDE.md` for the full architectural constraints this project follows.
