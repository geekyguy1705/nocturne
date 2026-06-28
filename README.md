# Nocturne

A dark-first personal site template built with Astro, Tailwind v4, and Anime.js — animated SVG headings, 15 themes, Markdown content collections, and full-text search.

## Features

- **Animated SVG headings** — per-glyph `<path>` elements from `opentype.js` at build time, drawn with Anime.js `createDrawable`. No stroke intersections.
- **15 themes** across 6 colour schemes (Catppuccin, Gruvbox, Rosé Pine, Nord, Dracula, Tokyo Night) — pure CSS custom properties, OKLCH colour space
- **Content collections** — type-safe Markdown with Zod schemas for articles, projects, and profile
- **Full-text search** — Pagefind index built post-compile, zero client-side bundle overhead
- **Markdown extras** — KaTeX math, Mermaid diagrams, Shiki syntax highlighting, GFM tables
- **Spring physics** — Anime.js card hover and scroll-triggered entrance animations

## Structure

```
apps/web          Astro site — pages, content, animations, build scripts
packages/ui       Shared shadcn/ui components + global CSS theme files
```

**Stack:** pnpm workspaces · Turborepo · Astro 6 · React 19 · Tailwind CSS v4 · TypeScript 6

## Quick start

```bash
pnpm install
pnpm dev
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start Astro dev server |
| `pnpm build` | `gen:paths` → `astro build` → Pagefind index |
| `pnpm --filter web gen:paths` | Regenerate SVG glyph paths (run after changing `title`) |
| `pnpm --filter web sync:themes` | Regenerate theme CSS from palette source packages |
| `pnpm typecheck` | `astro check` across the workspace |
| `pnpm format` | Prettier across all `.ts`, `.tsx`, `.astro` files |

## Package reference

### Runtime (`apps/web`)

| Package | Purpose |
|---|---|
| `astro` | Static site framework — content collections, routing, SSG |
| `@astrojs/react` | React island support for interactive components |
| `animejs ^4.5.0` | SVG `createDrawable` stroke animations, spring physics |
| `@fontsource-variable/inter` | Self-hosted Inter variable font |
| `radix-ui` | Headless accessible UI primitives |
| `cmdk` | Command palette (GlobalSearch) |
| `lucide-react` | Icons |
| `class-variance-authority` + `tailwind-merge` + `clsx` | Class utilities (shadcn/ui) |
| `zod` | Content collection schema validation |
| `tw-animate-css` | Tailwind v4 animation utilities |

### Dev / build (`apps/web`)

| Package | Purpose |
|---|---|
| `opentype.js` | Parses woff font, extracts per-glyph SVG `<path>` data at build time |
| `@fontsource/inter` | Static woff files for `gen-svg-paths.ts` (opentype.js can't read woff2) |
| `pagefind` + `@pagefind/default-ui` | Full-text search index |
| `rehype-pretty-code` + `shiki` | Syntax highlighting in Markdown |
| `rehype-katex` + `remark-math` + `katex` | LaTeX math rendering |
| `mermaid` | Diagram rendering |
| `rehype-slug` + `rehype-autolink-headings` | Heading anchor links |
| `remark-gfm` | GitHub Flavoured Markdown |
| `@catppuccin/palette` + `@rose-pine/palette` | Palette source data for `sync-themes.ts` |
| `overlayscrollbars` | Custom scrollbar in theme picker |

### Monorepo root

| Package | Purpose |
|---|---|
| `turbo` | Task orchestration |
| `prettier` + plugins | Code formatting for `.ts`, `.tsx`, `.astro` |

## Documentation

- **[Configuration guide](docs/configuration.md)** — all configurable options with copy-paste examples
- **[Theming guide](docs/theming.md)** — CSS token system, adding new themes, `sync:themes` workflow
