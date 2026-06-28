# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands should be run from the repo root using `pnpm` and `turbo`:

```bash
pnpm dev          # Start dev server (Astro on localhost:4321)
pnpm build        # Build all packages and apps
pnpm lint         # Run ESLint across all workspaces
pnpm format       # Run Prettier across all workspaces
pnpm typecheck    # Run TypeScript checks across all workspaces
```

App-specific commands (run from `apps/web/`):

```bash
pnpm preview      # Preview production build locally
pnpm sync:themes  # Sync all theme CSS variables from upstream
```

There are no tests configured.

## Architecture

This is a **pnpm + Turbo monorepo** with two workspaces:

- **`apps/web/`** — The Astro 6 site (main app, static output to `dist/`)
- **`packages/ui/`** — Shared React component library (shadcn/ui components + 7 themes)

### Data flow

Content is stored as Markdown in `apps/web/src/content/` across three Astro Content Collections: `articles`, `projects`, and `profile`. Schemas are defined in `apps/web/src/content.config.ts`. Pages in `apps/web/src/pages/` query these collections and render them using layouts in `apps/web/src/layouts/`.

### UI component system

`packages/ui` exports shadcn/ui components built on Radix primitives and Tailwind CSS 4. The web app imports from this package via the `@workspace/ui/*` path alias. Both workspaces have their own `components.json` (shadcn config). When adding new shadcn components, run `pnpm dlx shadcn@latest add <component>` from within the relevant workspace directory.

### Themes

Seven color themes are defined in `packages/ui/src/styles/` (Catppuccin, Dracula, Gruvbox, Nord, Rose Pine, Tokyo Night, and a default). Theme CSS variables are synced from upstream sources via `sync:themes` scripts. The `ThemePicker` and `ThemeToggle` components in `apps/web/src/components/` handle runtime theme switching.

### Markdown pipeline

Articles are processed with:
- **remark**: GFM, math (KaTeX), Mermaid diagrams
- **rehype**: syntax highlighting (Shiki, GitHub themes), KaTeX rendering, autolink headings

Custom remark plugins live in `apps/web/src/lib/`.

### Search

Pagefind indexes the built `dist/` output via the `postbuild` script (`pagefind --site dist`). The `GlobalSearch` component provides the search UI.

## Code style

Prettier config (`.prettierrc`): no semicolons, double quotes, 2-space tabs, LF line endings, trailing commas (ES5), 80-char print width. Tailwind class sorting is enforced via the prettier-plugin-tailwindcss plugin.
