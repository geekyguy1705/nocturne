"use client"

import * as React from "react"
import * as ReactDOM from "react-dom"
import { cn } from "@workspace/ui/lib/utils"

interface FloatingPanelProps {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  className?: string
  children: React.ReactNode
  align?: "start" | "end"
  sideOffset?: number
}

export function FloatingPanel({
  open,
  onClose,
  triggerRef,
  className,
  children,
  align = "end",
  sideOffset = 8,
}: FloatingPanelProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const [coords, setCoords] = React.useState({ top: 0, left: 0, right: 0 })
  const [mounted, setMounted] = React.useState(false)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open || !triggerRef.current) {
      setReady(false)
      return
    }

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      setCoords({
        top: rect.bottom + sideOffset,
        left: rect.left,
        right: window.innerWidth - rect.right,
      })
      setReady(true)
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open, triggerRef, sideOffset])

  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open, onClose, triggerRef])

  if (!mounted || !open || !ready) return null

  const style: React.CSSProperties =
    align === "end"
      ? { top: coords.top, right: coords.right }
      : { top: coords.top, left: coords.left }

  return ReactDOM.createPortal(
    <div
      ref={panelRef}
      style={{ ...style, position: "fixed", zIndex: 9999 }}
      className={cn(
        "min-w-[12rem] rounded-xl border border-border/60",
        "bg-background/70 backdrop-blur-xl",
        "shadow-lg text-foreground",
        "animate-in fade-in-0 slide-in-from-top-2 duration-150",
        className
      )}
    >
      {children}
    </div>,
    document.body
  )
}
