/**
 * gen-svg-paths.ts
 * Converts Inter 600 text headings to per-glyph SVG <path> data at build time.
 * Eliminates stroke intersection issues that arise with SVG <text> elements.
 *
 * Run: node --experimental-strip-types ./scripts/gen-svg-paths.ts
 * Output: src/generated/svg-paths.json
 */

import opentype from "opentype.js"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import { siteConfig } from "../src/site.config.ts"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Font path ──────────────────────────────────────────────────────────────
// Walk up from apps/web to find the hoisted pnpm location of @fontsource/inter
function findFontFile(): string {
  const candidates = [
    path.join(__dirname, "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff"),
    path.join(__dirname, "../../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff"),
    path.join(__dirname, "../../../node_modules/.pnpm/@fontsource+inter@5.2.8/node_modules/@fontsource/inter/files/inter-latin-600-normal.woff"),
  ]
  // Also search pnpm virtual store dynamically
  const store = path.join(__dirname, "../../../node_modules/.pnpm")
  if (fs.existsSync(store)) {
    for (const entry of fs.readdirSync(store)) {
      if (entry.startsWith("@fontsource+inter@")) {
        candidates.unshift(path.join(store, entry, "node_modules/@fontsource/inter/files/inter-latin-600-normal.woff"))
      }
    }
  }
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  throw new Error("Could not find inter-latin-600-normal.woff. Run: pnpm --filter web add -D @fontsource/inter")
}

const FONT_PATH = findFontFile()

// ── Slugify (matches src/lib/utils.ts) ──────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

// ── Heading definitions ────────────────────────────────────────────────────
// Collect all tag values from content directory
const CONTENT_DIR = path.join(__dirname, "../src/content/articles")
const tags = new Set<string>()
for (const file of fs.readdirSync(CONTENT_DIR)) {
  if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8")
  const m = raw.match(/^tags:\s*\[([^\]]+)\]/m)
  if (m) {
    m[1].split(",").forEach((t) => tags.add(t.trim().replace(/['"]/g, "")))
  }
}

// Collect all tag values from projects directory
const PROJECTS_DIR = path.join(__dirname, "../src/content/projects")
const projectTags = new Set<string>()
if (fs.existsSync(PROJECTS_DIR)) {
  for (const file of fs.readdirSync(PROJECTS_DIR)) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8")
    const m = raw.match(/^tags:\s*\[([^\]]+)\]/m)
    if (m) {
      m[1].split(",").forEach((t) => projectTags.add(t.trim().replace(/['"]/g, "")))
    }
  }
}

// Profile name from content
const PROFILE_DIR = path.join(__dirname, "../src/content/profile")
let profileName = "Abhishek"
if (fs.existsSync(PROFILE_DIR)) {
  for (const file of fs.readdirSync(PROFILE_DIR)) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue
    const raw = fs.readFileSync(path.join(PROFILE_DIR, file), "utf-8")
    const m = raw.match(/^name:\s*["']?([^"'\n]+)["']?/m)
    if (m) { profileName = m[1].trim(); break }
  }
}

type HeadingDef = { key: string; text: string; fontSize: number }

const headings: HeadingDef[] = [
  { key: "hero",       text: siteConfig.title,  fontSize: 72 },
  { key: "blog",       text: "Blog",             fontSize: 44 },
  { key: "portfolio",  text: "Portfolio",        fontSize: 44 },
  { key: "profile",    text: profileName,        fontSize: 44 },
  ...Array.from(tags).map((tag) => ({
    key:      `tag:${tag}`,
    text:     `Tag: ${tag}`,
    fontSize: 44,
  })),
  ...Array.from(projectTags).map((tag) => ({
    key:      `project-tag:${slugify(tag)}`,
    text:     `Tag: ${tag}`,
    fontSize: 44,
  })),
]

// ── Glyph path extraction ──────────────────────────────────────────────────
type GlyphData = {
  d: string        // SVG path data
  x: number        // glyph advance origin x
  width: number    // glyph advance width
}

type HeadingOutput = {
  key: string
  text: string
  fontSize: number
  totalWidth: number
  height: number   // cap-height in svg units for viewBox
  glyphs: GlyphData[]
}

function extractGlyphs(font: opentype.Font, text: string, fontSize: number): HeadingOutput {
  const scale = fontSize / font.unitsPerEm
  const capHeight = (font.tables.os2?.sCapHeight ?? font.ascender) * scale
  const descender = Math.abs(font.descender) * scale
  const height = capHeight + descender

  let cursorX = 0
  const glyphs: GlyphData[] = []

  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i])
    const glyphPath = glyph.getPath(cursorX, capHeight, fontSize)
    const d = glyphPath.toPathData(4)
    const advance = (glyph.advanceWidth ?? 0) * scale

    // Get kerning for next pair
    let kern = 0
    if (i < text.length - 1) {
      const nextGlyph = font.charToGlyph(text[i + 1])
      kern = font.getKerningValue(glyph, nextGlyph) * scale
    }

    glyphs.push({ d, x: cursorX, width: advance })
    cursorX += advance + kern
  }

  return {
    key: "",
    text,
    fontSize,
    totalWidth: cursorX,
    height: Math.ceil(height),
    glyphs,
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
console.log(`Loading font: ${FONT_PATH}`)
const fontBuffer = fs.readFileSync(FONT_PATH)
const font = opentype.parse(fontBuffer.buffer)

const output: HeadingOutput[] = headings.map((h) => {
  const result = extractGlyphs(font, h.text, h.fontSize)
  result.key = h.key
  console.log(`  ${h.key}: "${h.text}" → ${result.glyphs.length} glyphs, width=${result.totalWidth.toFixed(1)}`)
  return result
})

const outDir = path.join(__dirname, "../src/generated")
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const outFile = path.join(outDir, "svg-paths.json")
fs.writeFileSync(outFile, JSON.stringify(output, null, 2))
console.log(`\nWritten: ${outFile}`)
