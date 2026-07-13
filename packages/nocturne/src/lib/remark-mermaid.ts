import type { Code, Root } from "mdast"
import { visit } from "unist-util-visit"

export function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code) => {
      if (node.lang === "mermaid") {
        const value = `<pre class="mermaid">${escapeHtml(node.value)}</pre>`
        ;(node as unknown as { type: string; value: string }).type = "html"
        ;(node as unknown as { value: string }).value = value
      }
    })
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
