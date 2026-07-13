---
title: "Designing for Dark Mode Without Compromise"
description: "Dark mode is more than inverting colours. A practical guide to contrast, surface layering, and colour mixing that makes dark UIs feel intentional."
publishDate: 2026-06-20
tags: ["design", "css", "accessibility"]
draft: false
coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80"
author: "Abhishek"
readingTime: "7 min"
---

Most dark mode implementations are afterthoughts — the same colours inverted, with pure black backgrounds that destroy depth. Good dark mode design is a separate design system, not a stylesheet toggle.

## The pure black problem

Pure `#000000` backgrounds create excessive contrast with text, causing halation — a visual blurring where bright text appears to glow on very dark backgrounds. More importantly, pure black has no room to express depth through layering.

A better baseline:

```css
--background:    oklch(0.16 0.02 250);  /* dark, but not black */
--card:          oklch(0.13 0.02 250);  /* slightly darker — recedes */
--surface-raised: oklch(0.19 0.02 250); /* slightly lighter — comes forward */
```

Surfaces step in ~0.03–0.05 L units. This is subtle enough to feel calm but distinct enough to communicate hierarchy.

## Reduce saturation, not just lightness

Bright, fully saturated colours look neon on dark backgrounds. Reduce chroma (C in OKLCH) alongside lightness when moving a colour to dark mode:

| Token | Light mode | Dark mode |
|---|---|---|
| `--primary` | `oklch(0.45 0.25 265)` | `oklch(0.72 0.17 265)` |
| `--highlight` | `oklch(0.55 0.22 30)` | `oklch(0.75 0.18 30)` |

Lighter, less saturated — but the hue angle stays identical, preserving brand identity.

## Text contrast tiers

Avoid relying on a single foreground colour. Use three tiers:

```css
--foreground:         oklch(0.90 0.02 250);  /* primary text */
--muted-foreground:   oklch(0.65 0.03 250);  /* secondary/metadata */
--placeholder:        oklch(0.45 0.02 250);  /* hints, empty states */
```

Each tier should pass WCAG AA against the `--background` for its intended use. Check with `color-contrast()` in CSS or a tool like Polypane.

## Coloured surfaces vs neutral surfaces

Dark mode UIs look flat when every surface uses the same grey step. Introduce subtle chroma into surfaces to make them feel alive without being distracting:

```css
/* Neutral — safe, boring */
--card: oklch(0.14 0.00 0);

/* Lightly chromatic — uses the theme hue */
--card: oklch(0.14 0.02 250);
```

The 0.02 C value is imperceptible in isolation but creates warmth when surfaces sit together.

## Glow effects for interactive elements

Dark backgrounds make glow viable where it would look tacky on light backgrounds. Use `box-shadow` with the primary colour at low opacity:

```css
.btn-primary:focus-visible {
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--primary),
              0 0 12px color-mix(in oklch, var(--primary) 40%, transparent);
}
```

The third shadow adds a soft bloom that communicates focus without being harsh.

## Conclusion

Dark mode done well is not an accessibility checkbox. It's a distinct visual language with its own rules around depth, saturation, and surface layering. Build it as a first-class theme, not a fallback.
