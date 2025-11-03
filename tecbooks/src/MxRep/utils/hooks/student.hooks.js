import { useState, useCallback } from 'react'
import studentService from '../services/student.service'

export const useGetStudentProfile = () => {
    const [profileIsLoading, setProfileIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [profile, setProfile] = useState(null)

    const getStudentProfile = useCallback(async (userId) => {
        setProfileIsLoading(true)
        setError(null)

        try {
            const response = await studentService.getStudentProfile(userId)
            console.log("Response from getStudentProfile: ", response)
            setProfile(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfileIsLoading(false)
        }
    }, [])

    const updateStudentProfile = useCallback(async (userId, profileData) => {
        setProfileIsLoading(true)
        setError(null)

        try {
            const response = await studentService.updateStudentProfile(userId, profileData)
            setProfile(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfileIsLoading(false)
        }
    }, [])

    return {
        getStudentProfile,
        updateStudentProfile,
        profileIsLoading,
        error,
        profile,
        setProfile,
        setError
    }
}

