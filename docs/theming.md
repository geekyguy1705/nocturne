# Theming Guide

Nocturne ships with 15 themes across 6 colour schemes. All themes are pure CSS — no JavaScript at the token level, no runtime colour computation.

---

## How it works

Themes are defined as CSS custom property blocks scoped to an `html` attribute:

```css
html[data-site-theme="tokyonight-night"] {
  --background:   #1a1b26;
  --foreground:   #c0caf5;
  --primary:      #7aa2f7;
  --highlight:    #7dcfff;
  /* ... */
}
```

On page load, an inline script in `Layout.astro` reads `localStorage.getItem("theme")` and sets `data-site-theme` on `<html>` before the first paint — no flash of unstyled content. When the user picks a theme in the ThemePicker, it calls `setAttribute("data-site-theme", id)` and saves to localStorage.

The `.dark` class on `<html>` is set simultaneously for Tailwind dark-mode utilities.

---

## Configuring default themes

Set the default light and dark themes in your `nocturne.config.ts`:

```ts
export default defineNocturneConfig({
  themes: {
    defaultLight: "latte",
    defaultDark: "tokyonight-night",
  },
})
```

These are applied when no theme is stored in `localStorage` (first-time visitors).

**Available theme IDs:**

| Scheme | IDs |
|---|---|
| Catppuccin | `latte` (light), `frappe`, `macchiato`, `mocha` |
| Gruvbox | `gruvbox-light` (light), `gruvbox-dark` |
| Rosé Pine | `rosepine-dawn` (light), `rosepine-main`, `rosepine-moon` |
| Nord | `nord-light` (light), `nord-dark` |
| Dracula | `dracula` |
| Tokyo Night | `tokyonight-night`, `tokyonight-storm`, `tokyonight-moon` |

---

## CSS token reference

Every theme defines the following tokens. All are available as CSS variables and most have Tailwind utility equivalents via `@theme` in `globals.css`.

### Base tokens (shadcn/ui standard)

| Token | Used for |
|---|---|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--card` | Card / elevated surface background |
| `--card-foreground` | Text on cards |
| `--popover` | Popover / dropdown background |
| `--popover-foreground` | Text in popovers |
| `--primary` | Primary interactive colour (buttons, SVG stroke) |
| `--primary-foreground` | Text on primary backgrounds |
| `--secondary` | Secondary surfaces |
| `--secondary-foreground` | Text on secondary backgrounds |
| `--muted` | Subtle background (hover states, code blocks) |
| `--muted-foreground` | Subdued text (metadata, placeholders) |
| `--accent` | Accent surface |
| `--accent-foreground` | Text on accent surfaces |
| `--destructive` | Error / danger colour |
| `--border` | Default border colour |
| `--input` | Input field background |
| `--ring` | Focus ring colour |

### Nocturne extended tokens

| Token | Used for | Tailwind utility |
|---|---|---|
| `--highlight` | Vivid accent — active nav links, tag hover, inline code | `text-highlight`, `bg-highlight`, `border-highlight` |
| `--accent-1` | First accent — gradient start (header title, hero) | — |
| `--accent-2` | Second accent — gradient mid-point | — |
| `--accent-3` | Third accent — additional branding colour | — |
| `--surface-raised` | Slightly elevated surface (above `--card`) | — |
| `--card-border-accent` | Accent-coloured card border on hover | — |
| `--link` | Inline link colour in Markdown prose | — |
| `--hero-gradient-start` | Hero section gradient start | — |
| `--hero-gradient-end` | Hero section gradient end | — |
| `--badge-primary` | Badge component background | — |
| `--tag-hover` | Tag chip hover background | — |

---

## Adding a new theme

### 1. Create a CSS file

Theme CSS lives in `packages/nocturne/src/styles/`. Add a new file or extend an existing one:

```css
/* my-theme.css */
html[data-site-theme="my-theme"] {
  --background:          #1c1e26;
  --foreground:          #e0e0f0;
  --card:                #16181f;
  --card-foreground:     #e0e0f0;
  --popover:             #16181f;
  --popover-foreground:  #e0e0f0;
  --primary:             #a78bfa;
  --primary-foreground:  #1c1e26;
  --secondary:           #2e3044;
  --secondary-foreground: #e0e0f0;
  --muted:               #1a1c24;
  --muted-foreground:    #8888aa;
  --accent:              #2e3044;
  --accent-foreground:   #e0e0f0;
  --destructive:         #f87171;
  --border:              #3a3c52;
  --input:               #16181f;
  --ring:                #a78bfa;
  --radius:              0.45rem;

  --highlight:           #f472b6;
  --accent-1:            #a78bfa;
  --accent-2:            #818cf8;
  --accent-3:            #34d399;
  --surface-raised:      #222436;
  --card-border-accent:  #f472b6;
  --link:                #67e8f9;
  --hero-gradient-start: #222436;
  --hero-gradient-end:   #1c1e26;
  --badge-primary:       #a78bfa;
  --tag-hover:           #a78bfa;
}
```

### 2. Import it in `globals.css`

```css
@import "./my-theme.css";
```

### 3. Register in ThemePicker

Add your theme to the `THEME_MAP` in `packages/nocturne/src/components/ThemePicker.tsx`:

```ts
{
  id: "my-theme",
  label: "My Theme",
  primary: "#a78bfa",
  secondary: "#f472b6",
}
```

If it's a light theme, add the ID to the `LIGHT_THEMES` set in `packages/nocturne/src/layouts/Layout.astro`.

---

## Using theme tokens in your own components

Tailwind utilities generated from `--color-*` tokens:

```html
<p class="text-highlight">Accented text</p>
<p class="text-muted-foreground">Subdued text</p>
<div class="bg-card border border-border rounded-lg p-4">Card</div>
<div style="background: color-mix(in oklch, var(--accent-1) 10%, var(--background))">
  Tinted surface
</div>
```

The `color-mix()` approach is used throughout Nocturne for hover states, focus rings, and the header background tint.
