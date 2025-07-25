import { useEffect, useState } from 'react'
import { getCrimes, resolveCrime, escalateCrime } from '../services/api.js'

function CrimeList() {
  const [crimes, setCrimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          <th>Type</th>
          <th>Status</th>
          <th>Deadline</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {crimes.map(c => (
          <tr key={c.id} className={c.overdue ? 'overdue' : ''}>
            <td>{c.id}</td>
            <td>{c.type || c.heading}</td>
            <td>{c.status}</td>
            <td>{new Date(c.deadline).toLocaleDateString()}</td>
            <td>
              {c.status !== 'resolved' && (
                <button onClick={() => handleResolve(c.id)}>Resolve</button>
              )}
              {' '}
              {!c.escalated && c.overdue && (
                <button onClick={() => handleEscalate(c.id)}>Escalate</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CrimeList
