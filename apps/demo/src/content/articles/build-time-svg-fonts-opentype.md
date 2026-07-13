---
title: "Build-Time SVG Fonts with opentype.js"
description: "Why SVG <text> stroke animations cause intersecting glyphs, and how to fix it at the vector level using opentype.js to extract per-glyph paths at build time."
publishDate: 2026-06-10
tags: ["svg", "typography", "build-tools"]
draft: false
coverImage: "https://images.unsplash.com/photo-1524666643752-b381eb00effb?w=800&q=80"
author: "Abhishek"
readingTime: "9 min"
---

When you apply a stroke to an SVG `<text>` element and animate it, the strokes of adjacent glyphs bleed into each other. This is a fundamental limitation of SVG text rendering — fixing it requires converting text to individual `<path>` elements at build time.

## The problem with SVG `<text>` strokes

An SVG `<text>` element renders its stroke centred on the glyph outlines. When two glyphs sit close together (as they do in most typefaces), their stroke halves overlap at the boundary, creating a visible dark blob between letters.

```svg
<!-- This looks fine as fill, but strokes intersect between letters -->
<text stroke="currentColor" stroke-width="2">Hello</text>
```

CSS fixes like `paint-order: stroke fill` reduce bleed but don't eliminate it — the paths still share space.

## The vector-level fix

The only clean solution is to have each glyph as its own isolated `<path>`. Then each path's stroke is contained entirely within its own bounding box with no neighbours to intersect.

`opentype.js` can parse a font file and extract the exact SVG path data for any glyph at any size:

```ts
import opentype from "opentype.js"
import fs from "node:fs"

const buffer = fs.readFileSync("inter-latin-600-normal.woff")
const font = opentype.parse(buffer.buffer)

const glyph = font.charToGlyph("A")
const path = glyph.getPath(0, 60, 72)  // x, baseline y, fontSize
const d = path.toPathData(4)            // SVG path data, 4 decimal precision
```

## The build script

Nocturne's `scripts/gen-svg-paths.ts` runs before every build to extract paths for all heading texts:

```ts
function extractGlyphs(font, text, fontSize) {
  const scale = fontSize / font.unitsPerEm
  const capHeight = (font.tables.os2?.sCapHeight ?? font.ascender) * scale
  let cursorX = 0
  const glyphs = []

  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i])
    const d = glyph.getPath(cursorX, capHeight, fontSize).toPathData(4)
    const advance = (glyph.advanceWidth ?? 0) * scale

    // Apply kerning between adjacent pairs
    let kern = 0
    if (i < text.length - 1) {
      kern = font.getKerningValue(glyph, font.charToGlyph(text[i + 1])) * scale
    }

    glyphs.push({ d, x: cursorX, width: advance })
    cursorX += advance + kern
  }

  return { glyphs, totalWidth: cursorX, height: Math.ceil(capHeight) }
}
```

The output is a JSON file (`src/generated/svg-paths.json`) containing pre-computed path data for every heading on the site.

## One important caveat: woff vs woff2

`opentype.js` can parse woff files directly but **not** woff2 (which uses Brotli compression). Most modern font packages ship only woff2. The solution is to depend on the static `@fontsource/inter` package alongside the variable version — it provides woff files:

| Package | Format | opentype.js compatible? |
|---|---|---|
| `@fontsource-variable/inter` | woff2 only | ❌ |
| `@fontsource/inter` | woff + woff2 | ✅ (use woff) |

The static woff is only needed at build time — it never ships to the browser.

## Using the paths in Astro

Import the JSON in each page's frontmatter and render two `<g>` groups — one ghost, one animated:

```astro
---
import svgPaths from "@/generated/svg-paths.json"
const heroPaths = svgPaths.find(h => h.key === "hero")!
---

<svg viewBox={`0 0 ${heroPaths.totalWidth + 8} ${heroPaths.height + 8}`}>
  <g opacity="0.45" fill="none" stroke="var(--highlight)" stroke-width="1">
    {heroPaths.glyphs.map(g => <path d={g.d} />)}
  </g>
  <g fill="none" stroke="var(--primary)" stroke-width="1.5" class="draw-paths">
    {heroPaths.glyphs.map(g => <path d={g.d} class="draw-path" />)}
  </g>
</svg>
```

No stroke intersections — each `<path>` is a fully isolated glyph outline.
