import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import StudentPanelRouter from './Panel/Student/Router'
import ProfessorPanelRouter from './Panel/Professor/Router'
import AdminPanelRouter from './Panel/Admin/Router'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DashboardRouter from './Dashboard/Router'
import { SimDataProvider } from '@/MxRep/utils/contexts/SimDataContext'

function InstitutionRouter() {
    const navigate = useNavigate()
    const { user, isLoading } = useAuth()
    const { slug } = useParams()

    useEffect(() => {
      if (isLoading) return
      console.log("User: ", user)

      if (!user || !user.institution) {
        console.log("No user or institution data - redirecting to logout")
        navigate("/mxrep/logout")
        return
      }
      const userSlug = user.institution.slug

      console.log("INSIDE INSITUTION ROUTER USEEFFECT")
      console.log("Slug pulled from params is: ", slug)
      console.log("User slug is: ", userSlug)

      if (!slug || !userSlug || slug !== userSlug) {
        console.log("Slug mismatch - redirecting to logout")
        navigate('/mxrep/logout')
      }
    }, [user, isLoading, slug, navigate])

    const getUserPanelRoute = () => {
        switch (user.role) {
            case "student" : return "student-panel"
            case "professor" : return "professor-panel"
            case "admin" : return "admin-panel"
        }

        navigate('/mxrep/logout')
    }
   
    console.log("Getting to router now ...")
  return (
    <Routes>
      <Route path="/" element={ <Navigate to={`${getUserPanelRoute}`} /> } />
      <Route path="my-panel" element={ <Navigate to={`${getUserPanelRoute}`} /> } />

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