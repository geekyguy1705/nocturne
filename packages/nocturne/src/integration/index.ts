import type { AstroIntegration } from "astro"

export interface NocturneIntegrationOptions {
  configFile?: string
  articlesDirectory?: string
  projectsDirectory?: string
  profileDirectory?: string
}

export default function nocturne(_options: NocturneIntegrationOptions = {}): AstroIntegration {
  return {
    name: "@geekyguy1705/nocturne",
    hooks: {},
  }
}
