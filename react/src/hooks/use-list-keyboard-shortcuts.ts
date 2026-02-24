import { useEffect } from 'react'

type UseListKeyboardShortcutsParams = {
  canDelete: boolean
  onDelete: () => void
  onUndo: () => void
}

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
}

export const useListKeyboardShortcuts = ({
  canDelete,
  onDelete,
  onUndo,
}: UseListKeyboardShortcutsParams) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        onUndo()
        return
      }

      if (isEditableTarget(event.target)) {
        return
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && canDelete) {
        event.preventDefault()
        onDelete()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [canDelete, onDelete, onUndo])
}
