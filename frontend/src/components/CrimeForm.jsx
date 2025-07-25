import { useState } from 'react'
import { createCrime } from '../services/api.js'
import { useTranslate } from '../localization/i18n.jsx'

function CrimeForm({ onCreated }) {
  const [type, setType] = useState('')
  const [station, setStation] = useState('StationA')
  const [officer, setOfficer] = useState('')
  const t = useTranslate()

  const handleSubmit = async e => {
    e.preventDefault()
    const crime = await createCrime({ type, station, officer })
    setType('')
    onCreated && onCreated(crime)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={type} onChange={e => setType(e.target.value)} placeholder={t('crimeType')} required />
      <input value={station} onChange={e => setStation(e.target.value)} placeholder={t('station')} />
      <input value={officer} onChange={e => setOfficer(e.target.value)} placeholder={t('officer')} />
      <button type="submit">{t('addCrime')}</button>
    </form>
  )
}

export default CrimeForm
