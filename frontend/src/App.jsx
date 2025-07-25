import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import DashboardDCP from './components/DashboardDCP'
import DashboardACP from './components/DashboardACP'
import DashboardPI from './components/DashboardPI'
import { useState } from 'react'
 
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
 
}

export default App
