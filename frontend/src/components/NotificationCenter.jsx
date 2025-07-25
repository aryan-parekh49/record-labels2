import { useNotifications } from '../hooks/useNotifications.jsx'
import { useTranslate } from '../localization/i18n.jsx'

function NotificationCenter() {
  const notes = useNotifications()
  const t = useTranslate()
  if (!notes.length) return null
  return (
    <div className='notifications'>
      <h4>{t('notifications')}</h4>
      <ul>
        {notes.slice(-5).map((n, idx) => (
          <li key={idx}>{n.event}</li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationCenter
