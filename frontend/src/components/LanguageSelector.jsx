import { useContext } from 'react'
import { LangContext, useTranslate } from '../localization/i18n.jsx'

function LanguageSelector() {
  const { lang, setLang } = useContext(LangContext)
  const t = useTranslate()
  return (
    <label>
      {t('language')}: 
      <select value={lang} onChange={e => setLang(e.target.value)}>
        <option value="en">EN</option>
        <option value="hi">HI</option>
        <option value="mr">MR</option>
      </select>
    </label>
  )
}

export default LanguageSelector
