import { RotateCcw } from 'lucide-react'

import { AnimatedList } from '@/components/ui/animated-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Kbd } from '@/components/ui/kbd'
import { ListItem } from '@/components/list-item'
import type { ListItem as ListItemModel } from '@/store/use-list-store'

type ListCardProps = {
  items: ListItemModel[]
  selectedIds: string[]
  canDelete: boolean
  canUndo: boolean
  isMac: boolean
  onSelectItem: (id: string, multiSelect: boolean) => void
  onDeleteItem: (id: string) => void
  onDeleteSelected: () => void
  onUndo: () => void
  onOpenAddDialog: () => void
}

export function ListCard({
  items,
  selectedIds,
  canDelete,
  canUndo,
  isMac,
  onSelectItem,
  onDeleteItem,
  onDeleteSelected,
  onUndo,
  onOpenAddDialog,
}: ListCardProps) {
  const selectedIdSet = new Set(selectedIds)

  return (
    <Card className="w-full rounded-3xl border-0 bg-[#ececec] py-10 shadow-[0_10px_28px_rgba(43,66,89,0.22)]">
      <CardHeader className="px-6 text-center md:px-11">
        <CardTitle className="text-balance text-3xl font-medium text-[#2f3137] md:text-5xl">This is a technical proof</CardTitle>
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
          {items.length === 0 ? (
            <p className="px-2 py-1 text-base text-[#81858e] md:text-lg">No items yet. Add one to start.</p>
          ) : (
            <AnimatedList className="gap-0.5" role="list" aria-label="Item list">
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  isSelected={selectedIdSet.has(item.id)}
                  onSelect={onSelectItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </AnimatedList>
          )}
        </section>
      </CardContent>

      <CardFooter className="mt-1 flex items-center justify-between gap-3 px-6 md:px-11">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canUndo}
            onClick={onUndo}
            className="h-11 w-11 rounded-full border-[#5f72ff] bg-transparent text-[#475af8] hover:bg-[#e5e9ff]"
            aria-label="Undo last action"
          >
            <RotateCcw className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!canDelete}
            onClick={onDeleteSelected}
            className="h-11 rounded-full border-[#5f72ff] bg-transparent px-7 text-base uppercase tracking-wide text-[#475af8] hover:bg-[#e5e9ff]"
          >
            Delete
          </Button>
        </div>

        <Button
          type="button"
          onClick={onOpenAddDialog}
          className="h-11 min-w-30 rounded-full bg-[#3549f5] px-9 text-base uppercase tracking-wide text-white hover:bg-[#4a5dff]"
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
