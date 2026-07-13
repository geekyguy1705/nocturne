import { defineNocturneConfig } from "@geekyguy1705/nocturne/config"

export default defineNocturneConfig({
  title: "Nocturne",
  description:
    "A dark-first personal site template — animated SVG headings, 15 themes, content collections, and full-text search.",
  url: "https://nocturne.abhisheklaha.in",
  author: {
    name: "Nocturne",
    email: "hello@nocturne.dev",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Profile", href: "/profile" },
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
  footer: {
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Profile", href: "/profile" },
    ],
  },
})
