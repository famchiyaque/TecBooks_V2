// src/MxRep/hooks/useSignIn.js
import { useState } from 'react'
import { adminService } from '@/MxRep/utils/services/admmin.service'

export const useGetInstitutionProfessors = () => {
    const [professorsIsLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [professors, setProfessors] = useState([])

    const getInstitutionProfessors = async (institutionId) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getInstitutionProfessors(institutionId)

            setProfessors(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        getInstitutionProfessors,
        professorsIsLoading,
        error,
        professors,
        setError
    }
}
