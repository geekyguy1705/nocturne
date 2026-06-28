---
title: "Kanban Flow"
description: "A real-time collaborative Kanban board with drag-and-drop, optimistic updates, and per-board theme support."
tech: ["React", "TypeScript", "DnD Kit", "Supabase", "Tailwind CSS", "Zustand"]
date: 2026-04-15
link: "https://kanban-flow.example.com"
featured: false
coverImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80"
---

Kanban Flow is a task management application built around the constraints that make collaborative boards hard: concurrent edits, optimistic UI, and drag-and-drop that feels responsive even over a slow connection.

## Core features

- **Real-time sync** via Supabase Realtime — changes from other users appear instantly without polling
- **Drag-and-drop** with DnD Kit's accessible sortable primitives — keyboard navigation fully supported
- **Optimistic updates** — UI reflects the action immediately, rolls back on error
- **Per-board themes** — each board can have its own accent colour, stored in the board record

## The optimistic update model

Every mutation follows the same pattern: update local Zustand state first, fire the Supabase RPC, revert on failure:

```ts
async function moveCard(cardId: string, toColumnId: string, toIndex: number) {
  const prev = snapshot(store.cards)
  store.cards = optimisticallyMove(store.cards, cardId, toColumnId, toIndex)

  const { error } = await supabase.rpc("move_card", { cardId, toColumnId, toIndex })
  if (error) {
    store.cards = prev
    toast.error("Failed to move card")
  }
}
```

The RPC handles position recalculation server-side using a fractional indexing scheme — no position collisions on concurrent moves.

## Outcome

The board handles 50+ simultaneous collaborators without visible lag. Drag operations feel instantaneous even on connections with 200ms latency because all state changes are local-first.
