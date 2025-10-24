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
    // const navigate = useNavigate()
    // const { user } = useAuth()
    // const { slug } = useParams()

    // useEffect(() => {
    //   if (!user || !slug || !user.institution.slug) navigate('/mxrep/logout')
    //   console.log("Slug found in params of student panel: ", slug)
    //   console.log
    //   // Is this correct? the slug isn't really a param, more of a route
    //     if (slug != user.institution.slug) navigate('/mxrep/auth/logout')
    // }, [])

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