import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import ProfessorPanelLayout from './Layout'
import ManageGames from '@/MxRep/Views/Panel/Professor/ManageGames'
import ManageClasses from '@/MxRep/Views/Panel/Professor/ManageClasses'
import Inbox from '@/MxRep/Views/Panel/Professor/Inbox'
import Profile from '@/MxRep/Views/Panel/Professor/Profile'

function ProfessorPanelRouter() {

  return (
    <Routes>

      <Route path="/" element={<ProfessorPanelLayout />}>
        <Route index element={<Navigate to="manage-games" />} />
        <Route path="manage-games" element={<ManageGames />} />
        <Route path="manage-classes" element={<ManageClasses />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
    </Routes>
  )
}

export default ProfessorPanelRouter