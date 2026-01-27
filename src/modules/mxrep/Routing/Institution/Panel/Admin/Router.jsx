import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import AdminPanelLayout from './Layout'
import ManageProfessors from '@/MxRep/Views/Panel/Admin/ManageProfessors'
import ProfessorView from '@/MxRep/Views/Panel/Admin/Professor/Professor'
import InviteProfessor from '@/MxRep/Views/Panel/Admin/InviteProfessor'
import ReviewProfessorRequest from '@/MxRep/Views/Panel/Admin/ReviewProfessorRequest'
import ManageStudents from '@/MxRep/Views/Panel/Admin/ManageStudents'
import StudentView from '@/MxRep/Views/Panel/Admin/Student/Student'
import Inbox from '@/MxRep/Views/Panel/Admin/Inbox'
import Profile from '@/MxRep/Views/Panel/Admin/Profile'

function AdminPanelRouter() {
  const { user, isLoading, isInitialized, isAdmin, logout } = useAuth()

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      console.log("[ADMIN ROUTER] waiting for auth initialization")
      return
    }

    console.log("[ADMIN ROUTER] user: ", user)
    if (!isAdmin()) {
      logout("Does not have admin privileges")
    }
  }, [isInitialized, isLoading, user, isAdmin, logout])


  return (
    <Routes>

      <Route path="/" element={ <AdminPanelLayout /> }>
        <Route index element={ <Navigate to="manage-professors" /> } />

        <Route path="invite-professor" element={ <InviteProfessor /> } />

        <Route path="manage-professors">
          <Route index element={ <ManageProfessors /> } />
          <Route path=":professorId" element={ <ProfessorView /> } />
        </Route>

        <Route path="manage-students">
          <Route index element={ <ManageStudents /> } />
          <Route path=":studentId" element={ <StudentView /> } />
        </Route>

        <Route path="inbox">
          <Route index element={ <Inbox />} />
          <Route path=":requestId" element={ <ReviewProfessorRequest /> } />
        </Route>
        <Route path="profile" element={ <Profile />} />
      </Route>
      
    </Routes>
  )
}

export default AdminPanelRouter