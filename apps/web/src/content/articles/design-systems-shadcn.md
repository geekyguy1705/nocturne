---
title: "Design Systems with shadcn/ui: A Nova Theme Walkthrough"
description: "A look at how shadcn/ui presets, design tokens, and Tailwind v4 come together in the Nova style."
publishDate: 2026-06-15
updatedDate: 2026-06-22
tags: ["shadcn", "design-systems", "tailwind"]
draft: false
coverImage: "/cover-placeholder.svg"
author: "Abhishek"
readingTime: "8 min"
---

A design system only works when every component shares the same language of color, spacing, and typography. shadcn/ui encodes that language in a single CSS file and a preset code.

## The Nova preset

The Nova style is a Radix-based variant that uses subtle borders, translucent menus, and a soft color palette. With one CLI command the entire project picks up the theme:

```bash
pnpm dlx shadcn@latest apply <preset>
```

## Color tokens

Semantic tokens keep the code readable and themeable:

```css
:root {
  --primary: oklch(0.852 0.199 91.936);
  --primary-foreground: oklch(0.421 0.095 57.708);
  --chart-1: oklch(0.852 0.199 91.936);
}
```

## Task list for a design-system review

- [x] Audit every color against the preset
- [x] Check contrast ratios for dark mode
- [ ] Document component composition rules
- [ ] Add a visual regression test

## Typography and layout math

The Nova radius feels small but not sharp. The golden ratio appears in many spacing scales:

$$
\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618
$$

This ratio is often used for type scales and grid proportions.[^1]

## A note on accessibility

> Always test your theme in both light and dark modes. A color that looks fine on a white background may fail contrast on a dark background.

## Footnotes

[^1]: See the *Elements of Typographic Style* by Robert Bringhurst for a deep dive on classical ratios.
