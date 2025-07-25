import { useEffect, useState } from 'react'
import { listEvidence, addEvidence, deleteEvidence } from '../services/api.js'
import { useTranslate } from '../localization/i18n.jsx'

function EvidenceList({ crimeId }) {
  const [items, setItems] = useState([])
  const [type, setType] = useState('photo')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState(null)
  const t = useTranslate()

  useEffect(() => {
    async function load() {
      try {
        const data = await listEvidence(crimeId)
        setItems(data)
      } catch (e) {
        setError(e.message)
      }
    }
    load()
  }, [crimeId])

  async function handleAdd(e) {
    e.preventDefault()
    try {
      const item = await addEvidence(crimeId, type, desc)
      setItems([...items, item])
      setDesc('')
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(id) {
    await deleteEvidence(id)
    setItems(items.filter(i => i.id !== id))
  }

  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h4>{t('evidence')}</h4>
      <form onSubmit={handleAdd}>
        <input value={type} onChange={e => setType(e.target.value)} placeholder={t('evidenceType')} />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('description')} />
        <button type='submit'>{t('addEvidence')}</button>
      </form>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.type}: {i.description}
            <button onClick={() => handleDelete(i.id)}>{t('delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EvidenceList
