---
title: "Theming with CSS Variables and OKLCH"
description: "How to build a multi-theme colour system using CSS custom properties and the perceptually uniform OKLCH colour space."
publishDate: 2026-06-01
tags: ["css", "design-systems", "color"]
draft: false
coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"
author: "Abhishek"
readingTime: "7 min"
---

CSS custom properties plus OKLCH form the most maintainable colour system available to web developers today. Here's how to structure it properly.

## Why OKLCH over HSL

HSL feels intuitive but has a perceptual uniformity problem: a yellow at 60° lightness appears much brighter than a blue at the same value. OKLCH solves this by modelling lightness on a uniform scale — meaning you can reliably predict contrast ratios and build accessible palettes programmatically.

```css
/* HSL — misleadingly "equal" lightness */
hsl(60 80% 60%)   /* bright yellow */
hsl(240 80% 60%)  /* much darker blue */

/* OKLCH — perceptually equal */
oklch(0.75 0.18 85)   /* yellow */
oklch(0.75 0.18 265)  /* visually same brightness, blue */
```

## Structuring the token layer

Avoid one giant token file. Use three layers:

| Layer | What it holds | Example |
|---|---|---|
| Primitive | Raw colour values | `--yellow-500: oklch(0.82 0.18 95)` |
| Semantic | Role-based aliases | `--highlight: var(--yellow-500)` |
| Component | Element-scoped | `--btn-bg: var(--primary)` |

The semantic layer is what themes swap. Primitives and component tokens stay stable.

## Defining a theme

```css
html[data-site-theme="tokyonight-night"] {
  --background:   oklch(0.16 0.02 250);
  --foreground:   oklch(0.90 0.03 250);
  --primary:      oklch(0.72 0.17 265);
  --highlight:    oklch(0.68 0.20 265);
  --accent-1:     oklch(0.72 0.17 265);
}
```

Applying the theme is a single attribute on `<html>`. No JavaScript, no class gymnastics.

## Mixing colours at runtime

`color-mix()` lets you derive tints without pre-generating every shade:

```css
.header {
  background: color-mix(in oklch, var(--accent-1) 8%, var(--background) 85%);
}
```

This is how Nocturne tints the header bar to match the active theme's accent while remaining subtle enough not to distract.

## Conclusion

The combination of CSS custom properties for runtime swapping and OKLCH for perceptual uniformity gives you a theme system that's both maintainable and accessible without any JavaScript at the token level.
