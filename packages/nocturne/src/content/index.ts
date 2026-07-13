import { z, type ZodTypeAny } from "zod"

export interface SocialLink {
  name: string
  url: string
  icon?: string
}

export function createArticleSchema<T extends Record<string, ZodTypeAny>>(
  extensions?: T
) {
  return z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
    author: z.string().default("Author Name"),
    readingTime: z.string().optional(),
    ...extensions,
  })
}

export function createProjectSchema<T extends Record<string, ZodTypeAny>>(
  extensions?: T
) {
  return z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    link: z.string().optional(),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
    ...extensions,
  })
}

export function createProfileSchema<T extends Record<string, ZodTypeAny>>(
  extensions?: T
) {
  return z.object({
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
    ...extensions,
  })
}

export function validateProfileCollection(
  profileEntries: { id: string }[],
  enabled: boolean
): void {
  if (!enabled) return
  if (profileEntries.length === 0) {
    throw new Error(
      "Profile collection is enabled but no profile entries were found. Add exactly one profile entry or disable profile in your config."
    )
  }
  if (profileEntries.length > 1) {
    throw new Error(
      `Profile collection is enabled but ${profileEntries.length} profile entries were found. Exactly one profile entry is required.`
    )
  }
}
