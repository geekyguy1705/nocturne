# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands should be run from the repo root using `pnpm`:

```bash
pnpm dev                        # Start dev server (personal app if apps/portfolio-abhishek/ exists, otherwise demo)
pnpm dev:demo                   # Start demo dev server explicitly
pnpm dev:personal               # Start personal app dev server explicitly
pnpm --filter @geekyguy1705/nocturne build  # Build package
pnpm --filter @geekyguy1705/nocturne typecheck  # Run TypeScript checks
pnpm --filter @geekyguy1705/nocturne test      # Run package tests
pnpm format       # Run Prettier across all workspaces
```

## Architecture

This is a **pnpm + Turbo monorepo** with two workspaces:

- **`packages/nocturne/`** — Reusable Astro integration package (components, layouts, routes, styles, scripts, config, content schemas)
- **`apps/demo/`** — Demo app consuming the package (fixture content about Nocturne)
- **`apps/portfolio-abhishek/`** — Personal portfolio app (only on `nocturne-2.0/site-abhishek` branch)

### Data flow

Content is stored as Markdown in `apps/demo/src/content/` across three Astro Content Collections: `articles`, `projects`, and `profile`. Schemas are defined using factory functions from `@geekyguy1705/nocturne/content`. Routes are injected by the integration from `packages/nocturne/src/routes/`.

### UI component system

`packages/nocturne/src/ui/` exports shadcn/ui components built on Radix primitives and Tailwind CSS 4. Package routes and components import from `../ui/components/*` via relative paths. The package's `components.json` is at `packages/nocturne/components.json`.

### Themes

Seven color themes are defined in `packages/nocturne/src/styles/` (Catppuccin, Dracula, Gruvbox, Nord, Rose Pine, Tokyo Night, and a default). Theme CSS variables are synced from upstream sources via `sync:themes` scripts. The `ThemePicker` and `ThemeToggle` components in `packages/nocturne/src/components/` handle runtime theme switching.

### Markdown pipeline

Articles are processed with:
- **remark**: GFM, math (KaTeX), Mermaid diagrams
- **rehype**: syntax highlighting (Shiki, GitHub themes), KaTeX rendering, autolink headings

The markdown processor is configured via `unified()` from `@astrojs/markdown-remark` in the integration's `updateConfig` call.

Custom remark plugins live in `packages/nocturne/src/lib/`.

### Search

Pagefind indexes the built `dist/` output via the `postbuild` script (`pagefind --site dist`). The `GlobalSearch` component provides the search UI.

## Code style

Prettier config (`.prettierrc`): no semicolons, double quotes, 2-space tabs, LF line endings, trailing commas (ES5), 80-char print width. Tailwind class sorting is enforced via the prettier-plugin-tailwindcss plugin.
