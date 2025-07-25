 
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
 
        ))}
      </tbody>
    </table>
  )
}

export default CrimeList
