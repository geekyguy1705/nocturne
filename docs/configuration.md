# Configuration Guide

Every user-facing setting in Nocturne lives in one of three places: `site.config.ts` for global site settings, the content files in `src/content/` for your personal data, and `Layout.astro` / `ThemePicker.tsx` for the default theme.

---

## Site config (`apps/web/src/site.config.ts`)

This is the primary configuration file. Edit it first when setting up the template.

```ts
export const siteConfig = {
  // The site name — appears in the header and drives the hero SVG heading.
  // ⚠️  After changing this, run: pnpm --filter web gen:paths
  title: "Nocturne",

  // Used as the default <meta description> on pages that don't set their own.
  description: "A dark-first personal site template — animated SVG headings, 15 themes, content collections, and full-text search.",

  // Your canonical URL — used in sitemap and Open Graph tags.
  url: "https://nocturne.dev",

  // Author info — used in RSS feeds and article metadata.
  author: {
    name: "Abhishek",
    email: "hello@nocturne.dev",
  },

  // Navigation links shown in the header (desktop + mobile).
  // "Portfolio" and "Profile" are added automatically if portfolio.enabled is true.
  nav: [
    { label: "Home",  href: "/" },
    { label: "Blog",  href: "/blog" },
  ],

  portfolio: {
    // Set to false to hide the Portfolio section entirely (no nav link, no /portfolio page).
    enabled: true,

    // "project-pages" — each project gets its own /portfolio/:id page with full Markdown content.
    // "single-page"   — all projects listed on one /portfolio page, no individual pages.
    mode: "project-pages",
  },
}
```

### ⚠️ Title change workflow

The hero heading is a pre-rendered SVG — glyph paths are baked in at build time. Whenever you change `title`, regenerate them:

```bash
pnpm --filter web gen:paths
```

This is also run automatically as part of `pnpm build`.

---

## Profile (`apps/web/src/content/profile/profile.md`)

One file, one profile. All fields are optional except `name`, `role`, and `bio`.

```yaml
---
# Displayed as the animated SVG heading on the /profile page.
name: "Abhishek"

# Shown below the heading in muted text.
role: "Frontend Engineer & Design Systems Nerd"

# Used as the <meta description> on the profile page.
bio: "I craft dark-mode-first web experiences with obsessive attention to typography, motion, and colour."

# URL to your avatar image. Supports Unsplash, local paths (/avatar.png), or any absolute URL.
# If omitted, a fallback icon is shown.
avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"

# Social links rendered as outline buttons below the heading.
# Supported icon values: "github" | "linkedin" | "twitter" | "instagram" | "youtube" | "rss"
social:
  - name: "GitHub"
    url: "https://github.com/yourusername"
    icon: "github"
  - name: "LinkedIn"
    url: "https://linkedin.com/in/yourprofile"
    icon: "linkedin"
  - name: "Twitter"
    url: "https://twitter.com/yourhandle"
    icon: "twitter"

# Rendered as shadcn Badge components in the profile block.
skills:
  - "Astro"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"

# Optional — renders a primary "Resume" button. Set to "#" to disable.
resumeLink: "https://your-resume.pdf"
---

Your profile body content goes here as regular Markdown.

## About me

Write anything — this renders as styled Markdown below the profile block.
```

---

## Articles (`apps/web/src/content/articles/*.md`)

Create one `.md` file per article. Filename becomes the URL slug (e.g. `my-post.md` → `/blog/my-post`).

