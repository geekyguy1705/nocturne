import { defineNocturneConfig } from "@geekyguy1705/nocturne/config"

export default defineNocturneConfig({
  title: "Abhishek Laha",
  description:
    "Senior DevOps & Platform Engineer with 5+ years building cloud-native platforms on Azure & GCP | CKAD certified.",
  url: "https://nocturne-rho-three.vercel.app",
  author: {
    name: "Abhishek Laha",
    email: "abhisheklaha199@gmail.com",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ],
  hero: {
    eyebrow: "Senior DevOps & Platform Engineer",
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
      "Articles on DevOps, Kubernetes, cloud-native platforms, and platform engineering.",
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
