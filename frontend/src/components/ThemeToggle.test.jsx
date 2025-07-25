import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThemeToggle from './ThemeToggle'
import { LangProvider } from '../localization/i18n.jsx'

describe('ThemeToggle', () => {
  it('toggles theme class on body', () => {
    render(
      <LangProvider>
        <ThemeToggle />
      </LangProvider>
    )
    const btn = screen.getByRole('button')
    expect(document.body.classList.contains('light')).toBe(false)
    fireEvent.click(btn)
    expect(document.body.classList.contains('light')).toBe(true)
  })
})
