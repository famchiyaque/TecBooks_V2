import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import StudentPanelLayout from './Layout'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
import Games from '@/MxRep/Views/Panel/Student/Games'
import Inbox from '@/MxRep/Views/Panel/Student/Inbox'
import Profile from '@/MxRep/Views/Panel/Student/Profile'


function StudentPanelRouter() {
    const navigate = useNavigate()
    const { authData, exampleAuthContext, isLoading } = useAuth()
    const { slug } = useParams()

    useEffect(() => {
      // Is this correct? the slug isn't really a param, more of a route
        if (slug != exampleAuthContext.slug) navigate('/mxrep/auth/sign-in?error=wrong-slug')
    }, [])

    // const getUserPanelRoute = () => {
    //     switch (exampleAuthContext.type) {
    //         case "student" : return "student-panel"
    //         case "professor" : return "professor-panel"
    //         case "admin" : return "admin-panel"
    //     }

    //     navigate('/mxrep/sign-in?error=user-type')
    // }
   
    if (!authData && !exampleAuthContext) navigate('/mxrep/sign-in?error=missing-data')
    if (isLoading) return <Loader />

  return (
    <Routes>

      <Route path="/" element={<StudentPanelLayout />}>
        <Route index element={<Navigate to="my-games" />} />
        <Route path="my-games" element={<Games />} />
        <Route path="inbox" element={ <Inbox />} />
        <Route path="profile" element={ <Profile />} />
      </Route>
      
    </Routes>
  )
}

export default StudentPanelRouter