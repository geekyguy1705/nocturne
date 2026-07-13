---
title: "Palette Studio"
description: "An in-browser colour palette editor built around OKLCH, with real-time contrast checking, CSS variable export, and theme preview."
tags: ["Vue 3", "TypeScript", "Canvas API", "OKLCH", "culori", "Vite"]
date: 2026-02-20
link: "https://palette-studio.example.com"
featured: false
coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
---

Palette Studio is a colour tool built specifically for design system work. Most colour pickers operate in HSL or RGB — Palette Studio works in OKLCH, the perceptually uniform colour space that makes programmatic palette generation actually predictable.

## Core features

- **OKLCH picker** with L, C, H sliders — visual feedback shows perceptual lightness accurately
- **Contrast checker** — live WCAG AA/AAA ratio for any foreground/background pair
- **Palette scales** — generate a 9-step scale by stepping L while holding C and H constant
- **CSS export** — one-click copy of `@theme` block for Tailwind v4 or raw `--variable` declarations
- **Theme preview** — renders a mini UI mockup using the current palette so you can see surfaces, text, and accents together

## The OKLCH advantage in code

```ts
import { oklch, parse } from "culori"

// Generate a 9-step scale for any base colour
function generateScale(base: string): string[] {
  const c = oklch(parse(base))!
  return Array.from({ length: 9 }, (_, i) => {
    const l = 0.15 + i * 0.09  // 0.15 → 0.87
    return `oklch(${l.toFixed(3)} ${c.c.toFixed(3)} ${c.h?.toFixed(1) ?? 0})`
  })
}
```

Because OKLCH lightness is perceptually uniform, each step in the scale looks evenly spaced — something HSL scales cannot guarantee.

## Canvas rendering

The hue/chroma picker is a Canvas element that maps the 2D space of C (x-axis) and H (y-axis) while holding L constant at the current value. Re-rendering only happens on L change, keeping interactions smooth on low-end devices.

## Outcome

Used internally for generating all 15 Nocturne themes. Reduced the time to create a new theme from 2–3 hours of manual colour selection to roughly 20 minutes.
