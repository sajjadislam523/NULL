I want you to build a completely new full-stack blog platform from scratch.

The project name is:

NULL /

This is NOT an existing application. There is no existing codebase or functionality that needs to be preserved.

You are responsible for designing and implementing the complete application architecture, database, authentication, RBAC, CMS, public website, responsive UI, animations, accessibility, SEO, and reusable component system.

The final product should feel like a premium digital publication from the near future.

The core visual direction is:

EDITORIAL × MONOCHROME × FUTURISTIC × TECHNICAL × MINIMAL

The website should feel sophisticated and intentional rather than visually overloaded.

==================================================

1. # PRODUCT IDENTITY

Project name:

NULL /

The name should be treated as the brand identity throughout the application.

Primary wordmark:

NULL /

The "/" is part of the visual identity.

Examples:

NULL /
NULL / WRITING
NULL / ABOUT
NULL / COMMAND
NULL / 014

Do not create a generic "blog" appearance.

The product should feel like an independent digital publication.

Concept:

"A monochrome digital journal for ideas, experiments, technology, design, and things worth thinking about."

================================================== 2. TECHNOLOGY STACK
===================

Use the following stack unless there is a strong technical reason to choose an alternative:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- Auth.js / NextAuth
- Framer Motion
- Zod
- React Hook Form
- Lucide React
- Tiptap for the rich text editor

Use the latest stable versions compatible with each other.

Structure the application cleanly from the beginning.

================================================== 3. SINGLE THEME
===============

There must be ONE visual theme.

Do NOT implement:

- light mode
- dark mode toggle
- theme switcher
- multiple themes
- user-selectable themes
- post-specific colors
- manually selected article atmospheres

The entire product should use one monochrome visual identity.

Suggested palette:

Background:
#090909

Surface:
#101010

Elevated surface:
#151515

Border:
#272727

Strong border:
#3A3A3A

Primary text:
#F2F2F2

Secondary text:
#A0A0A0

Muted text:
#626262

Start without a colorful accent.

If an accent is later needed, keep it centralized as a single design token.

Never allow individual posts to define their own visual color scheme.

================================================== 4. DESIGN PHILOSOPHY
====================

The futuristic appearance must come from:

- typography
- whitespace
- composition
- grid systems
- thin borders
- technical metadata
- precise alignment
- subtle motion
- editorial hierarchy

Do NOT create a cyberpunk website.

Avoid:

- excessive neon
- huge gradients
- excessive glow
- glassmorphism everywhere
- floating 3D objects
- unnecessary particles
- giant decorative graphics
- excessive rounded cards
- excessive parallax
- over-animated UI

The website should feel closer to:

a premium futuristic magazine

than:

a sci-fi dashboard.

================================================== 5. TYPOGRAPHY
=============

Use two font families.

Primary:

Geist or another modern grotesk/sans-serif.

Secondary:

Geist Mono or JetBrains Mono.

Use the primary font for:

- titles
- body text
- navigation
- buttons

Use monospace for:

- dates
- categories
- reading time
- technical labels
- status
- indexes
- small metadata

Examples:

POST / 014

12 SEP 2026

08 MIN READ

/WRITING

EST. 2026

================================================== 6. DESIGN TOKENS
================

Create centralized design tokens for:

- colors
- typography
- spacing
- borders
- radii
- shadows
- animation durations

Use a spacing system approximately:

4
8
12
16
24
32
48
64
96
128
160

Use mostly square or minimally rounded UI.

Default radius should be:

0px–4px

Do not turn every component into a rounded card.

================================================== 7. DECORATIVE SYSTEM
====================

Create reusable subtle decorative components:

GridBackground
TechnicalLabel
IndexNumber
Metadata
StatusIndicator
SectionMarker

Examples:

/WRITING

/FEATURED

/ABOUT

01

02

03

12 SEP 2026
08 MIN READ

EST. 2026
VOL. 01

You may use very subtle grid lines, dots, corner markers, or technical details.

Decorations must never compete with content.

================================================== 8. PROJECT STRUCTURE
====================

Create a clean Next.js architecture.

Suggested structure:

app/
page.tsx

blog/
page.tsx
[slug]/
page.tsx

category/
[slug]/
page.tsx

search/
page.tsx

about/
page.tsx

login/
page.tsx

admin/
layout.tsx
page.tsx
posts/
users/
categories/
settings/

components/
ui/
layout/
blog/
admin/
editor/
motion/
decorative/

lib/
db/
auth/
permissions/
validations/
utils/

models/
User.ts
Post.ts
Category.ts

types/

