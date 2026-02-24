import { useShallow } from 'zustand/react/shallow'

import { AddItemDialog } from '@/components/add-item-dialog'
import { ListCard } from '@/components/list-card'
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
        <ListCard
          items={items}
          selectedIds={selectedIds}
          canDelete={canDelete}
          canUndo={canUndo}
          isMac={isMac}
          onSelectItem={selectItem}
          onDeleteItem={deleteItemById}
          onDeleteSelected={deleteSelectedItems}
          onUndo={undoLastChange}
          onOpenAddDialog={() => setAddDialogOpen(true)}
        />
      </div>

      <AddItemDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        value={draftText}
        onValueChange={setDraftText}
        onSubmit={addItem}
        canSubmit={canSubmit}
      />
    </main>
  )
}

export default App
