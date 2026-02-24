import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type AddItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
  canSubmit: boolean
}

export function AddItemDialog({
  open,
  onOpenChange,
  value,
  onValueChange,
  onSubmit,
  canSubmit,
}: AddItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-2xl rounded-2xl border border-[#d4d5da] bg-[#ececec] p-8">
        <DialogHeader className="space-y-3 text-left">
          <DialogTitle className="text-3xl font-normal text-[#383c43]">Add item to list</DialogTitle>
          <DialogDescription className="hidden">Type a new item and add it to the list.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
          className="grid gap-5"
        >
          <Input
            value={value}
            onChange={(event) => onValueChange(event.currentTarget.value)}
            placeholder="Type the text here..."
            autoFocus
            maxLength={120}
            className="h-15 rounded-none border-2 border-[#d0d0d2] bg-white/20 px-4 text-lg text-[#2f3239] shadow-none placeholder:text-[#a4a7af] focus-visible:border-[#7080ff] focus-visible:ring-0"
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
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-full border-[#5f72ff] bg-transparent px-8 text-base uppercase tracking-wide text-[#475af8] hover:bg-[#e5e9ff]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
