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

export const useGetInstitutionStudents = () => {
    const [studentsIsLoading, setStudentsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [students, setStudents] = useState([])

    const getInstitutionStudents = useCallback(async (institutionId) => {
        setStudentsIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getInstitutionStudents(institutionId)
            console.log("Response from getInstitutionStudents: ", response)
            setStudents(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setStudentsIsLoading(false)
        }
    }, [])

    return {
        getInstitutionStudents,
        studentsIsLoading,
        error,
        students,
        setError
    }
}

export const useGetStudent = () => {
    const [studentIsLoading, setStudentIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [student, setStudent] = useState(null)

    const getStudent = useCallback(async (studentId) => {
        setStudentIsLoading(true)
        setError(null)

        try {
            const response = await adminService.getStudent(studentId)
            console.log("Response from getStudent: ", response)
            setStudent(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setStudentIsLoading(false)
        }
    }, [])

    const removeStudent = useCallback(async (studentId) => {
        setStudentIsLoading(true)
        setError(null)

        try {
            const response = await adminService.removeStudent(studentId)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setStudentIsLoading(false)
        }
    }, [])

    return {
        getStudent,
        removeStudent,
        studentIsLoading,
        error,
        student,
        setStudent,
        setError
    }
}