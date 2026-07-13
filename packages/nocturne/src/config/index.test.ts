import { test, describe } from "node:test"
import assert from "node:assert/strict"
import {
  defaultConfig,
  defineNocturneConfig,
  normalizeConfig,
} from "./index.ts"

describe("defaultConfig", () => {
  test("has no personal data", () => {
    assert.equal(defaultConfig.title, "Nocturne")
    assert.equal(defaultConfig.author.name, "Author Name")
    assert.equal(defaultConfig.author.email, "hello@example.com")
    assert.equal(defaultConfig.url, "https://example.com")
  })

  test("portfolio mode is project-pages by default", () => {
    assert.equal(defaultConfig.portfolio.mode, "project-pages")
  })

  test("blog and profile are enabled by default", () => {
    assert.ok(defaultConfig.blog.enabled)
    assert.ok(defaultConfig.profile.enabled)
  })
})

describe("defineNocturneConfig", () => {
  test("returns merged config with defaults for omitted fields", () => {
    const config = defineNocturneConfig({
      title: "My Site",
      author: { name: "Jane", email: "jane@example.com" },
    })
    assert.equal(config.title, "My Site")
    assert.equal(config.author.name, "Jane")
    assert.equal(config.author.email, "jane@example.com")
    assert.equal(config.blog.enabled, true)
    assert.equal(config.portfolio.mode, "project-pages")
  })

  test("deep-merges nested objects", () => {
    const config = defineNocturneConfig({
      portfolio: { enabled: false, mode: "single-page", description: "My projects", browseTagsLabel: "Tags" },
    })
    assert.equal(config.portfolio.enabled, false)
    assert.equal(config.portfolio.mode, "single-page")
    assert.equal(config.portfolio.description, "My projects")
  })

  test("overrides arrays entirely", () => {
    const config = defineNocturneConfig({
      nav: [{ label: "Home", href: "/" }],
    })
    assert.equal(config.nav.length, 1)
    assert.equal(config.nav[0].label, "Home")
  })

  test("throws on invalid portfolio mode", () => {
    assert.throws(
      () =>
        defineNocturneConfig({
          portfolio: {
            enabled: true,
            mode: "invalid" as "single-page" | "project-pages",
            description: "",
            browseTagsLabel: "",
          },
        }),
      /Invalid portfolio mode/
    )
  })
})

describe("normalizeConfig", () => {
  test("produces same result as defineNocturneConfig", () => {
    const partial = { title: "Test" }
    const a = defineNocturneConfig(partial)
    const b = normalizeConfig(partial)
    assert.deepEqual(a, b)
  })

  test("empty partial returns defaults", () => {
    const config = normalizeConfig({})
    assert.deepEqual(config, defaultConfig)
  })
})
