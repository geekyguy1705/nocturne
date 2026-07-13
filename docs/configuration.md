# Configuration Guide

Nocturne 2.0 is a reusable Astro integration. All configuration lives in your consumer app — the package provides types, schemas, and defaults.

---

## Quick Start

```bash
pnpm add @geekyguy1705/nocturne @astrojs/react astro react react-dom
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { nocturne } from "@geekyguy1705/nocturne/astro"

export default defineConfig({
  integrations: [
    react(),
    nocturne(),
  ],
})
```

---

## Site config (`nocturne.config.ts`)

Create a `nocturne.config.ts` in your project root:

```ts
import { defineNocturneConfig } from "@geekyguy1705/nocturne/config"

export default defineNocturneConfig({
  title: "My Site",
  description: "My personal website.",
  url: "https://example.com",
  author: {
    name: "Jane Doe",
    email: "jane@example.com",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ],
  portfolio: {
    enabled: true,
    mode: "project-pages",
  },
})
```

### All config options

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Nocturne"` | Site title — drives the hero SVG heading |
| `description` | `string` | `"A dark-first personal site template..."` | Default meta description |
| `url` | `string` | `"https://example.com"` | Canonical URL for sitemap and OG tags |
| `author.name` | `string` | `"Author Name"` | Author name for RSS and article metadata |
| `author.email` | `string` | `"hello@example.com"` | Author email |
| `nav` | `NavLink[]` | `[{Home}, {Blog}]` | Header navigation links |
| `hero.eyebrow` | `string` | `"Astro Template"` | Eyebrow text above hero heading |
| `hero.actions` | `HeroAction[]` | `[Read blog, View profile]` | CTA buttons on hero |
| `home.latestArticlesLabel` | `string` | `"Latest articles"` | Section heading on home page |
| `home.featuredProjectsLabel` | `string` | `"Featured projects"` | Section heading on home page |
| `blog.enabled` | `boolean` | `true` | Show/hide blog section |
| `blog.description` | `string` | `"Articles on..."` | Blog page meta description |
| `blog.browseTagsLabel` | `string` | `"Browse tags"` | Link text on blog page |
| `portfolio.enabled` | `boolean` | `true` | Show/hide portfolio section |
| `portfolio.mode` | `"single-page" \| "project-pages"` | `"project-pages"` | Portfolio layout mode |
| `portfolio.description` | `string` | `"Selected projects..."` | Portfolio page meta description |
| `portfolio.browseTagsLabel` | `string` | `"Browse tags"` | Link text on portfolio page |
| `profile.enabled` | `boolean` | `true` | Show/hide profile page |
| `footer.links` | `FooterLink[]` | `[Blog, Profile]` | Footer navigation links |
| `themes.defaultLight` | `string` | `"latte"` | Default light theme ID |
| `themes.defaultDark` | `string` | `"tokyonight-night"` | Default dark theme ID |
| `search.enabled` | `boolean` | `true` | Enable/disable search |
| `seo.openGraph` | `boolean` | `true` | Generate Open Graph tags |
| `seo.twitter` | `boolean` | `true` | Generate Twitter card tags |

### Title change workflow

The hero heading is a pre-rendered SVG. After changing `title`, regenerate paths:

```bash
pnpm gen:svg
```

---

## Content collections

Define your collections in `src/content.config.ts` using the package schemas:

```ts
import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import {
  createArticleSchema,
  createProjectSchema,
  createProfileSchema,
} from "@geekyguy1705/nocturne/content"

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: createArticleSchema(),
})

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: createProjectSchema(),
})

const profile = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/profile" }),
  schema: createProfileSchema(),
})

export const collections = { articles, projects, profile }
```

### Extending schemas

Pass extension fields to customize:

```ts
const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: createArticleSchema({
    coverImageAlt: z.string().optional(),
  }),
})
```

### Articles (`src/content/articles/*.md`)

```yaml
---
title: "My Article"
description: "A description."
publishDate: 2025-01-15
tags: ["typescript", "astro"]
draft: false
author: "Jane"
readingTime: "5 min"
---
```

### Projects (`src/content/projects/*.md`)

```yaml
---
title: "My Project"
description: "A project description."
tags: ["react", "typescript"]
date: 2025-01-15
link: "https://example.com"
featured: true
---
```

### Profile (`src/content/profile/profile.md`)

Exactly one file when `profile.enabled` is `true`:

```yaml
---
name: "Jane"
role: "Software Engineer"
bio: "Building things on the web."
social:
  - name: "GitHub"
    url: "https://github.com/jane"
    icon: "github"
skills: ["TypeScript", "React", "Astro"]
resumeLink: "https://example.com/resume.pdf"
---
```

---

## Integration options

```ts
nocturne({
  configFile: "./nocturne.config.ts",
  svgPathsFile: "./src/generated/svg-paths.json",
  articlesDirectory: "./src/content/articles",
  projectsDirectory: "./src/content/projects",
  profileDirectory: "./src/content/profile",
})
```

All options are optional with sensible defaults.

---

## SVG heading generation

```bash
pnpm gen:svg
```

Options:

- `--config <path>` — Path to config file (default: `./nocturne.config.ts`)
- `--content <dir>` — Base content directory (default: `./src/content`)
- `--out <path>` — Output file (default: `./src/generated/svg-paths.json`)

Run this after changing your site title or adding new content tags.
