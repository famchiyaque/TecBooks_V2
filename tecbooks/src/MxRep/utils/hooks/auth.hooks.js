// src/MxRep/hooks/useSignIn.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/MxRep/utils/services/auth.service'

const getRedirectPath = (role) => {
    const routes = {
      student: '/mxrep/student-panel',
      professor: '/mxrep/professor-panel',
      admin: '/mxrep/admin-panel'
    }
    return routes[role] || '/mxrep/auth/sign-in'
}

export const useSignIn = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const signIn = async (credentials) => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await authService.signIn(credentials)
      const result = await authService.handleSignInResponse(response)

      // Navigate based on role
      const redirectPath = getRedirectPath(result.role)
      navigate(redirectPath)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signIn,
    isLoading,
    error,
    setError
  }
}