hooks/

================================================== 9. DATABASE
===========

Use MongoDB with Mongoose.

Create a User model.

Conceptually:

User {
\_id
name
email
passwordHash
avatar
role
status
lastLoginAt
createdAt
updatedAt
}

Roles:

ADMIN
EDITOR
AUTHOR

Statuses:

ACTIVE
DISABLED

================================================== 10. POST MODEL
==============

Create a Post model.

Conceptually:

Post {
\_id
title
slug
excerpt
content
coverImage
images
category
tags
author
status
publishedAt
readingTime
createdAt
updatedAt
}

Where:

images: string[]

IMPORTANT:

A post may optionally contain multiple images.

This is an intentional feature.

If images is empty, do not render an empty gallery.

If there is one image, render it as an article image.

If multiple images exist, render a sophisticated responsive gallery/lightbox.

The database must support this from the beginning.

================================================== 11. CATEGORY MODEL
==================

Create:

Category {
\_id
name
slug
description
createdAt
updatedAt
}

Prevent deletion if posts depend on the category unless posts are reassigned or the administrator explicitly confirms a safe operation.

================================================== 12. AUTHENTICATION
==================

Implement secure authentication.

Create:

/login

Use Auth.js / NextAuth or the most appropriate modern authentication approach.

Login UI should be minimal.

Concept:

/ACCESS

Welcome back.

EMAIL

PASSWORD

[ SIGN IN ]

Do not expose passwords or sensitive data.

Use secure password hashing.

Protect admin routes.

================================================== 13. RBAC
========

Implement proper server-side RBAC.

ADMIN:

- manage users
- manage settings
- manage categories
- create/edit/delete all posts
- publish/unpublish
- manage authors/editors

EDITOR:

- create posts
- edit posts
- manage categories
- publish/unpublish posts
- manage content

AUTHOR:

- create posts
- edit own posts
- manage own drafts
- cannot manage users
- cannot modify other authors' posts

Do not rely on frontend button visibility.

Every privileged server operation must validate:

1. authentication
2. role
3. resource ownership where applicable

Users must not be able to bypass permissions by manually calling APIs or opening protected URLs.

================================================== 14. ADMIN ROUTING
=================

Create:

/admin
/admin/posts
/admin/posts/new
/admin/posts/[id]/edit
/admin/users
/admin/categories
/admin/settings

Protect all admin routes.

Unauthenticated users should be redirected to login.

Authenticated users without permission should receive a proper forbidden state.

================================================== 15. ADMIN VISUAL LANGUAGE
=========================

The admin should feel like a monochrome command center.

Brand:

NULL / COMMAND

Desktop:

Sidebar on the left.

Main content on the right.

Sidebar:

NULL / COMMAND

Dashboard
Posts
Users
Categories
Settings

Logout

Use thin borders and technical metadata.

Do not make it resemble a generic Bootstrap/SaaS dashboard.

================================================== 16. ADMIN DASHBOARD
===================

Create:

COMMAND CENTER

SYSTEM / OVERVIEW

Display:

TOTAL POSTS
PUBLISHED
DRAFTS
USERS

Then:

RECENT POSTS

Each item should show:

title
status
author
updated date
actions

Provide quick actions:

- NEW POST

MANAGE POSTS

MANAGE USERS

================================================== 17. POST CRUD
=============

Implement complete post CRUD.

CREATE:

/admin/posts/new

READ:

/admin/posts

UPDATE:

/admin/posts/[id]/edit

DELETE:

with confirmation.

Also support:

DRAFT
PUBLISHED
UNPUBLISHED

Actions:

Edit
Preview
Publish
Unpublish
Delete

Use proper loading/error/success states.

================================================== 18. POST EDITOR
===============

Use Tiptap unless there is a compelling reason to choose another editor.

Create a premium editorial writing experience.

Fields:

TITLE
SLUG
EXCERPT
CONTENT
COVER IMAGE
ARTICLE GALLERY
CATEGORY
TAGS
AUTHOR
STATUS
PUBLISHED DATE

Automatically generate the slug from title initially.

Allow manual editing.

Calculate reading time automatically from content where practical.

================================================== 19. EDITOR PREVIEW
==================

Provide:

EDITOR | PREVIEW

Desktop:

split view may be used.

Mobile:

switch between editor and preview.

Do not force a tiny split-screen layout on mobile.

Preview must accurately reflect the public article typography and spacing.

================================================== 20. IMAGE UPLOAD
================

Implement image upload infrastructure cleanly.

Support:

Cover image

Multiple article images

Gallery management:

