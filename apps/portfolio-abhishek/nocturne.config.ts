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
  portfolio: {
    enabled: true,
    mode: "project-pages",
  },
})
