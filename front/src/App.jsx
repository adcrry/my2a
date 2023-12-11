import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './views/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
      </Routes>
    </Router>
  )
}

export default App
