# Logitravel Front-End Test

This repository contains two implementations of the same list-management challenge:

1. `vanilla`: plain HTML + JavaScript + CSS Modules.
2. `react`: React + TypeScript + Zustand + Tailwind v4 + shadcn/ui.

## Repository Structure

1. `vanilla/`: standalone vanilla implementation.
2. `react/`: Vite + React implementation.
3. `README.md`: global project documentation.

## Vanilla Project

Location: `vanilla/`

### Tech Stack

1. HTML file: `index.html`
2. JavaScript file: `app.js`
3. CSS Modules file: `styles.module.css`
4. Storage: `localStorage` for app state persistence

### Features

1. Add new items to the list from a modal form.
2. Validation to prevent empty items.
3. Single item selection.
4. Multi-selection with `Command + click` (macOS) and `Ctrl + click` (Windows).
5. Delete selected item(s).
6. Double-click deletion directly on a list item.
7. Undo last change.
8. UI button states enabled/disabled depending on current state.
9. Persisted state in `localStorage` including:
   - item list
   - selected items
   - undo history

### CSS Modules Styling

1. Dedicated stylesheet in `styles.module.css`.
2. Component-oriented class naming for layout, card, list, modal, and buttons.
3. Responsive layout with media queries.
4. Visual state styles for hover, selected item, disabled buttons, and modal overlay.
5. Styled instruction panel with shortcut hints.

## React Project

Location: `react/`

### Tech Stack

1. React 19 + TypeScript + Vite.
2. Zustand for state management.
3. Tailwind CSS v4.
4. shadcn/ui internal components.
5. Vitest + Testing Library for tests.

### Architecture

1. Global state in Zustand store:
   - `src/store/use-list-store.ts`
2. Reusable hooks:
   - `src/hooks/use-list-keyboard-shortcuts.ts`
3. UI split into focused components:
   - `src/components/list-card.tsx`
   - `src/components/list-item.tsx`
   - `src/components/add-item-dialog.tsx`
   - `src/components/ui/*` (internal shadcn/ui components)

### Features

1. Add item through modal dialog.
2. Empty input validation.
3. Single and multi-selection (`Command/Ctrl + click`).
4. Delete selected items.
5. Double-click delete.
6. Undo last state-changing action.
7. Keyboard shortcuts:
   - Undo: `Command/Ctrl + Z`
   - Delete selected: `Delete/Backspace`
8. Animated list rendering using internal `AnimatedList`.

### Test Coverage

Implemented integration tests for:

1. Initial rendering.
2. Add item flow.
3. Delete selected item.
4. Multi-select delete flow.
5. Double-click delete flow.
6. Undo flow.

## Run Projects

### Vanilla

Open `vanilla/index.html` in the browser.

### React

```bash
cd react
npm install
npm run dev
```

### React Build

```bash
cd react
npm run build
```

### React Tests

```bash
cd react
npm run test
```
