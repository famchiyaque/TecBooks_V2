import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import AuthLayout from './Layout'
import { useNavigate } from 'react-router-dom'
import LoginForm from '@/MxRep/Forms/Auth/Login'
import ResetPasswordForm from '@/MxRep/Forms/Auth/ResetPassword'
import ForgotPasswordForm from '@/MxRep/Forms/Auth/ForgotPassword'

function AuthRouter() {

  return (
    <Routes>

      <Route path="/" element={ <AuthLayout /> } >
        <Route index element={ <Navigate to="login" replace /> } />

        {/* How do I wrap this in authcontext form just as an extra thing? no redirect of course */}
        <Route path="login" element={ <LoginForm /> } />

        <Route path="forgot-password" element={ <ForgotPasswordForm /> } />

        <Route path="reset-password" element={ <ResetPasswordForm /> } />
      </Route>
      
    </Routes>
  )
}

export default AuthRouter