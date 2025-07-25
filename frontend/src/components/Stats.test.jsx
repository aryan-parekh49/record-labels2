import { describe, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Stats from './Stats'
import { LangProvider } from '../localization/i18n.jsx'

vi.stubGlobal('fetch', vi.fn())

const stats = { total: 3, pending: 2, resolved: 1, overdue: 0 }

beforeEach(() => {
  fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(stats) })
})

describe('Stats', () => {
  it('loads and displays statistics', async () => {
    render(
      <LangProvider>
        <Stats />
      </LangProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('Total: 3')).toBeInTheDocument()
    })
  })
})
