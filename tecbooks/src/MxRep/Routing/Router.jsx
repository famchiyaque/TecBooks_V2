import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AuthRouter from './Auth/Router'
import RegisterRouter from './Registry/Router'
import InstitutionRouter from './Institution/Router'
import { AuthProvider } from '../utils/contexts/AuthContext'

function MxRepRouter() {
   
  return (
    <Routes>
      <Route index element={ <Navigate to="auth" replace /> } />

      <Route path="registry/*" element={ <RegisterRouter /> } />

      <Route path="auth/*" element={  <AuthRouter /> } />

      <Route 
        path=":slug/*" 
        element={
          <AuthProvider>
            <InstitutionRouter />
          </AuthProvider>
        } 
      />
            
    </Routes>
  )
}

export default MxRepRouter