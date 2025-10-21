import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AuthRouter from './Modules/Auth/Router'
import RegisterRouter from './Modules/Register/Router'
import InstitutionRouter from './Modules/(Institution)/Router'
import { AuthProvider } from './Context/AuthContext'

function MxRepRouter() {
   
  return (
    <Routes>
      <Route index element={ <Navigate to="auth" replace /> } />

      <Route path="register/*" element={ <RegisterRouter /> } />

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