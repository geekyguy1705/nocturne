import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "zod"

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
    author: z.string().default("Abhishek"),
    readingTime: z.string().optional(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    link: z.string().optional(),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
})

const profile = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/profile" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    social: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          icon: z.string().optional(),
        })
      )
      .default([]),
    skills: z.array(z.string()).default([]),
    resumeLink: z.string().optional(),
  }),
})

export const collections = {
  articles,
  projects,
  profile,
}
