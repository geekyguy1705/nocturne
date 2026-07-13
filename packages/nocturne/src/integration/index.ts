import type { AstroIntegration } from "astro"
import tailwindcss from "@tailwindcss/vite"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { unified } from "@astrojs/markdown-remark"
import { remarkMermaid } from "../lib/remark-mermaid.ts"
import type { NocturneConfig } from "../config/index.ts"

export interface NocturneIntegrationOptions {
  /** Path to the consumer's config file (e.g. "./nocturne.config.ts"). */
  configFile?: string
  /** Path to the generated SVG paths JSON file. */
  svgPathsFile?: string
  /** Directory containing article markdown files, relative to project root. */
  articlesDirectory?: string
  /** Directory containing project markdown files, relative to project root. */
  projectsDirectory?: string
  /** Directory containing profile markdown files, relative to project root. */
  profileDirectory?: string
}

const VIRTUAL_CONFIG = "virtual:nocturne/config"
const VIRTUAL_SVG_PATHS = "virtual:nocturne/svg-paths"

const RESOLVED_CONFIG = `\0${VIRTUAL_CONFIG}`
const RESOLVED_SVG_PATHS = `\0${VIRTUAL_SVG_PATHS}`

function resolveOption(value: string | undefined, fallback: string): string {
  return value ?? fallback
}

export default function nocturne(options: NocturneIntegrationOptions = {}): AstroIntegration {
  const configFile = resolveOption(options.configFile, "./nocturne.config.ts")
  const svgPathsFile = resolveOption(options.svgPathsFile, "./src/generated/svg-paths.json")
  const articlesDirectory = resolveOption(options.articlesDirectory, "./src/content/articles")
  const projectsDirectory = resolveOption(options.projectsDirectory, "./src/content/projects")
  const profileDirectory = resolveOption(options.profileDirectory, "./src/content/profile")

  return {
    name: "@geekyguy1705/nocturne",
    hooks: {
      "astro:config:setup"({
        updateConfig,
        config,
        injectRoute,
      }) {
        const root = config.root.pathname
        const pkgBase = new URL("../", import.meta.url)

        const routes: Array<{ pattern: string; entrypoint: string }> = [
          { pattern: "/", entrypoint: "routes/index.astro" },
          { pattern: "/404", entrypoint: "routes/404.astro" },
          { pattern: "/profile", entrypoint: "routes/profile.astro" },
          { pattern: "/blog", entrypoint: "routes/blog/index.astro" },
          { pattern: "/blog/[slug]", entrypoint: "routes/blog/[slug].astro" },
          { pattern: "/blog/tag/[tag]", entrypoint: "routes/blog/tag/[tag].astro" },
          { pattern: "/portfolio", entrypoint: "routes/portfolio/index.astro" },
          { pattern: "/portfolio/[slug]", entrypoint: "routes/portfolio/[slug].astro" },
          { pattern: "/portfolio/tag/[tag]", entrypoint: "routes/portfolio/tag/[tag].astro" },
          { pattern: "/portfolio/tags", entrypoint: "routes/portfolio/tags/index.astro" },
          { pattern: "/tags", entrypoint: "routes/tags/index.astro" },
        ]

        for (const route of routes) {
          injectRoute({
            pattern: route.pattern,
            entrypoint: new URL(route.entrypoint, pkgBase),
          })
        }

        const virtualPlugin = {
          name: "nocturne-virtual-modules",
          resolveId(id: string) {
            if (id === VIRTUAL_CONFIG) return RESOLVED_CONFIG
            if (id === VIRTUAL_SVG_PATHS) return RESOLVED_SVG_PATHS
            return null
          },
          load(id: string) {
            if (id === RESOLVED_CONFIG) {
              const configPath = `${root}${configFile.replace(/^\.\//, "")}`
              return [
                `import { normalizeConfig } from "@geekyguy1705/nocturne/config"`,
                `import userConfig from "${configPath}"`,
                `export const siteConfig = normalizeConfig(userConfig)`,
              ].join("\n")
            }
            if (id === RESOLVED_SVG_PATHS) {
              const pathsPath = `${root}${svgPathsFile.replace(/^\.\//, "")}`
              return [
                `import svgPaths from "${pathsPath}"`,
                `export default svgPaths`,
              ].join("\n")
            }
            return null
          },
        }

        updateConfig({
          vite: {
            plugins: [tailwindcss(), virtualPlugin],
          },
          markdown: {
            syntaxHighlight: false,
            processor: unified({
              remarkRehype: { allowDangerousHtml: true },
              remarkPlugins: [remarkGfm, remarkMath, remarkMermaid],
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  { behavior: "append", properties: { className: ["anchor-link"] } },
                ],
                [rehypeKatex, { strict: false }],
                [
                  rehypePrettyCode,
                  {
                    theme: { dark: "github-dark", light: "github-light" },
                    themeCssSelector: (theme: string) => `[data-theme="${theme}"]`,
                    keepBackground: true,
                  },
                ],
              ],
            }),
          },
        })
      },
    },
  }
}

export type { NocturneConfig }

