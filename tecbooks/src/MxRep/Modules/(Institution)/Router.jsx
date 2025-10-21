import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom'
import DashboardRouter from './Dashboard/Router'
import StudentPanel from './UserPanels/StudentPanel'
import ProfessorPanel from './UserPanels/ProfessorPanel'
import AdminPanel from './UserPanels/AdminPanel'
import { useAuth } from '../../Context/AuthContext'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'


function InstitutionRouter() {
    const navigate = useNavigate()
    const { authData, isLoading } = useAuth()

    useEffect(() => {
      // Is this correct? the slug isn't really a param, more of a route
        const { slug } = useParams()
        if (slug != authData.slug) navigate('/mxrep/auth/sign-in')
    }, [])

    const getUserPanelRoute = () => {
        switch (authData.type) {
            case "student" : return "student-panel"
            case "professor" : return "professor-panel"
            case "admin" : return "admin-panel"
        }

        navigate('/mxrep/sign-in?error=user-type')
    }
   
    if (!authData) navigate('/mxrep/sign-in?error=missing-data')
    if (isLoading) return <Loader />

  return (
    <Routes>
      <Route path="/" element={ <MainLayout /> } >
        <Route index element={ <Navigate to={`${getUserPanelRoute}`} /> } />
        <Route path="/student-panel" element={ <StudentPanel /> } />
        <Route path="/professor-panel" element={ <ProfessorPanel /> } />
        <Route path="/admin-panel" element={ <AdminPanel /> } />

        <Route path="/dashboard/*" element={ <DashboardRouter /> } />
      </Route>
      
    </Routes>
  )
}

export default InstitutionRouter