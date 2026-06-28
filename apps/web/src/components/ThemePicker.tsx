"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { FloatingPanel } from "@/components/FloatingPanel"
import { cn } from "@workspace/ui/lib/utils"

type ThemeId =
  | "latte" | "frappe" | "macchiato" | "mocha"
  | "gruvbox-dark" | "gruvbox-light"
  | "rosepine-main" | "rosepine-moon" | "rosepine-dawn"
  | "nord-dark" | "nord-light"
  | "dracula"
  | "tokyonight-night" | "tokyonight-storm" | "tokyonight-moon"

interface ThemeVariant {
  id: ThemeId
  label: string
  dark: boolean
  primary: string
  secondary: string
}

interface ThemeGroup {
  name: string
  variants: ThemeVariant[]
}

const THEME_GROUPS: ThemeGroup[] = [
  {
    name: "Catppuccin",
    variants: [
      { id: "latte",     label: "Latte",     dark: false, primary: "#8839ef", secondary: "#dd7878" },
      { id: "frappe",    label: "Frappé",    dark: true,  primary: "#ca9ee6", secondary: "#e78284" },
      { id: "macchiato", label: "Macchiato", dark: true,  primary: "#c6a0f6", secondary: "#ed8796" },
      { id: "mocha",     label: "Mocha",     dark: true,  primary: "#cba6f7", secondary: "#f38ba8" },
    ],
  },
  {
    name: "Gruvbox",
    variants: [
      { id: "gruvbox-dark",  label: "Dark",  dark: true,  primary: "#d3869b", secondary: "#8ec07c" },
      { id: "gruvbox-light", label: "Light", dark: false, primary: "#b16286", secondary: "#98971a" },
    ],
  },
  {
    name: "Rosé Pine",
    variants: [
      { id: "rosepine-main", label: "Main", dark: true,  primary: "#ebbcba", secondary: "#eb6f92" },
      { id: "rosepine-moon", label: "Moon", dark: true,  primary: "#ea9a97", secondary: "#eb6f92" },
      { id: "rosepine-dawn", label: "Dawn", dark: false, primary: "#d7827a", secondary: "#b4637a" },
    ],
  },
  {
    name: "Nord",
    variants: [
      { id: "nord-dark",  label: "Dark",  dark: true,  primary: "#81a1c1", secondary: "#88c0d0" },
      { id: "nord-light", label: "Light", dark: false, primary: "#5e81ac", secondary: "#81a1c1" },
    ],
  },
  {
    name: "Dracula",
    variants: [
      { id: "dracula", label: "Default", dark: true, primary: "#bd93f9", secondary: "#ff79c6" },
    ],
  },
  {
    name: "Tokyo Night",
    variants: [
      { id: "tokyonight-night", label: "Night", dark: true, primary: "#bb9af7", secondary: "#7aa2f7" },
      { id: "tokyonight-storm", label: "Storm", dark: true, primary: "#bb9af7", secondary: "#7aa2f7" },
      { id: "tokyonight-moon",  label: "Moon",  dark: true, primary: "#c099ff", secondary: "#82aaff" },
    ],
  },
]

const ALL_THEME_IDS: ThemeId[] = THEME_GROUPS.flatMap((g) => g.variants.map((v) => v.id))
const THEME_MAP = new Map<ThemeId, ThemeVariant>(
  THEME_GROUPS.flatMap((g) => g.variants.map((v) => [v.id, v]))
)

function ThemeIcon({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="14" rx="1.5" fill={primary} />
      <rect x="9" y="1" width="6" height="14" rx="1.5" fill={secondary} />
    </svg>
  )
}

const DEFAULT_THEME: ThemeId = "tokyonight-night"

export function ThemePicker() {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<ThemeId>(DEFAULT_THEME)

  React.useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem("theme") || root.dataset.siteTheme || DEFAULT_THEME
    const id = ALL_THEME_IDS.includes(stored as ThemeId) ? (stored as ThemeId) : DEFAULT_THEME
    setSelected(id)
  }, [])

  const applyTheme = (id: ThemeId) => {
    const variant = THEME_MAP.get(id)!
    const root = document.documentElement
    root.dataset.siteTheme = id
    root.dataset.theme = variant.dark ? "github-dark" : "github-light"
    if (variant.dark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", id)
    setSelected(id)
    setOpen(false)
  }

  const current = THEME_MAP.get(selected) ?? THEME_MAP.get(DEFAULT_THEME)!
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label="Choose theme"
        aria-expanded={open}
        className="shrink-0"
        onClick={() => setOpen((o) => !o)}
      >
        <ThemeIcon primary={current.primary} secondary={current.secondary} />
      </Button>
      <FloatingPanel
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        align="end"
        sideOffset={8}
        className="w-52 p-2 max-h-[min(28rem,80svh)] overflow-y-auto scrollbar-none"
      >
        <div className="flex flex-col gap-3">
          {THEME_GROUPS.map((group) => (
            <div key={group.name}>
              <p className="mb-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.name}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.variants.map((variant) => {
                  const isSelected = variant.id === selected
                  return (
                    <button
                      key={variant.id}
                      onClick={() => applyTheme(variant.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <ThemeIcon primary={variant.primary} secondary={variant.secondary} />
                      <span className="font-medium">{variant.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </FloatingPanel>
    </>
  )
}
