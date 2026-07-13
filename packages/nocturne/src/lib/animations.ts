import { animate, createSpring, createTimeline } from "animejs"
import { stagger } from "animejs/utils"
import { createDrawable } from "animejs/svg"

const springCard = createSpring({ mass: 1, stiffness: 180, damping: 14 })
const springHover = createSpring({ mass: 0.8, stiffness: 300, damping: 20 })
const springSocial = createSpring({ mass: 1, stiffness: 200, damping: 16 })

function observeOnce(selector: string, callback: (el: Element) => void) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callback(entry.target)
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15 },
  )
  document.querySelectorAll(selector).forEach((el) => observer.observe(el))
}

function animateDrawableText(el: Element) {
  const wrapper = el as HTMLElement
  wrapper.style.opacity = "1"

  const pathEls = Array.from(el.querySelectorAll(".draw-path")) as SVGPathElement[]
  if (pathEls.length === 0) return

  const drawables = pathEls.map((p) => createDrawable(p))

  const tl = createTimeline({ loop: true })

  tl.add(drawables, {
    draw: ["0 0", "0 1", "1 1"],
    duration: 4800,
    delay: stagger(180, { start: 300 }),
    ease: "inOutQuad",
  })

  // tl.add(drawables, {
  //   draw: "1 1",
  //   duration: 2400,
  //   delay: stagger(180),
  //   ease: "linear",
  // }, "-=300")
}

export function initAnimations() {
  if (typeof window === "undefined") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (document.body.dataset.animeInit === "1") return
  document.body.dataset.animeInit = "1"

  observeOnce("[data-animate='hero-svg']", animateDrawableText)

  observeOnce("[data-animate='page-heading']", animateDrawableText)

  observeOnce("[data-animate='hero']", (el) => {
    const children = Array.from(el.children) as HTMLElement[]
    animate(children, {
      opacity: { from: 0, to: 1 },
      y: { from: 20, to: 0 },
      duration: 600,
      ease: "outExpo",
      delay: stagger(80),
    })
  })

  observeOnce("[data-animate='section-heading']", (el) => {
    animate(el, {
      opacity: { from: 0, to: 1 },
      x: { from: -24, to: 0 },
      duration: 500,
      ease: "outQuart",
    })
  })

  observeOnce("[data-animate='card']", (el) => {
    animate(el, {
      opacity: { from: 0, to: 1 },
      y: { from: 20, to: 0 },
      duration: 600,
      ease: springCard,
    })
  })

  observeOnce("[data-animate='profile-block']", (el) => {
    animate(el, {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.95, to: 1 },
      duration: 600,
      ease: "outExpo",
    })
  })

  observeOnce("[data-animate='badge']", (el) => {
    animate(el, { 
      opacity: { from: 0, to: 1 },
      y: { from: 12, to: 0 },
      duration: 500,
      ease: "inOutExpo",
    })
  })

  observeOnce("[data-animate='social-btn']", (el) => {
    animate(el, {
      opacity: { from: 0, to: 1 },
      y: { from: 10, to: 0 },
      duration: 500,
      ease: springSocial,
    })
  })

  document.body.addEventListener(
    "mouseenter",
    (e) => {
      const card = (e.target as HTMLElement).closest("[data-slot='card']")
      if (!card) return
      animate(card, { y: -5, ease: springHover })
    },
    true,
  )

  document.body.addEventListener(
    "mouseleave",
    (e) => {
      const card = (e.target as HTMLElement).closest("[data-slot='card']")
      if (!card) return
      animate(card, { y: 0, ease: springHover })
    },
    true,
  )
}
