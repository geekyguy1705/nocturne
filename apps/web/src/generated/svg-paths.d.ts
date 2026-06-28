export interface GlyphData {
  d: string
  x: number
  width: number
}

export interface HeadingPaths {
  key: string
  text: string
  fontSize: number
  totalWidth: number
  height: number
  glyphs: GlyphData[]
}

declare const svgPaths: HeadingPaths[]
export default svgPaths
