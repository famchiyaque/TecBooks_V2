import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import StudentPanelLayout from './Layout'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'


function StudentPanelRouter() {
    const navigate = useNavigate()
    const { authData, exampleAuthContext, isLoading } = useAuth()

    useEffect(() => {
      // Is this correct? the slug isn't really a param, more of a route
        const { slug } = useParams()
        if (slug != exampleAuthContext.slug) navigate('/mxrep/auth/sign-in?error=wrong-slug')
    }, [])

    const getUserPanelRoute = () => {
        switch (exampleAuthContext.type) {
            case "student" : return "student-panel"
            case "professor" : return "professor-panel"
            case "admin" : return "admin-panel"
        }

        navigate('/mxrep/sign-in?error=user-type')
    }
   
    if (!authData && !exampleAuthContext) navigate('/mxrep/sign-in?error=missing-data')
    if (isLoading) return <Loader />

  return (
    <Routes>

      <Route path="/" element={<StudentPanelLayout />}>
        {/* <Route index element={<Navigate to="overview" />} /> */}
        <Route path="overview" element={<Overview_View />} />
        <Route path="production-line" element={<Productivity_View />} />
        <Route path="financial-health" element={<FinanceKPIs_View />} />
        <Route path="statements" element={<Financial_Statement_View />} />
        <Route path="forecasts" element={<Forecasts_View />} />
        <Route path="investments" element={<Investments_View />} />
      </Route>
      
    </Routes>
  )
}

export default StudentPanelRouter