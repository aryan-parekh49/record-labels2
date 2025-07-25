import CrimeList from './CrimeList'
import CrimeForm from './CrimeForm'
import LanguageSelector from './LanguageSelector'
 
import Stats from './Stats'
import { useTranslate } from '../localization/i18n.jsx'

function DashboardACP() {
  const t = useTranslate()
  return (
    <div>
      <LanguageSelector />
 
      <h2>{t('acpDash')}</h2>
      <Stats />
      <CrimeForm />
      <CrimeList />
    </div>
  )
}

export default DashboardACP
