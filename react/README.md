# React Implementation

## Why This Architecture

The project is structured to keep business logic isolated from UI concerns and make behavior easy to test.

1. `store/` holds state transitions and app rules.
2. `hooks/` encapsulate cross-cutting UI behavior (keyboard shortcuts).
3. `components/` focuses on presentation and interaction.
4. `components/ui/` contains reusable internal UI primitives (shadcn-based).
5. `__tests__/` validates user-facing behavior end to end.

This can look over-engineered for a small exercise, but it demonstrates how the same app scales with low coupling.

## Use Cases and Technical Mapping

| Use case | Main modules involved | How it works |
| --- | --- | --- |
| Add item | `store/use-list-store.ts`, `components/add-item-dialog.tsx` | Input text is validated (`trim`), item is added, dialog closes, history updates for undo |
| Select item | `components/list-item.tsx`, `store/use-list-store.ts` | Click selects one item; repeated click toggles off |
| Multi-select | `components/list-item.tsx`, `store/use-list-store.ts` | `Cmd/Ctrl + click` toggles ids inside `selectedIds` |
| Delete selected | `components/list-card.tsx`, `store/use-list-store.ts` | Delete button removes selected ids and clears selection |
| Double-click delete | `components/list-item.tsx`, `store/use-list-store.ts` | Item can be removed directly without using selection |
| Undo last action | `store/use-list-store.ts`, `components/list-card.tsx` | Store keeps a bounded history stack and restores last snapshot |
| Keyboard shortcuts | `hooks/use-list-keyboard-shortcuts.ts` | Global listeners trigger delete/undo when valid |

## Folder Structure

```text
react/
  src/
    components/
      add-item-dialog.tsx
      list-card.tsx
      list-item.tsx
      ui/
        animated-list.tsx
        button.tsx
        card.tsx
        dialog.tsx
        input.tsx
        kbd.tsx
    hooks/
      use-list-keyboard-shortcuts.ts
    store/
      use-list-store.ts
    __tests__/
      app.test.tsx
```

## State Model (Zustand)

Store file: `src/store/use-list-store.ts`

Core state fields:

1. `items`: list data.
2. `selectedIds`: selected item ids.
3. `history`: snapshots used by undo.
4. `isAddDialogOpen`: modal visibility.
5. `draftText`: controlled input value.

Core actions:

1. `addItem`
2. `selectItem`
3. `deleteSelectedItems`
4. `deleteItemById`
5. `undoLastChange`

## Testing Strategy

Tests are written with Vitest + Testing Library and cover the core user journeys:

1. Initial render.
2. Add item.
3. Delete selected item.
4. Multi-select delete.
5. Double-click delete.
6. Undo.

The goal is to validate behavior from the user perspective rather than implementation details.

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run test:watch
```
