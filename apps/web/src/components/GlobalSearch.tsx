"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command"

export interface SearchItem {
  title: string
  description: string
  href: string
  type: "article" | "project"
  tags: string[]
}

interface GlobalSearchProps {
  items: SearchItem[]
}

function buildItemValue(item: SearchItem) {
  return [item.title, item.description, ...item.tags].join("\t")
}

function tagFilter(value: string, search: string): number {
  const tagPrefix = search.match(/^tag:\s*(.*)/i)
  if (tagPrefix) {
    const term = tagPrefix[1].trim().toLowerCase()
    if (!term) return 1
    const parts = value.split("\t")
    const tags = parts.slice(2)
    return tags.some((t) => t.toLowerCase().includes(term)) ? 1 : 0
  }
  const lower = search.toLowerCase()
  return value.toLowerCase().includes(lower) ? 1 : 0
}

export function GlobalSearch({ items }: GlobalSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const articles = items.filter((i) => i.type === "article")
  const projects = items.filter((i) => i.type === "project")

  function renderItem(item: SearchItem) {
    return (
      <CommandItem
        key={item.href}
        value={buildItemValue(item)}
        onSelect={() => {
          setOpen(false)
          window.location.href = item.href
        }}
      >
        <div className="flex flex-col gap-0.5 py-0.5 min-w-0">
          <span className="text-sm font-medium">{item.title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-sm border border-border/60 px-1.5 py-0 text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CommandItem>
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search (Ctrl+K)"
        className="shrink-0"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command filter={tagFilter}>
        <CommandInput
          placeholder="Search articles and projects..."
          value={query}
          onValueChange={setQuery}
        />
        <p className="px-3 py-1.5 text-[11px] text-muted-foreground border-b border-border/40">
          Tip: type <kbd className="font-mono">tag:&lt;tag&gt;</kbd> to filter by tag.
        </p>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {articles.length > 0 && (
            <CommandGroup heading="Articles">
              {articles.map(renderItem)}
            </CommandGroup>
          )}

          {articles.length > 0 && projects.length > 0 && <CommandSeparator />}

          {projects.length > 0 && (
            <CommandGroup heading="Projects">
              {projects.map(renderItem)}
            </CommandGroup>
          )}
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
