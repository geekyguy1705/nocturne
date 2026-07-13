export interface NavLink {
  label: string
  href: string
}

export interface HeroAction {
  label: string
  href: string
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive"
}

export interface HeroConfig {
  eyebrow: string
  actions: HeroAction[]
}

export interface HomeSectionConfig {
  latestArticlesLabel: string
  featuredProjectsLabel: string
}

export interface BlogConfig {
  enabled: boolean
  description: string
  browseTagsLabel: string
}

export interface PortfolioConfig {
  enabled: boolean
  mode: "single-page" | "project-pages"
  description: string
  browseTagsLabel: string
}

export interface ProfileConfig {
  enabled: boolean
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterConfig {
  links: FooterLink[]
}

export interface ThemeConfig {
  defaultLight: string
  defaultDark: string
}

export interface SearchConfig {
  enabled: boolean
}

export interface SEOConfig {
  openGraph: boolean
  twitter: boolean
}

export interface NocturneConfig {
  title: string
  description: string
  url: string
  author: {
    name: string
    email: string
  }
  nav: NavLink[]
  hero: HeroConfig
  home: HomeSectionConfig
  blog: BlogConfig
  portfolio: PortfolioConfig
  profile: ProfileConfig
  footer: FooterConfig
  themes: ThemeConfig
  search: SearchConfig
  seo: SEOConfig
}

export const defaultConfig: NocturneConfig = {
  title: "Nocturne",
  description:
    "A dark-first personal site template — animated SVG headings, 15 themes, content collections, and full-text search.",
  url: "https://example.com",
  author: {
    name: "Author Name",
    email: "hello@example.com",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ],
  hero: {
    eyebrow: "Astro Template",
    actions: [
      { label: "Read the blog", href: "/blog" },
      { label: "View profile", href: "/profile", variant: "outline" },
    ],
  },
  home: {
    latestArticlesLabel: "Latest articles",
    featuredProjectsLabel: "Featured projects",
  },
  blog: {
    enabled: true,
    description:
      "Articles on frontend engineering, design systems, and static-site generators.",
    browseTagsLabel: "Browse tags",
  },
  portfolio: {
    enabled: true,
    mode: "project-pages",
    description: "Selected projects and case studies.",
    browseTagsLabel: "Browse tags",
  },
  profile: {
    enabled: true,
  },
  footer: {
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Profile", href: "/profile" },
    ],
  },
  themes: {
    defaultLight: "latte",
    defaultDark: "tokyonight-night",
  },
  search: {
    enabled: true,
  },
  seo: {
    openGraph: true,
    twitter: true,
  },
}

function deepMerge<T>(base: T, override: Partial<T> | undefined): T {
  if (override === undefined) return base
  if (typeof base !== "object" || base === null) return (override ?? base) as T
  if (Array.isArray(base)) return (override as T) ?? base
  const result = { ...base } as Record<string, unknown>
  const ov = override as Record<string, unknown>
  for (const key of Object.keys(ov)) {
    if (
      typeof base[key as keyof T] === "object" &&
      base[key as keyof T] !== null &&
      !Array.isArray(base[key as keyof T]) &&
      typeof ov[key] === "object" &&
      ov[key] !== null
    ) {
      result[key] = deepMerge(
        base[key as keyof T],
        ov[key] as Partial<T[keyof T]>
      )
    } else {
      result[key] = ov[key]
    }
  }
  return result as T
}

function validateConfig(config: NocturneConfig): void {
  if (
    config.portfolio.mode !== "single-page" &&
    config.portfolio.mode !== "project-pages"
  ) {
    throw new Error(
      `Invalid portfolio mode: "${config.portfolio.mode}". Must be "single-page" or "project-pages".`
    )
  }
}

export function defineNocturneConfig<TConfig extends Partial<NocturneConfig>>(
  config: TConfig
): NocturneConfig {
  const merged = deepMerge(defaultConfig, config)
  validateConfig(merged)
  return merged
}

export function normalizeConfig(
  config: Partial<NocturneConfig>
): NocturneConfig {
  const merged = deepMerge(defaultConfig, config)
  validateConfig(merged)
  return merged
}
