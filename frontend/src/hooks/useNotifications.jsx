import { createContext, useContext, useEffect, useState } from 'react'

const NotificationsContext = createContext([])

export function NotificationsProvider({ children }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws')
    ws.onmessage = ev => {
      try {
        const msg = JSON.parse(ev.data)
        setMessages(m => [...m, msg])
      } catch {}
    }
    return () => ws.close()
  }, [])

  return (
    <NotificationsContext.Provider value={messages}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}
