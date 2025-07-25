import { describe, it } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from './App'
import { LangProvider } from './localization/i18n.jsx'

describe('App', () => {
  it('renders heading', () => {
    render(
      <LangProvider>
        <App />
      </LangProvider>
    )
    expect(screen.getByText(/Crime CRS Login/i)).toBeInTheDocument()
  })
})