```yaml
---
# Required
title: "Build-Time SVG Fonts with opentype.js"
description: "Why SVG <text> strokes intersect and how to fix it at the vector level."

# Required — ISO date string or YYYY-MM-DD
publishDate: 2026-06-10

# Optional — shown as "Updated" if present
updatedDate: 2026-06-15

# Optional — used for tag pages at /blog/tag/:tag
# ⚠️  After adding a new tag, run: pnpm --filter web gen:paths
tags: ["svg", "typography", "build-tools"]

# Optional — set to true to exclude from listing pages and search index
draft: false

# Optional — Unsplash URL, local path, or any image URL
coverImage: "https://images.unsplash.com/photo-1524666643752-b381eb00effb?w=800&q=80"

# Optional — defaults to siteConfig.author.name
author: "Abhishek"

# Optional — displayed in the article header (not auto-calculated)
readingTime: "9 min"
---

Article body in Markdown. Supports:
- Syntax highlighting (```ts ... ```)
- Math ($E = mc^2$ inline, $$...$$ block)
- Mermaid diagrams (```mermaid ... ```)
- GFM tables, task lists, strikethrough
```

### Tag note

Every unique tag automatically gets a `/blog/tag/:tag` page with an animated SVG heading. After adding tags that haven't been used before, run `pnpm --filter web gen:paths` to generate their heading paths.

---

## Projects (`apps/web/src/content/projects/*.md`)

Create one `.md` file per project. Filename becomes the URL slug (e.g. `my-app.md` → `/portfolio/my-app`).

```yaml
---
# Required
title: "Palette Studio"
description: "An in-browser OKLCH colour palette editor with real-time contrast checking and CSS variable export."

# Optional — rendered as tech stack badges on the project card and page
tech: ["Vue 3", "TypeScript", "Canvas API", "OKLCH"]

# Optional — ISO date or YYYY-MM-DD, used for sorting
date: 2026-02-20

# Optional — renders a "View project" link button
link: "https://palette-studio.example.com"

# Optional — featured projects are sorted to the top of the portfolio listing
featured: true

# Optional — Unsplash URL or local path
coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
---

Project body in Markdown. Describe architecture, highlights, and outcomes.
```

---

## Default theme

The default theme is applied when no theme is stored in `localStorage` (first-time visitors).

**Two places to update:**

### 1. `apps/web/src/layouts/Layout.astro`

Find this line and change the dark/light fallbacks:

```ts
const theme = ALL_THEMES.includes(stored)
  ? stored
  : (prefersDark ? "tokyonight-night" : "latte")
//                  ^^^^^^^^^^^^^^^^    ^^^^^
//                  dark OS default     light OS default
```

### 2. `apps/web/src/components/ThemePicker.tsx`

```ts
const DEFAULT_THEME: ThemeId = "tokyonight-night"
```

This controls the picker's initial selected state when no `localStorage` value exists.

**Available theme IDs:**

| Scheme | IDs |
|---|---|
| Catppuccin | `latte` (light), `frappe`, `macchiato`, `mocha` |
| Gruvbox | `gruvbox-light` (light), `gruvbox-dark` |
| Rosé Pine | `rosepine-dawn` (light), `rosepine-main`, `rosepine-moon` |
| Nord | `nord-light` (light), `nord-dark` |
| Dracula | `dracula` |
| Tokyo Night | `tokyonight-night`, `tokyonight-storm`, `tokyonight-moon` |

---

## Navigation

Nav links in `site.config.ts` render in the header and mobile drawer:

```ts
nav: [
  { label: "Home",   href: "/" },
  { label: "Blog",   href: "/blog" },
  // Add any page here:
  { label: "Uses",   href: "/uses" },
  { label: "Notes",  href: "/notes" },
],
```

The **Portfolio** and **Profile** links are appended automatically when `portfolio.enabled: true`. To show Portfolio but remove Profile, remove it from `Header.astro` directly.

---

## SVG heading font

Heading paths are generated from `Inter 600` (woff). To change the font size, edit `scripts/gen-svg-paths.ts`:

```ts
const FONT_SIZES = {
  hero: 72,     // index.astro hero heading
  page: 44,     // blog, portfolio, profile, tag headings
}
```

After any change to font sizes, re-run:

```bash
pnpm --filter web gen:paths
```

To swap to a different font entirely, install the `@fontsource/<font-name>` package (non-variable, for the woff files), update `findFontFile()` in the script to point to the new woff path, and re-run.
