declare module "virtual:nocturne/config" {
  import type { NocturneConfig } from "./config/index.ts"
  export const siteConfig: NocturneConfig
}

interface SvgGlyph {
  d: string
}

interface SvgPathEntry {
  key: string
  glyphs: SvgGlyph[]
  totalWidth: number
  height: number
}

declare module "virtual:nocturne/svg-paths" {
  const svgPaths: SvgPathEntry[]
  export default svgPaths
}

declare module "opentype.js" {
  export interface Font {
    unitsPerEm: number
    ascender: number
    descender: number
    tables: {
      os2?: {
        sCapHeight?: number
      }
    }
    charToGlyph(char: string): Glyph
    getKerningValue(left: Glyph, right: Glyph): number
    parse(buffer: ArrayBuffer): Font
  }
  export interface Glyph {
    advanceWidth: number
    getPath(x: number, y: number, fontSize: number): { toPathData(decimals?: number): string }
  }
  export function parse(buffer: ArrayBuffer): Font
}

