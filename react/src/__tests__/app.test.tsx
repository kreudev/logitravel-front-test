import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '@/App'
import { useListStore } from '@/store/use-list-store'

const seedItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((text, index) => ({
  id: `seed-${index + 1}`,
  text,
}))

const resetStore = () => {
  useListStore.setState({
    items: seedItems,
    selectedIds: [],
    history: [],
    isAddDialogOpen: false,
    draftText: '',
  })
}

describe('React list app', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders initial items', () => {
    render(<App />)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 4')).toBeInTheDocument()
  })

  it('adds a new item from the dialog', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add' }))

    const input = screen.getByPlaceholderText('Type the text here...')
    await user.type(input, 'New task')
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: /^add$/i }))

    expect(screen.getByText('New task')).toBeInTheDocument()
  })

  it('deletes selected items', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Item 2'))
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument()
    })
  })

  it('supports multi-select delete with ctrl/cmd click', async () => {
    const user = userEvent.setup()
    render(<App />)

    fireEvent.click(screen.getByText('Item 1'), { ctrlKey: true })
    fireEvent.click(screen.getByText('Item 3'), { ctrlKey: true })
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Item 3')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('deletes an item on double click', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.dblClick(screen.getByText('Item 4'))

    await waitFor(() => {
      expect(screen.queryByText('Item 4')).not.toBeInTheDocument()
    })
  })

  it('undoes the last change', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Item 2'))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await user.click(screen.getByRole('button', { name: /undo last action/i }))

    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })
})
