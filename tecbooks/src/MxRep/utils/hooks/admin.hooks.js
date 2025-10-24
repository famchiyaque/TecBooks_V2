import { useState } from 'react'
import { adminService } from '@/MxRep/utils/services/admin.service'

export const useGetInstitutionProfessors = () => {
    const [professorsIsLoading, setProfessorsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [professors, setProfessors] = useState([])

    const getInstitutionProfessors = async (institutionId) => {
        setProfessorsIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getInstitutionProfessors(institutionId)

            setProfessors(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfessorsIsLoading(false)
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

export const useGetInbox = () => {
    const [inboxIsLoading, setInboxIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [inbox, setInbox] = useState([])

    const getInbox = async (institutionId) => {
        setInboxIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getInstitutionProfessors(institutionId)

            setInbox(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setInboxIsLoading(false)
        }
    }

    return {
        getInbox,
        inboxIsLoading,
        error,
        inbox,
        setError
    }
}