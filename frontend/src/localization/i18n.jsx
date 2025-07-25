import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    login: 'Crime CRS Login',
  },
  hi: {
    login: 'क्राइम सीआरएस लॉगिन',
  },
  mr: {
    login: 'क्राईम सीआरएस लॉगिन',
  },
}

const LangContext = createContext('en')

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  return (
    <LangContext.Provider value={{lang, setLang}}>{children}</LangContext.Provider>
  )
}

export function useTranslate(key) {
  const { lang } = useContext(LangContext)
  return translations[lang][key] || key
}
