import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import AuthLayout from './Layout'
import { useNavigate } from 'react-router-dom'
import SignInForm from './Forms/SignIn'
import ResetPasswordForm from './Forms/ResetPassword'
import ForgotPasswordForm from './Forms/ForgotPassword'

function AuthRouter() {

  return (
    <Routes>

      <Route path="/" element={ <AuthLayout /> } >
        <Route index element={ <Navigate to="sign-in" replace /> } />

        {/* How do I wrap this in authcontext form just as an extra thing? no redirect of course */}
        <Route path="sign-in" element={ <SignInForm /> } />

        <Route path="forgot-password" element={ <ResetPasswordForm /> } />

        <Route path="reset-password" element={ <ForgotPasswordForm /> } />
      </Route>
      
    </Routes>
  )
}

export default AuthRouter