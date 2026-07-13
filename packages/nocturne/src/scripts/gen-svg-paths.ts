/**
 * gen-svg-paths.ts
 * Converts Inter 600 text headings to per-glyph SVG <path> data at build time.
 * Eliminates stroke intersection issues that arise with SVG <text> elements.
 *
 * Run: node --experimental-strip-types ./src/scripts/gen-svg-paths.ts
 * Output: src/generated/svg-paths.json (or custom path via --out)
 *
 * Options:
 *   --config <path>     Path to nocturne config file (default: ./nocturne.config.ts)
 *   --content <dir>     Base content directory (default: ./src/content)
 *   --out <path>        Output JSON file path (default: ./src/generated/svg-paths.json)
 */

import opentype from "opentype.js"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface CliOptions {
  configPath: string
  contentDir: string
  outPath: string
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const opts: CliOptions = {
    configPath: "./nocturne.config.ts",
    contentDir: "./src/content",
    outPath: "./src/generated/svg-paths.json",
  }
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--config" && args[i + 1]) opts.configPath = args[i + 1]
    if (args[i] === "--content" && args[i + 1]) opts.contentDir = args[i + 1]
    if (args[i] === "--out" && args[i + 1]) opts.outPath = args[i + 1]
  }
  return opts
}

const opts = parseArgs()

function findFontFile(): string {
  const candidates = [
    path.join(__dirname, "../node_modules/@fontsource-variable/inter/files/inter-latin-600-normal.woff"),
    path.join(__dirname, "../../node_modules/@fontsource-variable/inter/files/inter-latin-600-normal.woff"),
    path.join(__dirname, "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff"),
    path.join(__dirname, "../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff"),
  ]
  const store = path.join(__dirname, "../../node_modules/.pnpm")
  if (fs.existsSync(store)) {
    for (const entry of fs.readdirSync(store)) {
      if (entry.startsWith("@fontsource+variable+inter@") || entry.startsWith("@fontsource+inter@")) {
        candidates.unshift(
          path.join(store, entry, "node_modules/@fontsource-variable/inter/files/inter-latin-600-normal.woff"),
          path.join(store, entry, "node_modules/@fontsource/inter/files/inter-latin-600-normal.woff")
        )
      }
    }
  }
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  throw new Error(
    "Could not find inter-latin-600-normal.woff. Run: pnpm add @fontsource-variable/inter"
  )
}

const FONT_PATH = findFontFile()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

function collectTagsFromDir(dir: string): Set<string> {
  const tags = new Set<string>()
  if (!fs.existsSync(dir)) return tags
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue
    const raw = fs.readFileSync(path.join(dir, file), "utf-8")
    const m = raw.match(/^tags:\s*\[([^\]]+)\]/m)
    if (m) {
      m[1].split(",").forEach((t) => tags.add(t.trim().replace(/['"]/g, "")))
    }
  }
  return tags
}

function collectProfileName(profileDir: string): string {
  if (!fs.existsSync(profileDir)) return "Profile"
  for (const file of fs.readdirSync(profileDir)) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue
    const raw = fs.readFileSync(path.join(profileDir, file), "utf-8")
    const m = raw.match(/^name:\s*["']?([^"'\n]+)["']?/m)
    if (m) return m[1].trim()
  }
  return "Profile"
}

const configModule = await import(pathToFileURL(path.resolve(opts.configPath)).href)
const siteConfig = configModule.default ?? configModule.siteConfig

const articlesDir = path.join(opts.contentDir, "articles")
const projectsDir = path.join(opts.contentDir, "projects")
const profileDir = path.join(opts.contentDir, "profile")

const tags = collectTagsFromDir(articlesDir)
const projectTags = collectTagsFromDir(projectsDir)
const profileName = collectProfileName(profileDir)

type HeadingDef = { key: string; text: string; fontSize: number }

const headings: HeadingDef[] = [
  { key: "hero", text: siteConfig.title, fontSize: 72 },
  { key: "blog", text: "Blog", fontSize: 44 },
  { key: "portfolio", text: "Portfolio", fontSize: 44 },
  { key: "profile", text: profileName, fontSize: 44 },
  ...Array.from(tags).map((tag) => ({
    key: `tag:${tag}`,
    text: `Tag: ${tag}`,
    fontSize: 44,
  })),
  ...Array.from(projectTags).map((tag) => ({
    key: `project-tag:${slugify(tag)}`,
    text: `Tag: ${tag}`,
    fontSize: 44,
  })),
]

type GlyphData = {
  d: string
  x: number
  width: number
}

type HeadingOutput = {
  key: string
  text: string
  fontSize: number
  totalWidth: number
  height: number
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

console.log(`Loading font: ${FONT_PATH}`)
const fontBuffer = fs.readFileSync(FONT_PATH)
const font = opentype.parse(fontBuffer.buffer)

const output: HeadingOutput[] = headings.map((h) => {
  const result = extractGlyphs(font, h.text, h.fontSize)
  result.key = h.key
  console.log(`  ${h.key}: "${h.text}" → ${result.glyphs.length} glyphs, width=${result.totalWidth.toFixed(1)}`)
  return result
})

const outDir = path.dirname(opts.outPath)
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

fs.writeFileSync(opts.outPath, JSON.stringify(output, null, 2))
console.log(`\nWritten: ${opts.outPath}`)
