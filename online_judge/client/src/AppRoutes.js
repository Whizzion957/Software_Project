import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SubmissionPage from './pages/SubmissionPage'
import ProblemList from './pages/ProblemList'
import SubmissionHistory from './pages/SubmissionHistory'
import HomePage from './pages/HomePage'
import ProblemDetail from './pages/ProblemDetail'

export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/problems' element={<ProblemList/>}/>
        <Route path='/submit' element={<SubmissionPage/>}/>
        <Route path='/history' element={<SubmissionHistory userId={1}/>}/>
        <Route path='/problems/:id' element={<ProblemDetail/>}/>
    </Routes>
  )
}
