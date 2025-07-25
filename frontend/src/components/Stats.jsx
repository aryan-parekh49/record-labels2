import { useEffect, useState } from 'react'
import { getStats } from '../services/api.js'

function Stats() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getStats()
        setStats(data)
      } catch (e) {
        setError(e.message)
      }
    }
    load()
  }, [])

  if (error) return <p>Error: {error}</p>
  if (!stats) return <p>Loading stats...</p>

  return (
    <ul>
      <li>Total: {stats.total}</li>
      <li>Pending: {stats.pending}</li>
      <li>Resolved: {stats.resolved}</li>
      <li>Overdue: {stats.overdue}</li>
    </ul>
  )
}

export default Stats
