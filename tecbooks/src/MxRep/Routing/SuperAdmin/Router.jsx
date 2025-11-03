import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import SuperAdminPanelLayout from './Layout'
import ManageInstitutions from '@/MxRep/Views/Panel/SuperAdmin/ManageInstitutions'
import InstitutionView from '@/MxRep/Views/Panel/SuperAdmin/Institution/Institution'
import Inbox from '@/MxRep/Views/Panel/SuperAdmin/Inbox'
import Profile from '@/MxRep/Views/Panel/SuperAdmin/Profile'

function SuperAdminPanelRouter() {
  const { user, isLoading, isInitialized, isSuperAdmin, logout } = useAuth()

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      console.log("[SUPER ADMIN ROUTER] waiting for auth initialization")
      return
    }

    console.log("[SUPER ADMIN ROUTER] user: ", user)
    if (!isSuperAdmin()) {
      logout("Does not have super-admin privileges")
    }
  }, [isInitialized, isLoading, user, isSuperAdmin, logout])

  return (
    <Routes>
      <Route path="/" element={<SuperAdminPanelLayout />}>
        <Route index element={<Navigate to="manage-institutions" />} />

        <Route path="manage-institutions">
          <Route index element={<ManageInstitutions />} />
          <Route path=":institutionId" element={<InstitutionView />} />
        </Route>

        <Route path="inbox" element={<Inbox />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default SuperAdminPanelRouter

