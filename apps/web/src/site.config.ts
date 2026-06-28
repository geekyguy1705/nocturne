export const siteConfig = {
  title: "Abhishek",
  description: "A personal blog and portfolio site built with Astro, Markdown, and shadcn/ui.",
  url: "https://example.com",
  author: {
    name: "Abhishek",
    email: "hello@example.com",
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