- upload
- preview
- reorder
- delete/remove

Use the project's selected storage provider appropriately.

Do not store huge raw image data directly in MongoDB.

Store references/URLs.

Use optimized images in the frontend.

================================================== 21. ARTICLE GALLERY
===================

This is an important feature.

Posts can have:

images: string[]

If:

images.length === 0

render nothing.

If:

images.length === 1

render a large editorial image.

If:

images.length > 1

render a sophisticated responsive gallery.

Desktop:

Use a tasteful grid/asymmetric composition.

Mobile:

Use a clean vertical sequence.

Add:

- lightbox
- fullscreen view
- next/previous controls
- keyboard support
- touch support
- lazy loading
- alt text

The gallery must inherit the monochrome design language.

Do not add per-post colors.

================================================== 22. PUBLIC NAVBAR
=================

Brand:

NULL /

Navigation:

WRITING
ABOUT
SEARCH

Desktop should be minimal.

Mobile:

NULL / MENU

Opening MENU should produce a polished full-screen or drawer navigation.

Use proper accessibility and keyboard behavior.

================================================== 23. HOMEPAGE
============

Create a sophisticated editorial homepage.

Hero:

/ DIGITAL JOURNAL

Ideas, experiments,
observations and things
worth thinking about.

Small metadata:

EST. 2026
VOL. 01
ONLINE

CTA:

EXPLORE WRITING →

Use large typography.

Allow generous empty space.

Do not overcrowd the hero.

================================================== 24. FEATURED ARTICLE
====================

Show a featured article prominently.

Structure:

FEATURED / 01

TITLE

EXCERPT

CATEGORY
READING TIME
DATE

READ ARTICLE →

If a cover image exists, use it.

If not, create a typography-focused layout.

Never show broken/empty image containers.

================================================== 25. LATEST POSTS
================

Use editorial rows rather than generic cards.

Example:

01

Building a CMS Without Making It Boring

DEVELOPMENT
08 MIN READ

12 SEP 2026

→

Hover:

- subtle title movement
- arrow movement
- border transition
- optional image preview

Keep motion restrained.

================================================== 26. BLOG LISTING
================

Create:

/blog

Header:

/WRITING

Thoughts, experiments,
observations & notes.

Categories:

ALL
DEVELOPMENT
DESIGN
TECHNOLOGY
THOUGHTS

Use editorial filter controls instead of colorful pill-heavy UI.

Posts should be presented as sophisticated rows.

================================================== 27. CATEGORY PAGES
==================

Create:

/category/[slug]

Display:

/CATEGORY

Category title

Description

Posts in that category.

Maintain the same editorial layout.

================================================== 28. ARTICLE PAGE
================

Create:

/blog/[slug]

Structure:

CATEGORY / READING TIME

TITLE

EXCERPT

DATE

COVER IMAGE

ARTICLE CONTENT

Keep reading width approximately:

680–760px

Use excellent typography.

Support:

- headings
- paragraphs
- lists
- links
- blockquotes
- code
- images
- captions
- tables where supported

================================================== 29. READING PROGRESS
====================

Add a subtle article reading-progress indicator.

Thin line at the top.

Optionally:

READING 64%

Do not distract from reading.

Respect prefers-reduced-motion.

================================================== 30. SEARCH
==========

Implement search.

Keyboard shortcut:

Cmd + K
Ctrl + K

Open a large search interface.

Concept:

SEARCH

What are you looking for?

⌕ ********\_\_\_\_********

RESULTS

Show:

title
category
date
reading time
excerpt

Search must be keyboard accessible.

================================================== 31. ABOUT
=========

Create:

/about

Header:

/ABOUT

Create a strong editorial personal introduction.

Then:

WHAT I WORK WITH

DEVELOPMENT
DESIGN
TECHNOLOGY

Include contact/social information.

Avoid making this look like a generic resume.

================================================== 32. USER MANAGEMENT
===================

Create:

/admin/users

Table:

NAME
EMAIL
ROLE
STATUS
LAST LOGIN
CREATED
ACTIONS

Support:

- view user
- change role
- disable
- enable

Prefer disabling users instead of destructive deletion when posts reference them.

================================================== 33. CATEGORY MANAGEMENT
=======================

Create:

/admin/categories

Support:

create
edit
delete

Fields:

name
slug
description

Show how many posts belong to each category if practical.

================================================== 34. ADMIN SETTINGS
==================

Create a basic settings system.

Potential settings:

Site title
Site description
Author information
Social links
SEO defaults

Do not add unnecessary configuration.

The visual theme remains fixed.

