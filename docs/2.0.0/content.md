# Content Collections Guide

Nocturne 2.0.0 uses Astro Content Collections with Zod schemas for type-safe Markdown content. The package provides schema factory functions — your app owns the `content.config.ts` and content files.

---

## Setup

Create `src/content.config.ts` in your app:

```ts
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

export const collections = { articles, projects, profile }
```

---

## Directory structure

```
src/content/
├── articles/
│   ├── my-first-article.md
│   ├── another-article.md
│   └── ...
├── projects/
│   ├── my-project.md
│   ├── another-project.md
│   └── ...
└── profile/
    └── profile.md          # exactly one file when profile.enabled is true
```

---

## Article frontmatter

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | Yes | — | Article title |
| `description` | `string` | Yes | — | Article description (meta + card) |
| `publishDate` | `date` | Yes | — | Publication date |
| `updatedDate` | `date` | No | — | Last updated date |
| `tags` | `string[]` | No | `[]` | Tags for filtering and tag pages |
| `draft` | `boolean` | No | `false` | If true, excluded from production builds |
| `coverImage` | `string` | No | — | Cover image path |
| `author` | `string` | No | `"Author Name"` | Author name override |
| `readingTime` | `string` | No | — | Manual reading time (e.g. `"5 min"`) |

### Example

```markdown
---
title: "Getting Started with Kubernetes"
description: "A practical introduction to Kubernetes for developers."
publishDate: 2025-01-15
tags: ["kubernetes", "devops", "cloud-native"]
draft: false
author: "Jane Doe"
readingTime: "8 min"
---

# Getting Started with Kubernetes

Content goes here...
```

---

## Project frontmatter

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | Yes | — | Project title |
| `description` | `string` | Yes | — | Project description |
| `tags` | `string[]` | No | `[]` | Tags for filtering and tag pages |
| `date` | `date` | No | — | Project date |
| `link` | `string` | No | — | External project link (e.g. GitHub) |
| `featured` | `boolean` | No | `false` | If true, shown on home page |
| `coverImage` | `string` | No | — | Cover image path |

### Example

```markdown
---
title: "Nocturne"
description: "A dark-first personal site template built with Astro."
tags: ["astro", "tailwindcss", "typescript"]
date: 2025-01-15
link: "https://github.com/geekyguy1705/nocturne"
featured: true
---

# Nocturne

Project details go here...
```

---

## Profile frontmatter

Exactly one profile file is required when `profile.enabled` is `true` (the default).

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | `string` | Yes | — | Your name |
| `role` | `string` | Yes | — | Your role or job title |
| `bio` | `string` | Yes | — | Short biography |
| `avatar` | `string` | No | — | Avatar image path |
| `social` | `SocialLink[]` | No | `[]` | Social media links |
| `skills` | `string[]` | No | `[]` | Skills list |
| `resumeLink` | `string` | No | — | Link to resume PDF |

### SocialLink type

```ts
interface SocialLink {
  name: string
  url: string
  icon?: string  // e.g. "github", "linkedin", "twitter"
}
```

### Example

```markdown
---
name: "Jane Doe"
role: "Senior Software Engineer"
bio: "Building things on the web."
avatar: "/images/jane.png"
social:
  - name: "GitHub"
    url: "https://github.com/jane"
    icon: "github"
  - name: "LinkedIn"
    url: "https://linkedin.com/in/jane"
    icon: "linkedin"
skills: ["TypeScript", "React", "Astro", "Node.js"]
resumeLink: "https://example.com/resume.pdf"
---
```

---

## Extending schemas

Pass extension fields to add custom frontmatter:

```ts
const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: createArticleSchema({
    coverImageAlt: z.string().optional(),
    category: z.enum(["tutorial", "opinion", "news"]).default("tutorial"),
  }),
})
```

Your extension fields are merged with the base schema. You can then use them in your markdown:

```yaml
---
title: "My Article"
description: "..."
publishDate: 2025-01-15
coverImageAlt: "A screenshot of the dashboard"
category: "tutorial"
---
```

---

## Draft articles

Set `draft: true` to exclude an article from production builds. Draft articles are still visible during development.

```yaml
---
title: "Work in Progress"
description: "This article is not ready yet."
publishDate: 2025-01-15
draft: true
---
```

---

## Tag system

Tags are automatically extracted from articles and projects. Each unique tag generates:

- **Article tags**: `/blog/tag/:tag` pages
- **Project tags**: `/portfolio/tag/:tag` pages
- **Tag index**: `/tags` page listing all article tags
- **Portfolio tag index**: `/portfolio/tags` page listing all project tags

Tags are slugified for URL paths (e.g. `"cloud-native"` → `/blog/tag/cloud-native`).

---

## Validation

The `validateProfileCollection()` function checks that exactly one profile entry exists when `profile.enabled` is `true`:

```ts
import { validateProfileCollection } from "@geekyguy1705/nocturne/content"

// Throws if enabled and entries.length !== 1
validateProfileCollection(profileEntries, config.profile.enabled)
```

This is called automatically during the build process.
