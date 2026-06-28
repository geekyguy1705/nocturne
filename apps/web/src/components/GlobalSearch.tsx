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
}

interface GlobalSearchProps {
  items: SearchItem[]
}

export function GlobalSearch({ items }: GlobalSearchProps) {
  const [open, setOpen] = React.useState(false)

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
        <Command>
        <CommandInput placeholder="Search articles and projects..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {articles.length > 0 && (
            <CommandGroup heading="Articles">
              {articles.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    setOpen(false)
                    window.location.href = item.href
                  }}
                >
                  <div className="flex flex-col gap-0.5 py-0.5">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {articles.length > 0 && projects.length > 0 && <CommandSeparator />}

          {projects.length > 0 && (
            <CommandGroup heading="Projects">
              {projects.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    setOpen(false)
                    window.location.href = item.href
                  }}
                >
                  <div className="flex flex-col gap-0.5 py-0.5">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