================================================== 35. RESPONSIVE DESIGN
=====================

Mobile is NOT simply a smaller desktop.

Design intentionally for:

- desktop
- laptop
- tablet
- mobile

Desktop:

large typography
asymmetric layouts
generous spacing

Tablet:

simplified grids
reduced spacing
preserved hierarchy

Mobile:

single column
20px-ish horizontal padding
touch-friendly controls
full-screen navigation
stacked image gallery
mobile-friendly editor
no horizontal overflow

================================================== 36. ANIMATION SYSTEM
====================

Use Framer Motion.

Create reusable motion primitives.

Examples:

FadeIn
Reveal
Stagger
PageTransition

Page entrance:

opacity 0 → 1
y 12 → 0

Hover:

small translations
arrow movement
border changes

Images:

subtle scale

Animations should be fast and subtle.

Do not make the website feel slow.

Support:

prefers-reduced-motion

================================================== 37. ACCESSIBILITY
=================

Implement:

- semantic HTML
- keyboard navigation
- visible focus
- proper labels
- accessible dialogs
- accessible menus
- accessible lightbox
- alt text
- contrast
- reduced motion

Never sacrifice usability for aesthetics.

================================================== 38. SEO
=======

Implement proper Next.js SEO.

Posts should support:

title
description
canonical URL
Open Graph
Twitter/X metadata
article metadata

Generate metadata dynamically from post information.

Create sitemap and robots configuration.

Use clean semantic markup.

================================================== 39. PERFORMANCE
===============

Prioritize performance.

Use:

- optimized images
- lazy loading
- server components where possible
- minimal client components
- caching/revalidation
- optimized database queries
- pagination for admin/public lists

Do not unnecessarily make every component a client component.

================================================== 40. ERROR STATES
================

Create polished states for:

- 404
- unauthorized
- forbidden
- empty posts
- failed image upload
- failed save
- failed deletion
- database error
- validation error

Never expose raw server/database errors.

================================================== 41. LOADING STATES
==================

Use appropriate skeleton loading states.

Skeletons should use the same monochrome system.

Avoid excessive spinner usage.

================================================== 42. FORM VALIDATION
===================

Use Zod.

Validate:

- title
- slug
- excerpt
- content
- category
- tags
- images
- status
- user information

Display useful validation errors.

Never trust client-side validation alone.

Server-side validation is required.

================================================== 43. SECURITY
============

Implement:

- secure password hashing
- protected routes
- server-side authorization
- input validation
- safe database queries
- safe file handling
- ownership checks
- protected admin operations

Never trust role information coming directly from the client.

================================================== 44. DATABASE DESIGN
===================

Create appropriate indexes.

At minimum, consider indexes for:

Post.slug
Post.status
Post.publishedAt
Post.category
User.email
Category.slug

Use unique constraints where appropriate.

================================================== 45. SEED DATA
=============

Create a development seed mechanism.

Include:

- one admin user
- one editor
- one author
- several categories
- several example posts

Use clearly fake development credentials/data.

Do not hardcode real credentials.

================================================== 46. COMPONENT ARCHITECTURE
==========================

Create reusable components.

Suggested:

components/
ui/
Button
Input
Textarea
Select
Dialog
Dropdown
Badge
Skeleton

layout/
PublicNavbar
PublicFooter
AdminSidebar
MobileNavigation

blog/
ArticleRow
ArticleCard
ArticleHeader
ArticleContent
ArticleGallery
ReadingProgress
CategoryFilter
SearchOverlay

admin/
DashboardStats
PostTable
PostEditor
UserTable
CategoryManager
MediaUploader

motion/
FadeIn
Reveal
Stagger
PageTransition

decorative/
GridBackground
TechnicalLabel
IndexNumber
Metadata
StatusIndicator

Adapt the exact structure where necessary.

Avoid giant components.

================================================== 47. SERVER / CLIENT ARCHITECTURE
================================

Prefer server components by default.

Use client components only where interaction requires them.

Examples that may need client components:

- editor
- search interaction
- mobile menu
- image lightbox
- animations
- interactive forms

Keep data fetching on the server where appropriate.

================================================== 48. API / SERVER ACTIONS
========================

Choose a consistent approach.

Either:

- Route handlers

or:

- Server Actions

Do not mix patterns unnecessarily.

Every mutation must validate:

authentication
authorization
input

Return safe structured responses.

================================================== 49. POST PUBLISHING
===================

Draft posts must never appear publicly.

Published posts should appear on the public site.

Unpublished posts must not be accessible simply by knowing their slug.

Article pages should return 404 when a post is not public.

