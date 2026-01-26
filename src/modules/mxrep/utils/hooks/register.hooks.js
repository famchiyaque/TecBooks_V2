// src/MxRep/hooks/useSignIn.js
import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { registerService } from '@/MxRep/utils/services/register.service'

export const useRegisterInstitution = () => {
//   const navigate = useNavigate()
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setError] = useState("")

  const registerInstitutionRequest = async (data) => {
    console.log("[REGISTER INST. HOOK] data: ", data)
    setIsLoading(true)
    setError("")
    setSubmitSuccess(false)
    
    try {
      await registerService.registerInstitution(data)
      setSubmitSuccess(true)
    } catch (err) {
      setError(err.message)
      return { success: false, submitError: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    registerInstitutionRequest,
    isLoading,
    submitError,
    submitSuccess,
    setError
  }
}