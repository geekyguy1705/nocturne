---
title: "Type-Safe Content with Astro Content Collections"
description: "How Astro content collections bring Zod schema validation to Markdown frontmatter, eliminating a whole class of build-time content bugs."
publishDate: 2026-06-15
tags: ["astro", "typescript", "ssg"]
draft: false
coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
author: "Abhishek"
readingTime: "6 min"
---

Markdown is convenient but untyped. A typo in a date field, a missing required property, a tag spelled two different ways — these all silently produce wrong output. Astro content collections solve this by adding a Zod schema layer on top of your Markdown files.

## Defining a collection

Collections live in `src/content/` and are configured in `src/content.config.ts`:

```ts
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
    readingTime: z.string().optional(),
  }),
})

export const collections = { articles }
```

Any Markdown file missing `title` or `description` will fail at build time with a clear error — not a cryptic runtime 404.

## Querying collections

```ts
import { getCollection } from "astro:content"

const articles = (await getCollection("articles"))
  .filter(a => !a.data.draft)
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
```

The `data` property is fully typed — your editor autocompletes `a.data.publishDate` as a `Date` object because Zod's `z.coerce.date()` transforms the YAML string.

## Rendering an entry

```ts
import { render } from "astro:content"

const { Content, headings } = await render(article)
```

`headings` gives you a structured list of all `##` and `###` headings in the file — useful for building a table of contents without any parsing.

## Loader vs legacy

The `glob` loader (Astro 5+) replaces the older `src/content/` convention. The key difference is flexibility: loaders can pull from any source — a remote API, a database, a flat JSON file — not just the local filesystem.

| Feature | Legacy collections | Loader API |
|---|---|---|
| Local Markdown | ✅ | ✅ |
| Remote data | ❌ | ✅ |
| Custom transforms | Limited | Full |
| Incremental builds | ❌ | ✅ (planned) |

## Dynamic tag pages

Content collections make dynamic routes trivial. For tag pages, collect all unique tags across all articles, then use `getStaticPaths`:

```ts
export async function getStaticPaths() {
  const articles = (await getCollection("articles")).filter(a => !a.data.draft)
  const tagSet = new Set<string>()
  for (const article of articles) {
    for (const tag of article.data.tags) tagSet.add(tag)
  }
  return Array.from(tagSet).map(tag => ({
    params: { tag },
    props: { tag, articles: articles.filter(a => a.data.tags.includes(tag)) },
  }))
}
```

Astro pre-renders a page for every tag at build time — no server required.
