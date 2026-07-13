import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import {
  createArticleSchema,
  createProjectSchema,
  createProfileSchema,
} from "@geekyguy1705/nocturne/content"

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: createArticleSchema(),
})

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: createProjectSchema(),
})

const profile = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/profile" }),
  schema: createProfileSchema(),
})

export const collections = {
  articles,
  projects,
  profile,
}
