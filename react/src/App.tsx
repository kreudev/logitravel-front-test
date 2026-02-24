import { RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Kbd } from '@/components/ui/kbd'
import { useListKeyboardShortcuts } from '@/hooks/use-list-keyboard-shortcuts'
import { useListStore } from '@/store/use-list-store'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform)

function App() {
  const {
    items,
    selectedIds,
    historyLength,
    isAddDialogOpen,
    draftText,
    setDraftText,
    setAddDialogOpen,
    selectItem,
    addItem,
    deleteSelectedItems,
    deleteItemById,
    undoLastChange,
  } = useListStore(
    useShallow((state) => ({
      items: state.items,
      selectedIds: state.selectedIds,
      historyLength: state.history.length,
      isAddDialogOpen: state.isAddDialogOpen,
      draftText: state.draftText,
      setDraftText: state.setDraftText,
      setAddDialogOpen: state.setAddDialogOpen,
      selectItem: state.selectItem,
      addItem: state.addItem,
      deleteSelectedItems: state.deleteSelectedItems,
      deleteItemById: state.deleteItemById,
      undoLastChange: state.undoLastChange,
    })),
  )

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const canDelete = selectedIds.length > 0
  const canUndo = historyLength > 0
  const canSubmit = draftText.trim().length > 0

  useListKeyboardShortcuts({
    canDelete,
    onDelete: deleteSelectedItems,
    onUndo: undoLastChange,
  })

  return (
    <main className="min-h-screen bg-linear-to-r from-[#95B2E0] to-[#B5EAFE] p-6 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl items-center justify-center">
        <Card className="w-full rounded-3xl border-0 bg-[#ececec] py-10 shadow-[0_10px_28px_rgba(43,66,89,0.22)]">
          <CardHeader className="px-6 text-center md:px-11">
            <CardTitle className="text-balance text-3xl font-medium text-[#2f3137] md:text-5xl">
              This is a technical proof
            </CardTitle>
            <div className="mt-3 space-y-3 rounded-xl border border-[#c9ccd5] bg-[#dfe2e7] p-4 text-left text-sm leading-relaxed text-[#3f434b] md:text-base">
              <p className="flex items-start gap-2">
                <span className="mt-0.5">🖱️</span>
                <span>Double click an item to delete it instantly.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5">⌘</span>
                <span>
                  On macOS, use <Kbd>Command</Kbd> + click to select multiple items.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5">⌃</span>
                <span>
                  On Windows, use <Kbd>Ctrl</Kbd> + click to select multiple items.
                </span>
              </p>
              <p className="flex items-start gap-2 text-[#5b5f68]">
                <span className="mt-0.5">⌨️</span>
                <span>
                  Undo shortcut: <Kbd>{isMac ? 'Command' : 'Ctrl'}</Kbd> + <Kbd>Z</Kbd>
                </span>
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 md:px-11">
            <section className="h-[255px] overflow-auto border-2 border-[#d0d0d2] bg-white/10 p-2" aria-label="Items list">
              <ul className="space-y-1">
                {items.length === 0 ? (
                  <li className="px-2 py-1 text-base text-[#81858e] md:text-lg">No items yet. Add one to start.</li>
                ) : (
                  items.map((item) => {
                    const isSelected = selectedIdSet.has(item.id)

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={(event) => {
                            if (event.detail === 2) {
                              deleteItemById(item.id)
                              return
                            }

                            const multiSelect = event.metaKey || event.ctrlKey
                            selectItem(item.id, multiSelect)
                          }}
                          onDoubleClick={() => deleteItemById(item.id)}
                          className={[
                            'w-full cursor-pointer px-3 py-1 text-left text-2xl text-[#50545b] transition-colors md:text-[2rem]',
                            isSelected ? 'bg-[#3549f5] text-white' : 'hover:bg-[#dbe2ff]',
                          ].join(' ')}
                        >
                          {item.text}
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </section>
          </CardContent>

          <CardFooter className="mt-1 flex items-center justify-between gap-3 px-6 md:px-11">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canUndo}
                onClick={undoLastChange}
                className="h-11 w-11 rounded-full border-[#5f72ff] bg-transparent text-[#475af8] hover:bg-[#e5e9ff]"
                aria-label="Undo last action"
              >
                <RotateCcw className="size-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!canDelete}
                onClick={deleteSelectedItems}
                className="h-11 rounded-full border-[#5f72ff] bg-transparent px-7 text-base uppercase tracking-wide text-[#475af8] hover:bg-[#e5e9ff]"
              >
                Delete
              </Button>
            </div>

            <Button
              type="button"
              onClick={() => setAddDialogOpen(true)}
              className="h-11 min-w-30 rounded-full bg-[#3549f5] px-9 text-base uppercase tracking-wide text-white hover:bg-[#4a5dff]"
            >
              Add
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent showCloseButton={false} className="max-w-2xl rounded-2xl border border-[#d4d5da] bg-[#ececec] p-8">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-3xl font-normal text-[#383c43]">Add item to list</DialogTitle>
            <DialogDescription className="hidden">Type a new item and add it to the list.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              addItem()
            }}
            className="grid gap-5"
          >
            <input
              value={draftText}
              onChange={(event) => setDraftText(event.currentTarget.value)}
              placeholder="Type the text here..."
              autoFocus
              maxLength={120}
              className="h-15 w-full border-2 border-[#d0d0d2] bg-white/20 px-4 text-lg text-[#2f3239] outline-none transition-colors placeholder:text-[#a4a7af] focus:border-[#7080ff]"
            />

            <DialogFooter className="flex-row justify-end gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="h-11 min-w-30 rounded-full bg-[#3549f5] px-8 text-base uppercase tracking-wide text-white hover:bg-[#4a5dff]"
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                className="h-11 rounded-full border-[#5f72ff] bg-transparent px-8 text-base uppercase tracking-wide text-[#475af8] hover:bg-[#e5e9ff]"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default App
