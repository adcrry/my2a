import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import Inspector from './views/Inspector'
import Upload from './views/Upload'
import UploadStudent from './views/UploadStudent'
import Courses from './views/Courses'


function App() {

  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/inspector/" element={<Inspector />} />
          <Route path="/inspector/courses" element={<Courses />} />
          <Route path="/inspector/upload/course" element={<Upload />} />
          <Route path="/inspector/upload/student" element={<UploadStudent />} />
          <Route path="*" element={<Dashboard />} />
          <Route path="/test/:id" element={<Dashboard />} />
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
