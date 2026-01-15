import { useState, useCallback } from 'react'
import studentService from '@/MxRep/utils/services/student.service'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'

export const useGetStudentProfile = () => {
    const [profileIsLoading, setProfileIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [profile, setProfile] = useState(null)

    const getStudentProfile = useCallback(async (userId) => {
        setProfileIsLoading(true)
        setError(null)

        try {
            const response = await studentService.getStudentProfile(userId)
            setProfile(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfileIsLoading(false)
        }
    }, [])

    const updateProfile = useCallback(async (userId, profileData) => {
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
        updateProfile,
        profileIsLoading,
        error,
        profile,
        setProfile,
        setError
    }
}

export const useGetStudentGames = () => {
    const { token } = useAuth()
    const [gamesIsLoading, setGamesIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [games, setGames] = useState([])

    const getStudentGames = useCallback(async (studentId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGamesIsLoading(true)
        setError(null)

        try {
            const response = await studentService.getStudentGames(studentId, token)
            console.log("Response from getStudentGames: ", response)
            // Normalize _id to id
            const normalizedGames = (response.data || []).map(game => ({
                ...game,
                id: game.id || game._id
            }))
            setGames(normalizedGames)
            return { success: true, data: normalizedGames }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGamesIsLoading(false)
        }
    }, [token])

    return {
        getStudentGames,
        gamesIsLoading,
        error,
        games,
        setError
    }
}

export const useGetGameDetails = () => {
    const [gameIsLoading, setGameIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [game, setGame] = useState(null)

    const getGameDetails = useCallback(async (gameId) => {
        setGameIsLoading(true)
        setError(null)

        try {
            const response = await studentService.getStudentGame(gameId)
            setGame(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGameIsLoading(false)
        }
    }, [])

    return {
        getGameDetails,
        gameIsLoading,
        error,
        game,
        setGame,
        setError
    }
}

export const useGetGroupStudents = () => {
    const [studentsIsLoading, setStudentsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [students, setStudents] = useState([])

    const getGroupStudents = useCallback(async (groupId, gameId, currentUserId) => {
        setStudentsIsLoading(true)
        setError(null)

        try {
            const response = await studentService.getGroupStudents(groupId, gameId, currentUserId)
            setStudents(response.data || [])
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setStudentsIsLoading(false)
        }
    }, [])

    return {
        getGroupStudents,
        studentsIsLoading,
        error,
        students,
        setError
    }
}

export const useInviteStudent = () => {
    const [isInviting, setIsInviting] = useState(false)
    const [error, setError] = useState(null)

    const inviteStudent = useCallback(async (teamId, studentId) => {
        setIsInviting(true)
        setError(null)

        try {
            const response = await studentService.inviteStudentToTeam(teamId, studentId)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsInviting(false)
        }
    }, [])

    return {
        inviteStudent,
        isInviting,
        error,
        setError
    }
}

export const useGetGame = () => {
    const { token } = useAuth()
    const [gameIsLoading, setGameIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [game, setGame] = useState(null)

    const getGame = useCallback(async (gameId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGameIsLoading(true)
        setError(null)

        try {
            const response = await studentService.getGame(gameId, token)
            console.log("Response from getGame: ", response)
            // Normalize _id to id for game and nested objects
            const normalizedGame = {
                ...response.data,
                id: response.data.id || response.data._id,
                teams: (response.data.teams || []).map(team => ({
                    ...team,
                    id: team.id || team._id,
                    members: (team.members || []).map(member => ({
                        ...member,
                        id: member.id || member._id
                    }))
                }))
            }
            setGame(normalizedGame)
            return { success: true, data: normalizedGame }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGameIsLoading(false)
        }
    }, [token])

    return {
        getGame,
        gameIsLoading,
        error,
        game,
        setGame,
        setError
    }
}

export const useGetTeamRuns = () => {
    const { token } = useAuth()
    const [runsIsLoading, setRunsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [runs, setRuns] = useState([])

    const getTeamRuns = useCallback(async (gameId, teamId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setRunsIsLoading(true)
        setError(null)

        try {
            const response = await studentService.getTeamRuns(gameId, teamId, token)
            console.log("Response from getTeamRuns: ", response)
            // Normalize _id to id
            const normalizedRuns = (response.data || []).map(run => ({
                ...run,
                id: run.id || run._id
            }))
            setRuns(normalizedRuns)
            return { success: true, data: normalizedRuns }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setRunsIsLoading(false)
        }
    }, [token])

    return {
        getTeamRuns,
        runsIsLoading,
        error,
        runs,
        setRuns,
        setError
    }
}

export const useCreateRun = () => {
    const { token } = useAuth()
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createRun = useCallback(async (gameId, teamId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsCreating(true)
        setError(null)

        try {
            const response = await studentService.createRun(gameId, teamId, token)
            setIsCreating(false)
            return { success: true, data: response.data }
        } catch (err) {
            const errorMessage = err.message || "Failed to create run"
            setError(errorMessage)
            setIsCreating(false)
            return { success: false, error: errorMessage }
        }
    }, [token])

    return { createRun, isCreating, error }
}
