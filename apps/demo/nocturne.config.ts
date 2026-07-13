import { defineNocturneConfig } from "@geekyguy1705/nocturne/config"

export default defineNocturneConfig({
  title: "Nocturne Demo",
  description:
    "A demo site running on the Nocturne 2.0 package — animated SVG headings, themes, content collections, and full-text search.",
  url: "https://demo.nocturne.dev",
  author: {
    name: "Demo Author",
    email: "demo@nocturne.dev",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Profile", href: "/profile" },
  ],
  hero: {
    eyebrow: "Nocturne 2.0",
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
