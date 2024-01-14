import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import Inspector from './views/Inspector'

function App() {

  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/inspector/" element={<Inspector />} />
          <Route path="*" element={<Dashboard />}/>
          <Route path="/test/:id" element={<Dashboard />}/>
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
