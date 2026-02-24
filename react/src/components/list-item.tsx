import type { MouseEvent } from 'react'

import type { ListItem as ListItemModel } from '@/store/use-list-store'

type ListItemProps = {
  item: ListItemModel
  isSelected: boolean
  onSelect: (id: string, multiSelect: boolean) => void
  onDelete: (id: string) => void
}

export function ListItem({ item, isSelected, onSelect, onDelete }: ListItemProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 2) {
      onDelete(item.id)
      return
    }

    onSelect(item.id, event.metaKey || event.ctrlKey)
  }

  return (
    <button
      type="button"
      role="listitem"
      onClick={handleClick}
      onDoubleClick={() => onDelete(item.id)}
      className={[
        'w-full cursor-pointer px-3 py-1 text-left text-2xl text-[#50545b] transition-colors md:text-[2rem]',
        isSelected ? 'bg-[#3549f5] text-white' : 'hover:bg-[#dbe2ff]',
      ].join(' ')}
    >
      {item.text}
    </button>
  )
}
