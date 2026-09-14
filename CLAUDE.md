# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains **no implementation code** — only a build specification:

- `PROMPT.md` — the full build brief: product identity, design system, data models, RBAC, page-by-page requirements, and an implementation order (§53).
- `ARCHITECTURE.md` — a short top-level site map (public site / auth / CMS).

There is no existing application to preserve. When implementing, treat `PROMPT.md` as the source of truth and follow its §53 "Implementation Order" phase sequence: project setup → design system → database → authentication → admin/CMS → public site → responsive behavior → animation/polish → SEO/accessibility/performance. Do not jump straight to building individual pages before the design system and data models exist.

Once tooling exists (package.json, etc.), update this file with the actual dev/build/lint/test commands — none exist yet to document.

## Product identity

**NULL /** — a monochrome digital journal/CMS. The brand wordmark is `NULL /` (the slash is part of the identity), composed with suffixes throughout the UI: `NULL / WRITING`, `NULL / ABOUT`, `NULL / COMMAND` (admin), `NULL / ACCESS` (login). Avoid a generic "blog starter" look — the target feel is a premium editorial publication, not a SaaS dashboard or a cyberpunk theme.

"Futuristic" here means precision, typography, whitespace, grid, and restrained motion — explicitly **not** neon/glow/gradients/glassmorphism/particles (see PROMPT.md §57, the single most important design constraint).

## Tech stack (target)

- Next.js (App Router) + TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- Auth.js / NextAuth
- Framer Motion
- Zod for validation (server-side validation is required — never trust client-side validation alone)
- React Hook Form
- Lucide React icons
- Tiptap rich text editor

## Design system constraints

- **Single fixed theme only** — no light/dark toggle, no theme switcher, no per-post/per-article colors, ever. All color lives in centralized design tokens.
- Palette: background `#090909`, surface `#101010`, elevated surface `#151515`, border `#272727` / strong border `#3A3A3A`, text `#F2F2F2` (primary) / `#A0A0A0` (secondary) / `#626262` (muted).
- Two type families only: a grotesk/sans (e.g. Geist) for titles/body/nav/buttons, and a monospace (e.g. Geist Mono / JetBrains Mono) for dates, categories, reading time, indexes, and other technical metadata.
- Mostly square UI — default border radius 0–4px. Avoid turning every component into a rounded card.
- Reusable decorative primitives (`GridBackground`, `TechnicalLabel`, `IndexNumber`, `Metadata`, `StatusIndicator`, `SectionMarker`) belong in `components/decorative` and must stay subtle — never compete with content.

## Data models (Mongoose — conceptual shape from PROMPT.md §9-11)

- **User**: `name, email, passwordHash, avatar, role, status, lastLoginAt`. Roles: `ADMIN | EDITOR | AUTHOR`. Status: `ACTIVE | DISABLED`.
- **Post**: `title, slug, excerpt, content, coverImage, images[], category, tags, author, status, publishedAt, readingTime`. Status: `DRAFT | PUBLISHED | UNPUBLISHED`. Store image references/URLs only — never raw image data in MongoDB.
- **Category**: `name, slug, description`. Block deletion while posts reference it unless posts are reassigned or an admin explicitly confirms.
- Minimum indexes: `Post.slug`, `Post.status`, `Post.publishedAt`, `Post.category`, `User.email`, `Category.slug`.

## RBAC (must be enforced server-side — never rely on frontend button visibility)

- **ADMIN**: manage users, settings, categories; full post CRUD and publish/unpublish for all posts.
- **EDITOR**: create/edit/publish posts, manage categories; cannot manage users.
- **AUTHOR**: create posts and edit only their own drafts/posts; cannot manage users or touch other authors' posts.

Every privileged server operation (route handler or Server Action — pick one pattern and use it consistently) must check authentication, role, and resource ownership where applicable.

## Article gallery behavior (`Post.images[]`)

This is a deliberate feature, not an edge case to special-case away:
- 0 images → render nothing (no empty gallery placeholder).
- 1 image → render as a large editorial article image.
- >1 images → sophisticated responsive gallery (asymmetric grid on desktop, stacked vertical on mobile) with lightbox: next/prev, keyboard support, touch support, lazy loading, alt text.

## Target project structure (PROMPT.md §8)

```
app/                    # page.tsx, blog/, blog/[slug]/, category/[slug]/, search/, about/, login/
app/admin/              # layout.tsx + dashboard, posts/, users/, categories/, settings/
components/{ui,layout,blog,admin,editor,motion,decorative}/
lib/{db,auth,permissions,validations,utils}/
models/{User,Post,Category}.ts
types/
hooks/
```

## Architectural rules

- Server components by default; use client components only where interaction requires it (editor, search overlay/Cmd+K, mobile menu, lightbox, animated elements, interactive forms).
- Draft/unpublished posts must return a proper 404 on direct `/blog/[slug]` access — not just be omitted from listings.
- Prefer disabling users over deleting them when their posts still exist.
- Category deletion must guard against orphaning posts.
- Respect `prefers-reduced-motion` throughout the Framer Motion primitives (`FadeIn`, `Reveal`, `Stagger`, `PageTransition`).
- Admin tables must collapse to stacked cards/list items on mobile rather than forcing horizontal scroll on giant tables.
