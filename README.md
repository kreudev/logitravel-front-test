# Logitravel Front-End Test

This repository contains two project folders for the technical challenge:

1. `vanilla`: implemented project with HTML, JavaScript, and CSS Modules.
2. `react`: placeholder for the React implementation.

## Vanilla Project

Path: `vanilla/`

### Tech Stack

1. HTML file: `index.html`
2. JavaScript file: `app.js`
3. CSS Modules file: `styles.module.css`
4. Storage: `localStorage` for app state persistence

### JavaScript Features

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

Path: `react/`

Current status: folder scaffolded. Implementation pending.
