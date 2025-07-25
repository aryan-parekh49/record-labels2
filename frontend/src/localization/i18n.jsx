import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    login: 'Crime CRS Login',
    addCrime: 'Add Crime',
    crimeType: 'Crime type',
    station: 'Station',
    officer: 'Officer',
    submit: 'Submit',
    dcpDash: 'Crime CRS - DCP Dashboard',
    acpDash: 'Crime CRS - ACP Dashboard',
    piDash: 'Crime CRS - PI Dashboard',
    resolve: 'Resolve',
    escalate: 'Escalate',
    language: 'Language',
 
  },
  hi: {
    login: 'क्राइम सीआरएस लॉगिन',
    addCrime: 'अपराध जोड़ें',
    crimeType: 'अपराध प्रकार',
    station: 'स्टेशन',
    officer: 'अधिकारी',
    submit: 'जमा करें',
    dcpDash: 'क्राइम सीआरएस - डीसीपी डैशबोर्ड',
    acpDash: 'क्राइम सीआरएस - एसीपी डैशबोर्ड',
    piDash: 'क्राइम सीआरएस - पीआई डैशबोर्ड',
    resolve: 'समाधान',
    escalate: 'एस्कलेट',
    language: 'भाषा',
 
  },
  mr: {
    login: 'क्राईम सीआरएस लॉगिन',
    addCrime: 'गुन्हा जोडा',
    crimeType: 'गुन्ह्याचा प्रकार',
    station: 'स्टेशन',
    officer: 'अधिकारी',
    submit: 'सबमिट',
    dcpDash: 'क्राईम सीआरएस - डीसीपी डॅशबोर्ड',
    acpDash: 'क्राईम सीआरएस - एसीपी डॅशबोर्ड',
    piDash: 'क्राईम सीआरएस - पीआय डॅशबोर्ड',
    resolve: 'निकाल',
    escalate: 'एस्कलेट',
    language: 'भाषा',
 
  },
};

export const LangContext = createContext('en')

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  return (
    <LangContext.Provider value={{lang, setLang}}>{children}</LangContext.Provider>
  )
}

export function useTranslate() {
  const { lang } = useContext(LangContext)
  return (key) => translations[lang][key] || key
}
