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
