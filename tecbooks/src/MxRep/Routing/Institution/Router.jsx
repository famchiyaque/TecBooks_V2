import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import StudentPanelRouter from './Panel/Student/Router'
import ProfessorPanelRouter from './Panel/Professor/Router'
import AdminPanelRouter from './Panel/Admin/Router'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
// import DashboardLayout from './Dashboard/Layout'
import DashboardRouter from './Dashboard/Router'
import { SimDataProvider } from '@/MxRep/utils/contexts/SimDataContext'

function InstitutionRouter() {
    const navigate = useNavigate()
    const { authData, exampleAuthContext, isLoading } = useAuth()
    const { slug } = useParams()

    useEffect(() => {
      console.log("INSIDE INSITUTION ROUTER USEEFFECT")
      console.log("Slug pulled from params is: ", slug)
      console.log("Example auth slug is: ", exampleAuthContext.slug)

      if (slug != exampleAuthContext.slug) navigate('/mxrep/auth/login?error=wrong-slug')
    }, [])

    useEffect(() => {
      if (!authData && !exampleAuthContext) navigate('/mxrep/login?error=missing-data')
    }, [authData, exampleAuthContext, navigate])

    const getUserPanelRoute = () => {
        switch (exampleAuthContext.role) {
            case "student" : return "student-panel"
            case "professor" : return "professor-panel"
            case "admin" : return "admin-panel"
        }

        navigate('/mxrep/login?error=user-type')
    }
   
    if (isLoading) return <Loader />

    console.log("Getting to router now ...")
  return (
    <Routes>
      <Route path="/" element={ <Navigate to={`${getUserPanelRoute}`} /> } />

      <Route path="student-panel/*" element={ <StudentPanelRouter /> } />
      <Route path="professor-panel/*" element={ <ProfessorPanelRouter /> } />
      <Route path="admin-panel/*" element={ <AdminPanelRouter /> } />

      <Route path="dashboard/*" 
        element={ 
            <SimDataProvider>
              <DashboardRouter />
            </SimDataProvider>
        } 
      />
      
    </Routes>
  )
}

export default InstitutionRouter