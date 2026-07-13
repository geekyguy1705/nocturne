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
  portfolio: {
    enabled: true,
    mode: "project-pages",
  },
})
