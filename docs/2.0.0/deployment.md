# Deployment Guide

Nocturne 2.0.0 builds to a static site that can be deployed to any static hosting provider.

---

## Build process

The build runs three stages:

1. **prebuild** — `gen-svg-paths.ts` generates SVG glyph path data from your site title
2. **astro build** — compiles the site to `dist/`
3. **postbuild** — `pagefind --site dist` indexes the built output for full-text search

```bash
pnpm --filter my-site build
```

The output is a fully static site in `dist/` (or your configured `build.outputDir`).

---

## Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the project
3. Configure:
   - **Framework preset**: Astro
   - **Build command**: `pnpm --filter my-site build`
   - **Output directory**: `dist`
   - **Install command**: `pnpm install`
4. Set environment variables if needed
5. Deploy

### Vercel project settings

| Setting | Value |
|---|---|
| Build Command | `pnpm --filter my-site build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |
| Node.js Version | 22.x |

---

## Netlify

1. Push your repo to GitHub
2. Go to [netlify.com](https://netlify.com) and connect the repo
3. Configure:
   - **Build command**: `pnpm --filter my-site build`
   - **Publish directory**: `dist`
4. Deploy

### Netlify settings

| Setting | Value |
|---|---|
| Build Command | `pnpm --filter my-site build` |
| Publish Directory | `dist` |
| Node Version | 22 |

---

## Cloudflare Pages

1. Push your repo to GitHub
2. Go to Cloudflare Pages and create a project
3. Configure:
   - **Build command**: `pnpm --filter my-site build`
   - **Build output directory**: `dist`
   - **Environment variable**: `NODE_VERSION=22`
4. Deploy

---

## Self-hosting

Build the site and serve the `dist/` directory with any static file server:

```bash
pnpm --filter my-site build
npx serve dist
```

Or with nginx, Caddy, or any web server pointing at the `dist/` directory.

---

## Custom domains

### Vercel

1. Go to your project settings → Domains
2. Add your custom domain
3. Add the DNS records Vercel provides

### Netlify

1. Go to Domain settings → Add custom domain
2. Add the DNS records Netlify provides

### General

Update `url` in `nocturne.config.ts` to your custom domain so sitemap and OG tags use the correct URL:

```ts
export default defineNocturneConfig({
  url: "https://your-domain.com",
  // ...
})
```

---

## Search index

Pagefind runs as a postbuild step to generate a search index from the built HTML. The index is stored in `dist/pagefind/` and loaded client-side by the `GlobalSearch` component.

No additional configuration is needed — the `postbuild` script handles everything:

```json
"postbuild": "pagefind --site dist"
```

If you disable search in your config (`search.enabled: false`), you can remove the postbuild script to skip indexing.

---

## SVG path generation

The `prebuild` script generates SVG glyph paths from your site title. This runs automatically before `astro build`:

```json
"prebuild": "node --experimental-strip-types ./node_modules/@geekyguy1705/nocturne/src/scripts/gen-svg-paths.ts --config ./nocturne.config.ts --content ./src/content --out ./src/generated/svg-paths.json"
```

You can also run it manually:

```bash
pnpm --filter my-site gen:svg
```

Re-run this whenever you change your `title` in `nocturne.config.ts`.

---

## Environment variables

Nocturne does not require any environment variables for basic deployment. The site is fully static — no server-side runtime is needed.

If you extend the site with API calls or integrations that require secrets, manage those through your hosting provider's environment variable settings.

---

## Preview before deploying

Test your production build locally:

```bash
pnpm --filter my-site build
pnpm --filter my-site preview
```

This starts a local server serving the built `dist/` directory.
