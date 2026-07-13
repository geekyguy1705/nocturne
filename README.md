# Nocturne

A dark-first personal site template built with Astro, Tailwind v4, and Anime.js — animated SVG headings, 15 themes, Markdown content collections, and full-text search.

**New Features:** 
- [tag-aware command-palette search](#features)
- [tag pages](#features)
- [configurable portfolio modes](#features)

## Features

- **Animated SVG headings** — per-glyph `<path>` elements from `opentype.js` at build time, drawn with Anime.js `createDrawable`. No stroke intersections.
- **15 themes** across 6 colour schemes (Catppuccin, Gruvbox, Rosé Pine, Nord, Dracula, Tokyo Night) — pure CSS custom properties, OKLCH colour space
- **Content collections** — type-safe Markdown with Zod schemas for articles, projects, and profile
- **Full-text search** — Pagefind index built post-compile, zero client-side bundle overhead
- **Markdown extras** — KaTeX math, Mermaid diagrams, Shiki syntax highlighting, GFM tables
- **Spring physics** — Anime.js card hover and scroll-triggered entrance animations
- **Tag-aware command-palette search** — `tag: <term>` syntax filters results by tag; tags also participate in normal full-text queries; matching tags shown as chips inside each result row
- **Tag pages** — every unique tag auto-generates a `/blog/tag/:tag` page (articles) and `/portfolio/tag/:tag` page (projects) with animated SVG headings
- **Portfolio modes** — `single-page` (all projects on one page) or `project-pages` (each project gets its own `/portfolio/:id` page with full Markdown content)

## Structure

```
packages/nocturne       Reusable Astro integration package — components, layouts, routes, styles, scripts
apps/                   Consumer apps (demo, portfolio-abhishek, or your own)
nocturne.workspace.json Workspace-level config (default app, dev settings)
scripts/dev.mjs         Dev server launcher — reads workspace config
```

**Stack:** pnpm workspaces · Turborepo · Astro 6 · React 19 · Tailwind CSS v4 · TypeScript 6

## Quick start

```bash
pnpm install
pnpm dev
```

`pnpm dev` reads `nocturne.workspace.json` to determine which app to run. See the [Getting Started guide](docs/getting-started.md) to create your own site.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server (reads `nocturne.workspace.json` for `defaultApp`) |
| `pnpm --filter my-site dev` | Start a specific app's dev server |
| `pnpm --filter my-site build` | Build a specific app |
| `pnpm --filter @geekyguy1705/nocturne gen:svg` | Regenerate SVG glyph paths |
| `pnpm --filter @geekyguy1705/nocturne sync:themes` | Regenerate theme CSS from palette source packages |
| `pnpm --filter @geekyguy1705/nocturne typecheck` | TypeScript checks |
| `pnpm --filter @geekyguy1705/nocturne test` | Run package tests |
| `pnpm format` | Prettier across all `.ts`, `.tsx`, `.astro` files |

## Package reference

### Package (`packages/nocturne`)

| Package | Purpose |
|---|---|
| `astro` | Static site framework — content collections, routing, SSG |
| `@astrojs/react` | React island support for interactive components |
| `@astrojs/markdown-remark` | Markdown processor (unified pipeline) |
| `animejs ^4.5.0` | SVG `createDrawable` stroke animations, spring physics |
| `@fontsource-variable/inter` | Self-hosted Inter variable font |
| `radix-ui` | Headless accessible UI primitives |
| `cmdk` | Command palette (GlobalSearch) |
| `lucide-react` | Icons |
| `class-variance-authority` + `tailwind-merge` + `clsx` | Class utilities (shadcn/ui) |
| `zod` | Content collection schema validation |
| `tw-animate-css` | Tailwind v4 animation utilities |

### Dev / build (`packages/nocturne`)

| Package | Purpose |
|---|---|
| `opentype.js` | Parses woff font, extracts per-glyph SVG `<path>` data at build time |
| `@fontsource/inter` | Static woff files for `gen-svg-paths.ts` (opentype.js can't read woff2) |
| `rehype-pretty-code` + `shiki` | Syntax highlighting in Markdown |
| `rehype-katex` + `remark-math` + `katex` | LaTeX math rendering |
| `mermaid` | Diagram rendering |
| `rehype-slug` + `rehype-autolink-headings` | Heading anchor links |
| `remark-gfm` | GitHub Flavoured Markdown |
| `@catppuccin/palette` + `@rose-pine/palette` | Palette source data for `sync-themes.ts` |

### Monorepo root

| Package | Purpose |
|---|---|
| `turbo` | Task orchestration |
| `prettier` + plugins | Code formatting for `.ts`, `.tsx`, `.astro` |

## Documentation

- **[Getting Started](docs/getting-started.md)** — complete step-by-step guide to create your own Nocturne site
- **[Configuration reference](docs/2.0.0/configuration.md)** — every `nocturne.config.ts` field with types and defaults
- **[Workspace reference](docs/2.0.0/workspace.md)** — `nocturne.workspace.json` options for dev and build settings
- **[Content guide](docs/2.0.0/content.md)** — content collections, frontmatter fields, and schema extensions
- **[Theming guide](docs/2.0.0/theming.md)** — CSS token system, adding new themes, `sync:themes` workflow
- **[Deployment guide](docs/2.0.0/deployment.md)** — Vercel, Netlify, Cloudflare Pages, and self-hosting
