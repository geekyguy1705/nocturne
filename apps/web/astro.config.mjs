// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import { remarkMermaid } from "./src/lib/remark-mermaid.ts"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

// https://astro.build/config
export default defineConfig({
  site: "https://localhost:4321",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  markdown: {
    syntaxHighlight: false,
    remarkRehype: { allowDangerousHtml: true },
    remarkPlugins: [remarkGfm, remarkMath, remarkMermaid],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append", properties: { className: ["anchor-link"] } }],
      [rehypeKatex, { strict: false }],
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark", light: "github-light" },
          themeCssSelector: (/** @type {string} */ theme) => `[data-theme="${theme}"]`,
          keepBackground: true,
        },
      ],
    ],
  },
})
