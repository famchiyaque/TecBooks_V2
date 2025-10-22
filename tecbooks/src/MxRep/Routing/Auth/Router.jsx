import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import AuthLayout from './Layout'
import { useNavigate } from 'react-router-dom'
import SignInForm from '@/MxRep/Forms/Auth/SignIn'
import ResetPasswordForm from '@/MxRep/Forms/Auth/ResetPassword'
import ForgotPasswordForm from '@/MxRep/Forms/Auth/ForgotPassword'

function AuthRouter() {

  return (
    <Routes>

      <Route path="/" element={ <AuthLayout /> } >
        <Route index element={ <Navigate to="sign-in" replace /> } />

        {/* How do I wrap this in authcontext form just as an extra thing? no redirect of course */}
        <Route path="sign-in" element={ <SignInForm /> } />

        <Route path="forgot-password" element={ <ForgotPasswordForm /> } />

        <Route path="reset-password" element={ <ResetPasswordForm /> } />
      </Route>
      
    </Routes>
  )
}

export default AuthRouter