import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import StudentPanelRouter from './Panel/Student/Router'
import ProfessorPanelRouter from './Panel/Professor/Router'
import AdminPanelRouter from './Panel/Admin/Router'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DashboardRouter from './Dashboard/Router'
import { SimDataProvider } from '@/MxRep/utils/contexts/SimDataContext'
import Loader from '@/Global Components/Loader'

function InstitutionRouter() {
    const navigate = useNavigate()
    const { user, isLoading, isInitialized } = useAuth()
    const { slug } = useParams()

    useEffect(() => {
      // Wait for auth to be initialized before doing validation
      if (!isInitialized || isLoading) {
        console.log("[INSTITUTION ROUTER] Waiting for auth initialization...")
        return
      }

      console.log("[INSTITUTION ROUTER] Auth initialized, validating user:", user)

      // Super-admin doesn't need institution validation
      if (user?.role === 'super-admin') {
        console.log("Super-admin detected - redirecting to super-admin panel")
        navigate("/mxrep/super-admin-panel")
        return
      }

      if (!user || !user.institution) {
        console.log("No user or institution data - redirecting to logout")
        navigate("/mxrep/logout")
        return
      }
      
      const userSlug = user.institution.slug

      console.log("Slug from params:", slug)
      console.log("User slug:", userSlug)

      if (!slug || !userSlug || slug !== userSlug) {
        console.log("Slug mismatch - redirecting to logout")
        navigate('/mxrep/logout')
      }
    }, [user, isLoading, isInitialized, slug, navigate])

    const getUserPanelRoute = () => {
        if (!user) return null
        
        switch (user.role) {
            case "student" : return "student-panel"
            case "professor" : return "professor-panel"
            case "admin" : return "admin-panel"
            default:
              navigate('/mxrep/logout')
              return null
        }
    }

    // Show loader while authentication is being established
    if (!isInitialized || isLoading) {
      return <Loader message="Initializing session..." />
    }

    // If no user after initialization, don't render routes (redirect will happen in useEffect)
    if (!user) {
      return <Loader message="Authenticating..." />
    }
   
  return (
    <Routes>
      <Route path="/" element={ <Navigate to={`${getUserPanelRoute()}`} /> } />
      <Route path="my-panel" element={ <Navigate to={`${getUserPanelRoute()}`} /> } />

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