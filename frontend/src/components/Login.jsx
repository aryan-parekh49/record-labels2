import { useState } from 'react'
import { useTranslate } from '../localization/i18n.jsx'
import LanguageSelector from './LanguageSelector'

function Login({ onLogin }) {
  const [role, setRole] = useState('PI')
  const t = useTranslate()

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(role)
  }

  return (
    <form onSubmit={handleSubmit}>
      <LanguageSelector />
      <h1>{t('login')}</h1>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="DCP">DCP</option>
        <option value="ACP">ACP</option>
        <option value="PI">PI</option>
      </select>
      <button type="submit">Enter</button>
    </form>
  )
}

export default Login
