# Getting Started with Nocturne 2.0.0

This guide walks you through creating your own Nocturne site from scratch — from cloning the repo to deploying your site.

---

## Prerequisites

- **Node.js** 22.12.0 or later
- **pnpm** 10.0.0 or later (`npm install -g pnpm`)
- **Git**

---

## Step 1: Clone the repository

```bash
git clone https://github.com/geekyguy1705/nocturne.git
cd nocturne
pnpm install
```

> **Starter kit reference**: The `nocturne-2.0/demo` branch contains a complete demo site with 6 articles, 3 projects, and a profile — a great reference for seeing how content is structured. Check it out with `git checkout nocturne-2.0/demo`.

---

## Step 2: Create your app

Create a new directory under `apps/` — this is your personal site that consumes the Nocturne package.

### Directory structure

```
apps/
└── my-site/
    ├── astro.config.mjs
    ├── nocturne.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── content.config.ts
        ├── content/
        │   ├── articles/
        │   ├── projects/
        │   └── profile/
        └── generated/
            └── svg-paths.json
```

### `package.json`

```json
{
  "name": "my-site",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "prebuild": "node --experimental-strip-types ./node_modules/@geekyguy1705/nocturne/src/scripts/gen-svg-paths.ts --config ./nocturne.config.ts --content ./src/content --out ./src/generated/svg-paths.json",
    "postbuild": "pagefind --site dist",
    "gen:svg": "node --experimental-strip-types ./node_modules/@geekyguy1705/nocturne/src/scripts/gen-svg-paths.ts --config ./nocturne.config.ts --content ./src/content --out ./src/generated/svg-paths.json",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/react": "^5",
    "@geekyguy1705/nocturne": "workspace:*",
    "astro": "^6",
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "pagefind": "^1.5.2"
  }
}
```

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### `astro.config.mjs`

```js
import { defineConfig } from "astro/config"
import { nocturne } from "@geekyguy1705/nocturne/astro"
import react from "@astrojs/react"

export default defineConfig({
  site: "https://your-domain.com",
  output: "static",
  integrations: [
    react(),
    nocturne({
      configFile: "./nocturne.config.ts",
      svgPathsFile: "./src/generated/svg-paths.json",
      articlesDirectory: "./src/content/articles",
      projectsDirectory: "./src/content/projects",
      profileDirectory: "./src/content/profile",
    }),
  ],
})
```

---

## Step 3: Configure the workspace

Create or edit `nocturne.workspace.json` at the **repo root** to set your app as the default:

```json
{
  "defaultApp": "my-site",
  "apps": ["my-site"],
  "dev": {
    "port": 4321,
    "host": false
  },
  "build": {
    "outputDir": "dist"
  }
}
```

When `defaultApp` is set, `pnpm dev` runs your app. If you omit `defaultApp`, the first app found in `apps/` is used automatically.

See [Workspace configuration](2.0.0/workspace.md) for all options.

---

## Step 4: Configure your site

Create `nocturne.config.ts` in your app directory:

```ts
import { defineNocturneConfig } from "@geekyguy1705/nocturne/config"

export default defineNocturneConfig({
  title: "Your Name",
  description: "Your site description — appears in meta tags and the hero section.",
  url: "https://your-domain.com",
  author: {
    name: "Your Name",
    email: "you@example.com",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  hero: {
    eyebrow: "Your Role or Tagline",
    actions: [
      { label: "Read the blog", href: "/blog" },
      { label: "View profile", href: "/profile", variant: "outline" },
    ],
  },
  home: {
    latestArticlesLabel: "Latest articles",
    featuredProjectsLabel: "Featured projects",
  },
  blog: {
    enabled: true,
    description: "Articles on your topics of expertise.",
    browseTagsLabel: "Browse tags",
  },
  portfolio: {
    enabled: true,
    mode: "project-pages",
    description: "Selected projects and case studies.",
    browseTagsLabel: "Browse tags",
  },
  footer: {
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Profile", href: "/profile" },
    ],
  },
})
```

See [Configuration reference](2.0.0/configuration.md) for every field.

---

## Step 5: Set up content collections

Create `src/content.config.ts` in your app:

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

See [Content guide](2.0.0/content.md) for frontmatter references and schema extensions.

---

## Step 6: Add content

### Articles (`src/content/articles/*.md`)

```markdown
---
title: "My First Article"
description: "An introduction to my blog."
publishDate: 2025-01-15
tags: ["typescript", "astro"]
draft: false
author: "Your Name"
readingTime: "5 min"
---

# Hello world

This is my first article on Nocturne.
```

### Projects (`src/content/projects/*.md`)

```markdown
---
title: "My Project"
description: "A description of my project."
tags: ["react", "typescript"]
date: 2025-01-15
link: "https://github.com/you/my-project"
featured: true
---

# My Project

Details about the project go here.
```

### Profile (`src/content/profile/profile.md`)

Exactly one file when `profile.enabled` is `true`:

```markdown
---
name: "Your Name"
role: "Software Engineer"
bio: "Building things on the web."
social:
  - name: "GitHub"
    url: "https://github.com/you"
    icon: "github"
skills: ["TypeScript", "React", "Astro"]
resumeLink: "https://example.com/resume.pdf"
---
```

---

## Step 7: Generate SVG heading paths

The hero heading is a pre-rendered SVG animation. Generate the path data from your site title:

```bash
pnpm --filter my-site gen:svg
```

This creates `src/generated/svg-paths.json`. Re-run this whenever you change your `title` in `nocturne.config.ts`.

---

## Step 8: Run the dev server

```bash
pnpm dev
```

This reads `nocturne.workspace.json`, finds your app, and starts the Astro dev server at `http://localhost:4321`.

You can also run a specific app directly:

```bash
pnpm --filter my-site dev
```

---

## Step 9: Build and preview

```bash
pnpm --filter my-site build
pnpm --filter my-site preview
```

The build process:
1. **prebuild** — generates SVG glyph paths
2. **astro build** — compiles the site to `dist/`
3. **postbuild** — runs Pagefind to index the built output for full-text search

---

## Step 10: Deploy

### Vercel

1. Push your repo to GitHub
2. Import the project in Vercel
3. Set the build command to `pnpm --filter my-site build`
4. Set the output directory to `dist`
5. Deploy

### Netlify

1. Push your repo to GitHub
2. Connect the repo in Netlify
3. Set build command to `pnpm --filter my-site build`
4. Set publish directory to `dist`
5. Deploy

See [Deployment guide](2.0.0/deployment.md) for more details.

---

## Step 11: Customize themes

Nocturne ships with 15 themes across 6 colour schemes. Set your defaults in `nocturne.config.ts`:

```ts
export default defineNocturneConfig({
  // ...
  themes: {
    defaultLight: "latte",
    defaultDark: "tokyonight-night",
  },
})
```

Users can switch themes at runtime via the theme picker. See [Theming guide](2.0.0/theming.md) for adding custom themes.

---

## Next steps

- [Configuration reference](2.0.0/configuration.md) — every `nocturne.config.ts` field
- [Workspace reference](2.0.0/workspace.md) — `nocturne.workspace.json` options
- [Content guide](2.0.0/content.md) — frontmatter fields and schema extensions
- [Theming guide](2.0.0/theming.md) — CSS tokens and custom themes
- [Deployment guide](2.0.0/deployment.md) — Vercel, Netlify, and self-hosting
