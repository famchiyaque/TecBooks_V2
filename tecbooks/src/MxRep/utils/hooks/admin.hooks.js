import { useState, useCallback } from 'react'
import { adminService } from '@/MxRep/utils/services/admin.service'

export const useGetInstitutionProfessors = () => {
    const [professorsIsLoading, setProfessorsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [professors, setProfessors] = useState([])

    const getInstitutionProfessors = useCallback(async (institutionId) => {
        setProfessorsIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getInstitutionProfessors(institutionId)
            console.log("Response from getInstitutionProfessors: ", response)
            setProfessors(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfessorsIsLoading(false)
        }
    }, [])

    return {
        getInstitutionProfessors,
        professorsIsLoading,
        error,
        professors,
        setError
    }
}

export const useGetProfessor = () => {
    const [professorIsLoading, setProfessorIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [professor, setProfessor] = useState(null)

    const getProfessor = useCallback(async (professorId) => {
        setProfessorIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getProfessor(professorId)
            console.log("Response from getProfessor: ", response)
            setProfessor(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfessorIsLoading(false)
        }
    }, [])

    const updateProfessor = useCallback(async (professorId, data) => {
        setProfessorIsLoading(true)
        setError(null)

        try {
            const response = await adminService.updateProfessor(professorId, data)
            setProfessor(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfessorIsLoading(false)
        }
    }, [])

    const toggleAdminStatus = useCallback(async (professorId) => {
        setProfessorIsLoading(true)
        setError(null)

        try {
            const response = await adminService.toggleProfessorAdminStatus(professorId)
            setProfessor(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfessorIsLoading(false)
        }
    }, [])

    return {
        getProfessor,
        updateProfessor,
        toggleAdminStatus,
        professorIsLoading,
        error,
        professor,
        setProfessor,
        setError
    }
}

export const useGetInbox = () => {
    const [inboxIsLoading, setInboxIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [inbox, setInbox] = useState([])

    const getInbox = useCallback(async (institutionId) => {
        setInboxIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getInbox(institutionId)
            setInbox(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setInboxIsLoading(false)
        }
    }, [])

    return {
        getInbox,
        inboxIsLoading,
        error,
        inbox,
        setError
    }
}