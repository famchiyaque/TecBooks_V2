// src/MxRep/hooks/useSignIn.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/MxRep/utils/services/auth.service'

export const useLogin = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const login = async (credentials) => {
    console.log("[LOGIN HOOK] credentials: ", credentials)
    setIsLoading(true)
    setError("")
    
    try {
      const response = await authService.login(credentials)
      console.log("response: ", response)
      const result = await authService.handleLoginResponse(response)
      console.log("result: ", result)

      navigate(`/mxrep/${result.slug}/${result.role}-panel`)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
    error,
    setError
  }
}