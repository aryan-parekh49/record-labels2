import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import DashboardDCP from './components/DashboardDCP'
import DashboardACP from './components/DashboardACP'
import DashboardPI from './components/DashboardPI'
import { useState } from 'react'
 import NotificationCenter from './components/NotificationCenter.jsx'
import { NotificationsProvider } from './hooks/useNotifications.jsx'
=======
 
 import './App.css'

function App() {
  const [role, setRole] = useState(null)

  if (!role) {
    return (
      <Router>
        <Login onLogin={setRole} />
      </Router>
    )
  }

  return (
     <NotificationsProvider>
      <Router>
        <NotificationCenter />
        <Routes>
          <Route path="/dcp" element={role==='DCP'?<DashboardDCP/>:<Navigate to="/"/>} />
          <Route path="/acp" element={role==='ACP'?<DashboardACP/>:<Navigate to="/"/>} />
          <Route path="/pi" element={role==='PI'?<DashboardPI/>:<Navigate to="/"/>} />
          <Route path="/" element={<Navigate to={`/${role.toLowerCase()}`}/>} />
        </Routes>
      </Router>
    </NotificationsProvider>
  )
=======
 
 }

export default App
