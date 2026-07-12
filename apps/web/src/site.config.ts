export const siteConfig = {
  title: "Nocturne",
  description: "A dark-first personal site template built on top of AstroJS - animated SVG headings, 15 themes, content collections, and full-text search.",
  url: "https://nocturne.abhisheklaha.in",
  author: {
    name: "Abhishek",
    email: "hello@nocturne.dev",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ],
  portfolio: {
    enabled: true,
    mode: "project-pages" as "single-page" | "project-pages",
  },
}
