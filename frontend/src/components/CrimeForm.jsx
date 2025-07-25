import { useState } from 'react'
import { createCrime } from '../services/api.js'

function CrimeForm({ onCreated }) {
  const [type, setType] = useState('')
  const [station, setStation] = useState('StationA')
  const [officer, setOfficer] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    const crime = await createCrime({ type, station, officer })
    setType('')
    onCreated && onCreated(crime)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={type} onChange={e => setType(e.target.value)} placeholder="Crime type" required />
      <input value={station} onChange={e => setStation(e.target.value)} placeholder="Station" />
      <input value={officer} onChange={e => setOfficer(e.target.value)} placeholder="Officer" />
      <button type="submit">Add Crime</button>
    </form>
  )
}

export default CrimeForm
