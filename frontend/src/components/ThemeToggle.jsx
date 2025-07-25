import { useEffect, useState } from 'react'
import { useTranslate } from '../localization/i18n.jsx'

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const t = useTranslate()

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  const label = theme === 'light' ? t('dark') : t('light')

  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{label}</button>
}

export default ThemeToggle
