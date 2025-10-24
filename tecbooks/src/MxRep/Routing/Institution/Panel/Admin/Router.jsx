import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import AdminPanelLayout from './Layout'
import ManageProfessors from '@/MxRep/Views/Panel/Admin/ManageProfessors'
import Inbox from '@/MxRep/Views/Panel/Admin/Inbox'
import Profile from '@/MxRep/Views/Panel/Admin/Profile'

function AdminPanelRouter() {

  return (
    <Routes>

      <Route path="/" element={<AdminPanelLayout />}>
        <Route index element={<Navigate to="manage-professors" />} />
        <Route path="manage-professors" element={<ManageProfessors />} />
        <Route path="inbox" element={ <Inbox />} />
        <Route path="profile" element={ <Profile />} />
      </Route>
      
    </Routes>
  )
}

export default AdminPanelRouter