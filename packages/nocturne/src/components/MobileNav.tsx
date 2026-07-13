"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "../ui/components/button"
import { FloatingPanel } from "./FloatingPanel"
import { GlobalSearch } from "./GlobalSearch"
import { ThemePicker } from "./ThemePicker"
import type { SearchItem } from "./GlobalSearch"

interface NavLink {
  label: string
  href: string
}

interface MobileNavProps {
  navLinks: NavLink[]
  searchItems: SearchItem[]
}

export function MobileNav({ navLinks, searchItems }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <div className="flex items-center gap-1 md:hidden">
      <GlobalSearch items={searchItems} />
      <ThemePicker />
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        aria-expanded={open}
        className="shrink-0"
        onClick={() => setOpen((o) => !o)}
      >
        <Menu className="size-4" />
      </Button>
      <FloatingPanel
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        align="end"
        sideOffset={8}
        className="w-48 p-2"
      >
        <nav className="flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FloatingPanel>
    </div>
  )
}
