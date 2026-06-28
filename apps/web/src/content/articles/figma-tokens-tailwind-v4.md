---
title: "From Figma Tokens to Tailwind v4 CSS Variables"
description: "A practical workflow for exporting design tokens from Figma and consuming them as first-class Tailwind v4 utilities — no config file required."
publishDate: 2026-06-25
tags: ["design-systems", "tailwind", "figma"]
draft: false
coverImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80"
author: "Abhishek"
readingTime: "8 min"
---

Tailwind v4 dropped `tailwind.config.js` in favour of a pure CSS configuration model. This turns out to be the best thing to happen to design token workflows — CSS variables defined in Tailwind's `@theme` block become utility classes automatically.

## Tailwind v4's @theme block

```css
@import "tailwindcss";

@theme {
  --color-highlight: oklch(0.68 0.20 265);
  --color-accent-1:  oklch(0.72 0.17 265);
}
```

This generates `text-highlight`, `bg-highlight`, `border-highlight`, and every other colour utility — no plugin, no config. The variable name maps directly to the utility name.

## Exporting from Figma

Use the **Tokens Studio** (formerly Style Dictionary) Figma plugin to export your colour styles as a JSON token file:

```json
{
  "color": {
    "highlight": { "value": "#7aa2f7", "type": "color" },
    "accent-1":  { "value": "#bb9af7", "type": "color" }
  }
}
```

Then run a small transform script to convert hex values to OKLCH and emit CSS variables:

```ts
import { formatHex, oklch, parse } from "culori"

function hexToOklch(hex: string): string {
  const c = oklch(parse(hex))!
  return `oklch(${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h?.toFixed(1) ?? 0})`
}
```

## The transform pipeline

```
Figma Tokens Studio
      ↓ export JSON
tokens.json
      ↓ transform script
theme.css  (@theme block with OKLCH values)
      ↓ import in globals.css
Tailwind utilities auto-generated
```

| Step | Tool |
|---|---|
| Design | Figma + Tokens Studio |
| Export | JSON token file |
| Transform | Node script (culori) |
| Consume | Tailwind v4 `@theme` |

## Multi-theme with data attributes

Nocturne takes this one step further — the `@theme` block defines the default (Tokyo Night) and per-theme overrides use `html[data-site-theme]` selectors:

```css
@theme {
  --color-primary:   oklch(0.72 0.17 265);
  --color-highlight: oklch(0.68 0.20 265);
}

html[data-site-theme="mocha"] {
  --color-primary:   oklch(0.80 0.15 305);
  --color-highlight: oklch(0.82 0.12 350);
}
```

Switching themes is a single `setAttribute("data-site-theme", id)` call — no CSS class churn, no JS-in-CSS tricks.

## Syncing Figma and code

The workflow becomes a one-way sync: Figma is the source of truth, the transform script produces the CSS. For Nocturne, palette sources come from `@catppuccin/palette` and `@rose-pine/palette` npm packages — versioned, testable, and diffable. Run `pnpm sync:themes` to regenerate all theme CSS from their latest palette definitions.
