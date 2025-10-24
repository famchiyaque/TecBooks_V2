import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import AuthRouter from './Auth/Router'
import RegisterRouter from './Registry/Router'
import InstitutionRouter from './Institution/Router'
import { AuthProvider } from '../utils/contexts/AuthContext'
import Logout from './Auth/Logout'

function MxRepRouter() {
   
  return (
    <AuthProvider>
      <Routes>
        <Route index element={ <Navigate to="auth" replace /> } />

        <Route path="registry/*" element={ <RegisterRouter /> } />

        <Route path="auth/*" element={  <AuthRouter /> } />

        <Route path=":slug/*" element={ <InstitutionRouter /> } />

        <Route path="logout" element={ <Logout /> } />
              
      </Routes>
    </AuthProvider>
  )
}

export default MxRepRouter