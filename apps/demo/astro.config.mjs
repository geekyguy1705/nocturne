import { defineConfig } from "astro/config"
import { nocturne } from "@geekyguy1705/nocturne/astro"
import react from "@astrojs/react"

export default defineConfig({
  site: "https://demo.nocturne.dev",
  output: "static",
  integrations: [
    react(),
    nocturne({
      configFile: "./nocturne.config.ts",
      svgPathsFile: "./src/generated/svg-paths.json",
      articlesDirectory: "./src/content/articles",
      projectsDirectory: "./src/content/projects",
      profileDirectory: "./src/content/profile",
    }),
  ],
})
