import { gsap } from "gsap"

export function initAnimations() {
  if (typeof window === "undefined") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if ((window as unknown as { __gsapInit?: boolean }).__gsapInit) return
  ;(window as unknown as { __gsapInit?: boolean }).__gsapInit = true

  const ctx = gsap.context(() => {
    document.body.addEventListener("mouseenter", (e) => {
      const card = (e.target as HTMLElement).closest("[data-slot='card']")
      if (!card) return
      gsap.to(card, { y: -4, duration: 0.2, ease: "power2.out" })
    }, true)

    document.body.addEventListener("mouseleave", (e) => {
      const card = (e.target as HTMLElement).closest("[data-slot='card']")
      if (!card) return
      gsap.to(card, { y: 0, duration: 0.2, ease: "power2.out" })
    }, true)
  })

  return ctx
}
