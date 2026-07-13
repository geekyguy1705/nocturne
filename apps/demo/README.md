# Nocturne Demo

A minimal demo app consuming the `@geekyguy1705/nocturne` package.

## Quick Start

```bash
pnpm install
pnpm --filter demo gen:svg
pnpm --filter demo dev
```

## Structure

```
apps/demo/
├── astro.config.mjs       # Registers nocturne() integration + React
├── nocturne.config.ts     # Site config (title, nav, portfolio mode, etc.)
├── src/
│   ├── content.config.ts  # Content collections using package schemas
│   ├── content/
│   │   ├── articles/      # Blog posts (.md)
│   │   ├── projects/      # Portfolio projects (.md)
│   │   └── profile/       # Profile page (.md)
│   └── generated/
│       └── svg-paths.json # Generated SVG heading paths
```

## How It Works

1. **Integration** — `nocturne()` in `astro.config.mjs` injects all routes, virtual modules, markdown plugins, and Tailwind CSS.
2. **Config** — `nocturne.config.ts` exports site configuration via `defineNocturneConfig()`.
3. **Content** — `content.config.ts` defines collections using `createArticleSchema()`, `createProjectSchema()`, `createProfileSchema()` from the package.
4. **SVG Paths** — Run `pnpm gen:svg` to generate `svg-paths.json` from your config title and content tags.
5. **Routes** — All page routes (home, blog, portfolio, profile, tags, 404) are injected by the integration. No page files needed.