================================================== 50. ADMIN TABLE RESPONSIVENESS
==============================

Do not force giant tables onto mobile.

On mobile, convert table rows into stacked cards/list items where appropriate.

Actions should remain accessible.

================================================== 51. DESIGN QUALITY
==================

The design should NOT feel like a component library demo.

Avoid putting everything inside cards.

Use the entire viewport intelligently.

Use:

- large type
- whitespace
- horizontal rules
- asymmetric compositions
- indexes
- metadata
- borders
- subtle grid systems

The visual hierarchy should feel editorial.

================================================== 52. BRANDING DETAILS
====================

Use:

NULL /

as the main brand.

Possible metadata:

NULL / 001
NULL / 002
NULL / 003

Admin:

NULL / COMMAND

Login:

NULL / ACCESS

Writing:

NULL / WRITING

About:

NULL / ABOUT

These are examples of how the identity should be integrated naturally.

================================================== 53. IMPLEMENTATION ORDER
========================

Build in this order:

PHASE 1

Project setup
Next.js
TypeScript
Tailwind
MongoDB
Mongoose
Auth.js
Zod
Tiptap
Framer Motion

PHASE 2

Design system

Typography
Colors
Spacing
Borders
Buttons
Forms
Metadata
Decorative primitives
Motion primitives

PHASE 3

Database

User
Post
Category

Indexes
Validation
Seed data

PHASE 4

Authentication

Login
Session
Protected routes
RBAC

PHASE 5

Admin

Dashboard
Posts
Editor
Gallery
Categories
Users
Settings

PHASE 6

Public site

Homepage
Blog
Category
Article
Search
About

PHASE 7

Responsive behavior

Desktop
Tablet
Mobile

PHASE 8

Animation and polish

PHASE 9

SEO
Accessibility
Performance
Error states

================================================== 54. DEVELOPMENT EXPERIENCE
==========================

Create useful scripts for:

development
build
lint
typecheck
seed

Use environment variables for:

database URL
authentication secret
image storage credentials
other secrets

Create a clear .env.example.

Never commit secrets.

================================================== 55. README
==========

Create a useful README explaining:

- project overview
- stack
- installation
- environment variables
- database setup
- seed command
- development command
- build command
- authentication setup
- image storage setup
- production deployment

================================================== 56. FINAL QA
============

Before considering the project complete, verify:

PUBLIC:

[ ] Homepage
[ ] Blog listing
[ ] Category pages
[ ] Article page
[ ] Search
[ ] About
[ ] Navbar
[ ] Footer
[ ] Reading progress
[ ] Image gallery

AUTH:

[ ] Login
[ ] Logout
[ ] Protected routes
[ ] Session handling
[ ] Unauthorized state
[ ] Forbidden state

ADMIN:

[ ] Dashboard
[ ] Post list
[ ] Create post
[ ] Edit post
[ ] Preview
[ ] Publish
[ ] Unpublish
[ ] Delete
[ ] Category CRUD
[ ] User management
[ ] Role management
[ ] Disable/enable users
[ ] Image upload
[ ] Gallery management
[ ] Settings

RBAC:

[ ] Admin permissions
[ ] Editor permissions
[ ] Author permissions
[ ] Ownership checks
[ ] Server-side authorization

RESPONSIVE:

[ ] Desktop
[ ] Tablet
[ ] Mobile
[ ] Mobile navbar
[ ] Mobile article
[ ] Mobile gallery
[ ] Mobile editor
[ ] Mobile admin

QUALITY:

[ ] No horizontal overflow
[ ] No broken images
[ ] No broken routes
[ ] No draft leakage
[ ] No unauthorized mutations
[ ] No console errors
[ ] No hydration errors
[ ] No obvious accessibility problems
[ ] No unnecessary client components
[ ] No unnecessary duplicated code

================================================== 57. MOST IMPORTANT DESIGN INSTRUCTION
=====================================

Do not interpret "futuristic" as:

NEON + GLOW + GRADIENT + GLASS + PARTICLES.

Interpret futuristic as:

PRECISION + TYPOGRAPHY + SPACE + GRID + MOTION + EDITORIAL COMPOSITION.

The final website should feel like a publication that could exist in 2030, while still being highly readable and usable today.

The visual identity must remain monochrome and cohesive.

The final emotional impression should be:

"NULL / feels like a serious digital publication built by someone who cares deeply about technology, design, and ideas."

Start by creating the project architecture and design foundation first. Then implement the database/authentication/CMS/public experience systematically.

Do not skip directly to creating random pages before establishing the design system.
