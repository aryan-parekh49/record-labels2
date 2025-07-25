import CrimeList from './CrimeList'
import CrimeForm from './CrimeForm'
import LanguageSelector from './LanguageSelector'
 
import Stats from './Stats'
import { useTranslate } from '../localization/i18n.jsx'

function DashboardPI() {
  const t = useTranslate()
  return (
    <div>
      <LanguageSelector />
 
      <h2>{t('piDash')}</h2>
      <Stats />
      <CrimeForm />
      <CrimeList />
    </div>
  )
}

export default DashboardPI
