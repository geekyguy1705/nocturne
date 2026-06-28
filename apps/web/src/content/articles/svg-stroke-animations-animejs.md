---
title: "SVG Stroke Animations with Anime.js v4"
description: "Using Anime.js createDrawable and createTimeline to animate SVG stroke paths with per-glyph stagger and loop control."
publishDate: 2026-06-05
tags: ["animation", "svg", "javascript"]
draft: false
coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"
author: "Abhishek"
readingTime: "8 min"
---

Anime.js v4 introduced a dedicated SVG module with `createDrawable` — a clean API for animating the `stroke-dashoffset` trick without manually computing path lengths.

## The stroke-dashoffset trick

SVG path drawing works by manipulating `stroke-dasharray` and `stroke-dashoffset`. When dasharray equals the total path length and dashoffset equals the same, the stroke is invisible. Reducing dashoffset to zero reveals it left-to-right.

Anime.js abstracts this entirely. You pass a `draw` property as `"start end"` where both values are progress ratios between 0 and 1:

```ts
import { createDrawable, createTimeline } from "animejs"

const path = document.querySelector("path")
const d = createDrawable(path)

createTimeline({ loop: true })
  .add(d, { draw: ["0 0", "0 1", "1 1"], duration: 4800, ease: "linear" })
```

The three keyframes produce:
- `"0 0"` → invisible (head and tail both at position 0)
- `"0 1"` → head sweeps to the end (stroke is fully drawn)
- `"1 1"` → tail catches up (stroke disappears from the left)

## Per-glyph stagger

For a word heading, animating one path per letter with `stagger` creates a wave effect:

```ts
import { stagger } from "animejs/utils"

const glyphs = Array.from(document.querySelectorAll(".draw-path"))
const drawables = glyphs.map(p => createDrawable(p))

createTimeline({ loop: true, loopDelay: 800 })
  .add(drawables, {
    draw: ["0 0", "0 1", "1 1"],
    duration: 4800,
    delay: stagger(200, { start: 300 }),
    ease: "inOutQuad",
  })
```

Each glyph starts 200 ms after the previous, and the first glyph waits 300 ms — so the animation feels like it sweeps left-to-right across the word.

## The ghost layer

Nocturne renders two SVG `<g>` groups per heading: a static ghost layer at low opacity (so the text shape is always visible) and the animated draw layer on top:

```svg
<g opacity="0.45" fill="none" stroke="var(--highlight)" stroke-width="1">
  <!-- ghost paths, always visible -->
</g>
<g fill="none" stroke="var(--primary)" stroke-width="1.5" class="draw-paths">
  <!-- animated paths -->
</g>
```

This gives the animation context — the viewer understands the full word even while strokes are mid-draw.

## IntersectionObserver trigger

Animations should fire when the element enters the viewport, not on page load:

```ts
function observeOnce(selector: string, callback: (el: Element) => void) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      callback(entry.target)
      observer.unobserve(entry.target)
    }
  }, { threshold: 0.15 })

  document.querySelectorAll(selector).forEach(el => observer.observe(el))
}
```

The animation starts only once, 15% into the viewport, and the observer immediately disconnects so it doesn't fire again on scroll-back.
