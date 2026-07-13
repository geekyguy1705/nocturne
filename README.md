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
packages/nocturne   Reusable Astro integration package — components, layouts, routes, styles, scripts
apps/demo           Demo app consuming the package — fixture content about Nocturne
```

**Stack:** pnpm workspaces · Turborepo · Astro 6 · React 19 · Tailwind CSS v4 · TypeScript 6

## Quick start

```bash
pnpm install
pnpm --filter demo dev
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm --filter demo dev` | Start demo app dev server |
| `pnpm --filter demo build` | Build demo app |
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

- **[Configuration guide](docs/configuration.md)** — all configurable options with copy-paste examples
- **[Theming guide](docs/theming.md)** — CSS token system, adding new themes, `sync:themes` workflow
