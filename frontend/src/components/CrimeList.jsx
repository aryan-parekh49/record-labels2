import { useEffect, useState, Fragment } from 'react'
import { getCrimes, resolveCrime, escalateCrime } from '../services/api.js'
import EvidenceList from './EvidenceList.jsx'
import { useTranslate } from '../localization/i18n.jsx'

function CrimeList() {
  const [crimes, setCrimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const t = useTranslate()

  useEffect(() => {
    async function load() {
      try {
        const data = await getCrimes()
        setCrimes(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleResolve(id) {
    await resolveCrime(id)
    setCrimes(crimes.map(c => c.id === id ? {...c, status: 'resolved'} : c))
  }

  async function handleEscalate(id) {
    const reason = prompt('Enter escalation reason:')
    if (!reason) return
    await escalateCrime(id, reason)
    setCrimes(crimes.map(c => c.id === id ? {...c, escalated: true} : c))
  }

  const [showEvidenceFor, setShowEvidenceFor] = useState(null)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>{t('crimeType')}</th>
          <th>Status</th>
          <th>Deadline</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {crimes.map(c => (
          <Fragment key={c.id}>
            <tr key={c.id} className={c.overdue ? 'overdue' : ''}>
              <td>{c.id}</td>
              <td>{c.type || c.heading}</td>
              <td>{c.status}</td>
              <td>{new Date(c.deadline).toLocaleDateString()}</td>
              <td>
                {c.status !== 'resolved' && (
                  <button onClick={() => handleResolve(c.id)}>{t('resolve')}</button>
                )}
                {' '}
                {!c.escalated && c.overdue && (
                  <button onClick={() => handleEscalate(c.id)}>{t('escalate')}</button>
                )}
                {' '}
                <button onClick={() => setShowEvidenceFor(showEvidenceFor===c.id?null:c.id)}>
                  {t('evidence')}
                </button>
              </td>
            </tr>
            {showEvidenceFor === c.id && (
              <tr>
                <td colSpan="5">
                  <EvidenceList crimeId={c.id} />
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  )
}

export default CrimeList
