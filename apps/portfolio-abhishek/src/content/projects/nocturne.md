---
title: "Nocturne"
description: "Abhishek's personal portfolio site built with Astro, Tailwind v4, and Anime.js ΓÇö featuring animated SVG headings, 15 themes, and full-text search."
tags: ["Astro", "TypeScript", "Tailwind CSS v4", "Anime.js", "opentype.js", "shadcn/ui"]
date: 2026-06-28
link: "https://nocturne-rho-three.vercel.app/"
featured: true
coverImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80"
---

Nocturne started as a personal playground for ideas I kept wanting to try ΓÇö per-glyph SVG stroke animations, a proper multi-theme colour system using OKLCH, and a Markdown blog that feels as fast as a static file server.

## What makes it different

Most Astro blog templates stop at content collections and a theme toggle. Nocturne goes further:

- **Per-glyph SVG paths** generated at build time using `opentype.js` ΓÇö no stroke intersections between letters
- **15 themes** across 6 colour schemes (Catppuccin, Gruvbox, Ros├⌐ Pine, Nord, Dracula, Tokyo Night) ΓÇö all defined as CSS custom properties with OKLCH values
- **Anime.js v4** spring physics for card interactions and `createDrawable` for heading animations
- **Pagefind** full-text search indexed post-build ΓÇö zero JavaScript bundle overhead

## Technical highlights

The theme system uses a three-layer token architecture: primitives (raw OKLCH values), semantic aliases (`--highlight`, `--primary`), and component-scoped tokens. Themes swap the semantic layer only ΓÇö component styles never change.

The SVG heading system runs a Node script (`gen-svg-paths.ts`) before every build that loads the Inter 600 woff font via `opentype.js`, extracts per-glyph `<path>` data for every heading text, and writes them to a JSON file that Astro imports at build time. The result is a heading that animates cleanly with no font-loading dependency at runtime.

## Outcome

The template scores 100 on Lighthouse performance and accessibility. Cold build time (including path generation and Pagefind indexing) is under 8 seconds.
