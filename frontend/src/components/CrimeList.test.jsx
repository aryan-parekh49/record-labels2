import { describe, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CrimeList from './CrimeList'
import { LangProvider } from '../localization/i18n.jsx'

vi.stubGlobal('fetch', vi.fn())

const crimes = [{id:1,type:'theft',status:'pending',deadline:new Date().toISOString(),overdue:false}]

beforeEach(() => {
  fetch.mockResolvedValue({ ok:true, json: () => Promise.resolve(crimes) })
})

describe('CrimeList', () => {
  it('renders crimes from API', async () => {
    render(
      <LangProvider>
        <CrimeList />
      </LangProvider>
    )
    expect(fetch).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByText('theft')).toBeInTheDocument()
    })
  })
})
