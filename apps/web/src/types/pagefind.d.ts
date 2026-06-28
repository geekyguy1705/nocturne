declare module "@pagefind/default-ui" {
  export class PagefindUI {
    constructor(options: {
      element?: string | HTMLElement
      bundlePath?: string
      pageSize?: number
      resetStyles?: boolean
      showImages?: boolean
      showSubResults?: boolean
      excerptLength?: number
      processResult?: (result: unknown) => unknown
      processTerm?: (term: string) => string
      translations?: Record<string, string>
      filter?: Record<string, string | string[]>
    })
    destroy(): void
    triggerSearch(term: string): void
  }
}

declare module "@pagefind/default-ui/css/ui.css" {}
