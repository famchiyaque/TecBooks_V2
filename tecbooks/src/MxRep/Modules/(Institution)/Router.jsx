import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import StudentPanelRouter from './Panel/Panels/Student/Router'
import ProfessorPanelRouter from './Panel/Panels/Professor/Router'
import AdminPanelRouter from './Panel/Panels/Admin/Router'
import { useAuth } from '../../utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from './Dashboard/Layout'
import DashboardRouter from './Dashboard/Router'


function InstitutionRouter() {
    const navigate = useNavigate()
    const { authData, exampleAuthContext, isLoading } = useAuth()
    const { slug } = useParams()

    useEffect(() => {
      console.log("INSIDE INSITUTION ROUTER USEEFFECT")
      console.log("Slug pulled from params is: ", slug)
      console.log("Example auth slug is: ", exampleAuthContext.slug)

      if (slug != exampleAuthContext.slug) navigate('/mxrep/auth/sign-in?error=wrong-slug')
    }, [])

    useEffect(() => {
      if (!authData && !exampleAuthContext) navigate('/mxrep/sign-in?error=missing-data')
    }, [authData, exampleAuthContext, navigate])

    const getUserPanelRoute = () => {
        switch (exampleAuthContext.type) {
            case "student" : return "student-panel"
            case "professor" : return "professor-panel"
            case "admin" : return "admin-panel"
        }

        navigate('/mxrep/sign-in?error=user-type')
    }
   
    if (isLoading) return <Loader />

  return (
    <Routes>
      <Route path="/" element={ <Navigate to={`${getUserPanelRoute}`} /> } />

      <Route path="student-panel/*" element={ <StudentPanelRouter /> } />
      <Route path="professor-panel/*" element={ <ProfessorPanelRouter /> } />
      <Route path="admin-panel/*" element={ <AdminPanelRouter /> } />

      <Route path="dashboard/*" 
        element={ 
          <DashboardLayout>
            <DashboardRouter />
          </DashboardLayout>
        } 
      />
      
    </Routes>
  )
}

export default InstitutionRouter