# Configuration Reference

Nocturne 2.0.0 is a reusable Astro integration. All site-level configuration lives in your consumer app's `nocturne.config.ts` — the package provides types, schemas, and defaults.

---

## `nocturne.config.ts`

Create this file in your app root (e.g. `apps/my-site/nocturne.config.ts`):

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
  // ... see fields below
})
```

### All config options

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Nocturne"` | Site title — drives the hero SVG heading |
| `description` | `string` | `"A dark-first personal site template..."` | Default meta description and hero paragraph |
| `url` | `string` | `"https://example.com"` | Canonical URL for sitemap and OG tags |
| `author.name` | `string` | `"Author Name"` | Author name for RSS and article metadata |
| `author.email` | `string` | `"hello@example.com"` | Author email |
| `nav` | `NavLink[]` | `[{Home}, {Blog}]` | Header navigation links |
| `hero.eyebrow` | `string` | `"Astro Template"` | Eyebrow text above hero heading |
| `hero.actions` | `HeroAction[]` | `[Read blog, View profile]` | CTA buttons on hero section |
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

### Types

```ts
interface NavLink {
  label: string
  href: string
}

interface HeroAction {
  label: string
  href: string
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive"
}

interface FooterLink {
  label: string
  href: string
}
```

---

## `defineNocturneConfig()`

The main config builder. Deep-merges your values with defaults:

```ts
import { defineNocturneConfig } from "@geekyguy1705/nocturne/config"

export default defineNocturneConfig({
  title: "My Site",
  // Only set what you want to override — defaults fill the rest
  hero: {
    eyebrow: "Software Engineer",
  },
})
```

### Deep-merge behavior

- **Objects** are deep-merged recursively (nested keys from both sides are combined)
- **Arrays** are replaced entirely (your array overrides the default — no concatenation)
- **Primitives** are overridden by your value
- **Undefined** fields fall back to defaults

### `normalizeConfig()`

Used internally by the integration to normalize a raw config object. You typically use `defineNocturneConfig()` instead, but `normalizeConfig()` is available if you need to process a config programmatically:

```ts
import { normalizeConfig } from "@geekyguy1705/nocturne/config"

const config = normalizeConfig(rawConfigObject)
```

---

## Integration options

Pass these to the `nocturne()` integration in `astro.config.mjs`:

```ts
import { nocturne } from "@geekyguy1705/nocturne/astro"

nocturne({
  configFile: "./nocturne.config.ts",
  svgPathsFile: "./src/generated/svg-paths.json",
  articlesDirectory: "./src/content/articles",
  projectsDirectory: "./src/content/projects",
  profileDirectory: "./src/content/profile",
})
```

| Option | Default | Description |
|---|---|---|
| `configFile` | `"./nocturne.config.ts"` | Path to your site config file |
| `svgPathsFile` | `"./src/generated/svg-paths.json"` | Path to generated SVG glyph paths |
| `articlesDirectory` | `"./src/content/articles"` | Directory containing article markdown files |
| `projectsDirectory` | `"./src/content/projects"` | Directory containing project markdown files |
| `profileDirectory` | `"./src/content/profile"` | Directory containing profile markdown files |

All options are optional with sensible defaults.

---

## SVG heading generation

The hero heading is a pre-rendered SVG. After changing `title`, regenerate paths:

```bash
pnpm --filter my-site gen:svg
```

Options:

- `--config <path>` — Path to config file (default: `./nocturne.config.ts`)
- `--content <dir>` — Base content directory (default: `./src/content`)
- `--out <path>` — Output file (default: `./src/generated/svg-paths.json`)

Run this after changing your site title or adding new content tags.

---

## Portfolio modes

### `project-pages` (default)

Each project gets its own page at `/portfolio/:slug` with full Markdown content. The portfolio index shows project cards.

### `single-page`

All projects are displayed on a single `/portfolio` page with full Markdown content rendered inline. No individual project pages are generated.

---

## Validation

The config is validated at build time:

- `portfolio.mode` must be `"single-page"` or `"project-pages"` — throws on invalid values
- If `profile.enabled` is `true`, exactly one profile entry must exist in the content collection

---

## Workspace-level configuration

For workspace-level settings (which app to run, dev server port, build output), see the [Workspace reference](workspace.md).
