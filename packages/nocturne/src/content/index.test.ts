import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { z } from "zod"
import {
  createArticleSchema,
  createProjectSchema,
  createProfileSchema,
  validateProfileCollection,
} from "./index.ts"

describe("createArticleSchema", () => {
  test("parses valid article frontmatter", () => {
    const schema = createArticleSchema()
    const parsed = schema.parse({
      title: "Hello",
      description: "World",
      publishDate: "2024-01-01",
      tags: ["a", "b"],
    })
    assert.equal(parsed.title, "Hello")
    assert.equal(parsed.draft, false)
    assert.equal(parsed.author, "Author Name")
    assert.deepEqual(parsed.tags, ["a", "b"])
  })

  test("supports extension fields", () => {
    const schema = createArticleSchema({
      category: z.string().optional(),
    })
    const parsed = schema.parse({
      title: "Hello",
      description: "World",
      publishDate: "2024-01-01",
      category: "dev",
    }) as { category?: string }
    assert.equal(parsed.category, "dev")
  })
})

describe("createProjectSchema", () => {
  test("parses valid project frontmatter", () => {
    const schema = createProjectSchema()
    const parsed = schema.parse({
      title: "Project",
      description: "A project",
      tags: ["react"],
      featured: true,
    })
    assert.equal(parsed.title, "Project")
    assert.equal(parsed.featured, true)
    assert.equal(parsed.date, undefined)
  })
})

describe("createProfileSchema", () => {
  test("parses valid profile frontmatter", () => {
    const schema = createProfileSchema()
    const parsed = schema.parse({
      name: "Jane",
      role: "Engineer",
      bio: "Bio",
      social: [{ name: "GitHub", url: "https://github.com" }],
    })
    assert.equal(parsed.name, "Jane")
    assert.deepEqual(parsed.skills, [])
    assert.equal(parsed.social[0].name, "GitHub")
  })
})

describe("validateProfileCollection", () => {
  test("passes when disabled with zero entries", () => {
    validateProfileCollection([], false)
  })

  test("passes when enabled with exactly one entry", () => {
    validateProfileCollection([{ id: "profile" }], true)
  })

  test("throws when enabled with zero entries", () => {
    assert.throws(
      () => validateProfileCollection([], true),
      /no profile entries/
    )
  })

  test("throws when enabled with multiple entries", () => {
    assert.throws(
      () =>
        validateProfileCollection(
          [{ id: "a" }, { id: "b" }],
          true
        ),
      /2 profile entries/
    )
  })
})
