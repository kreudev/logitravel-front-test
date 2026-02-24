import { create } from 'zustand'

export type ListItem = {
  id: string
  text: string
}

type ListStore = {
  items: ListItem[]
  selectedIds: string[]
  history: ListItem[][]
  isAddDialogOpen: boolean
  draftText: string
  setAddDialogOpen: (isOpen: boolean) => void
  setDraftText: (value: string) => void
  selectItem: (id: string, multiSelect: boolean) => void
  clearSelection: () => void
  addItem: () => void
  deleteSelectedItems: () => void
  deleteItemById: (id: string) => void
  undoLastChange: () => void
}

const HISTORY_LIMIT = 25

const initialItems: ListItem[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((text, index) => ({
  id: `seed-${index + 1}`,
  text,
}))

const cloneItems = (items: ListItem[]) => items.map((item) => ({ ...item }))

const createHistory = (items: ListItem[], history: ListItem[][]) => {
  const nextHistory = [...history, cloneItems(items)]

  if (nextHistory.length <= HISTORY_LIMIT) {
    return nextHistory
  }

  return nextHistory.slice(nextHistory.length - HISTORY_LIMIT)
}

const createItemId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useListStore = create<ListStore>((set, get) => ({
  items: initialItems,
  selectedIds: [],
  history: [],
  isAddDialogOpen: false,
  draftText: '',
  setAddDialogOpen: (isOpen) =>
    set(() => ({
      isAddDialogOpen: isOpen,
      draftText: isOpen ? get().draftText : '',
    })),
  setDraftText: (value) =>
    set(() => ({
      draftText: value,
    })),
  selectItem: (id, multiSelect) =>
    set((state) => {
      if (multiSelect) {
        const isSelected = state.selectedIds.includes(id)
        const selectedIds = isSelected
          ? state.selectedIds.filter((selectedId) => selectedId !== id)
          : [...state.selectedIds, id]

        return { selectedIds }
      }

      if (state.selectedIds.length === 1 && state.selectedIds[0] === id) {
        return { selectedIds: [] }
      }

      return { selectedIds: [id] }
    }),
  clearSelection: () =>
    set(() => ({
      selectedIds: [],
    })),
  addItem: () =>
    set((state) => {
      const text = state.draftText.trim()

      if (!text) {
        return state
      }

      const history = createHistory(state.items, state.history)

      return {
        items: [...state.items, { id: createItemId(), text }],
        history,
        selectedIds: [],
        draftText: '',
        isAddDialogOpen: false,
      }
    }),
  deleteSelectedItems: () =>
    set((state) => {
      if (state.selectedIds.length === 0) {
        return state
      }

      const selected = new Set(state.selectedIds)
      const history = createHistory(state.items, state.history)

      return {
        items: state.items.filter((item) => !selected.has(item.id)),
        selectedIds: [],
        history,
      }
    }),
  deleteItemById: (id) =>
    set((state) => {
      const exists = state.items.some((item) => item.id === id)

      if (!exists) {
        return state
      }

      const history = createHistory(state.items, state.history)

      return {
        items: state.items.filter((item) => item.id !== id),
        selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
        history,
      }
    }),
  undoLastChange: () =>
    set((state) => {
      const previousItems = state.history.at(-1)

      if (!previousItems) {
        return state
      }

      return {
        items: cloneItems(previousItems),
        selectedIds: [],
        history: state.history.slice(0, -1),
      }
    }),
}))
