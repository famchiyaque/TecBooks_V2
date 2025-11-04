import { useState, useCallback } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { superAdminService } from '@/MxRep/utils/services/superadmin.service'

export const useGetAllInstitutions = () => {
    const { token } = useAuth()
    const [institutionsIsLoading, setInstitutionsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [institutions, setInstitutions] = useState([])

    const getAllInstitutions = useCallback(async () => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setInstitutionsIsLoading(true)
        setError(null)

        try {
            const response = await superAdminService.getAllInstitutions(token)
            console.log("Response from getAllInstitutions: ", response)
            const institutions = (response.data || []).map(inst => ({
                ...inst,
                id: inst.id || inst._id
            }))
            setInstitutions(institutions)
            return { success: true, data: institutions }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setInstitutionsIsLoading(false)
        }
    }, [token])

    return {
        getAllInstitutions,
        institutionsIsLoading,
        error,
        institutions,
        setError
    }
}

export const useGetInstitution = () => {
    const [institutionIsLoading, setInstitutionIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [institution, setInstitution] = useState(null)

    const getInstitution = useCallback(async (institutionId) => {
        setInstitutionIsLoading(true)
        setError(null)

        try {
            const response = await superAdminService.getInstitution(institutionId)
            console.log("Response from getInstitution: ", response)
            setInstitution(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setInstitutionIsLoading(false)
        }
    }, [])

    return {
        getInstitution,
        institutionIsLoading,
        error,
        institution,
        setInstitution,
        setError
    }
}

export const useToggleInstitutionStatus = () => {
    const [isToggling, setIsToggling] = useState(false)
    const [error, setError] = useState(null)

    const toggleInstitutionStatus = useCallback(async (institutionId) => {
        setIsToggling(true)
        setError(null)

        try {
            const response = await superAdminService.toggleInstitutionStatus(institutionId)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsToggling(false)
        }
    }, [])

    return {
        toggleInstitutionStatus,
        isToggling,
        error,
        setError
    }
}

