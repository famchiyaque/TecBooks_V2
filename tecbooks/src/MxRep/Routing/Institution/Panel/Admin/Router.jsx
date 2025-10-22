import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import AdminPanelLayout from './Layout'
// import 
// import ManageGames from './Views/ManageGames'
// import ManageClasses from './Views/ManageClasses'
// import Inbox from './Views/Inbox'
// import Profile from './Views/Profile'

function AdminPanelRouter() {

  return (
    <Routes>

      <Route path="/" element={<AdminPanelLayout />}>
        {/* <Route index element={<Navigate to="manage-professors" />} /> */}
        {/* <Route path="my-games" element={<Games />} />
        <Route path="inbox" element={ <Inbox />} />
        <Route path="profile" element={ <Profile />} /> */}
      </Route>
      
    </Routes>
  )
}

export default AdminPanelRouter