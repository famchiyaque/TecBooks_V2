import { useState, useCallback } from 'react'
import { professorService } from '@/MxRep/utils/services/professor.service'

export const useGetProfessorGames = () => {
    const [gamesIsLoading, setGamesIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [games, setGames] = useState([])

    const getProfessorGames = useCallback(async (professorId) => {
        setGamesIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorGames(professorId)
            console.log("Response from getProfessorGames: ", response)
            setGames(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGamesIsLoading(false)
        }
    }, [])

    return {
        getProfessorGames,
        gamesIsLoading,
        error,
        games,
        setError
    }
}

export const useGetGame = () => {
    const [gameIsLoading, setGameIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [game, setGame] = useState(null)

    const getGame = useCallback(async (gameId) => {
        setGameIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getGame(gameId)
            console.log("Response from getGame: ", response)
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
        getGame,
        gameIsLoading,
        error,
        game,
        setGame,
        setError
    }
}

export const useCreateGame = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createGame = useCallback(async (gameData) => {
        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createGame(gameData)
            console.log("Response from createGame: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [])

    return {
        createGame,
        isCreating,
        error,
        setError
    }
}

export const useGetProfessorClasses = () => {
    const [classesIsLoading, setClassesIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [classes, setClasses] = useState([])

    const getProfessorClasses = useCallback(async (professorId) => {
        setClassesIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorClasses(professorId)
            console.log("Response from getProfessorClasses: ", response)
            setClasses(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setClassesIsLoading(false)
        }
    }, [])

    return {
        getProfessorClasses,
        classesIsLoading,
        error,
        classes,
        setError
    }
}

export const useGetClass = () => {
    const [classIsLoading, setClassIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [classData, setClassData] = useState(null)

    const getClass = useCallback(async (classId) => {
        setClassIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getClass(classId)
            console.log("Response from getClass: ", response)
            setClassData(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setClassIsLoading(false)
        }
    }, [])

    const updateClass = useCallback(async (classId, data) => {
        setClassIsLoading(true)
        setError(null)

        try {
            const response = await professorService.updateClass(classId, data)
            setClassData(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setClassIsLoading(false)
        }
    }, [])

    return {
        getClass,
        updateClass,
        classIsLoading,
        error,
        classData,
        setClassData,
        setError
    }
}

export const useCreateClass = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createClass = useCallback(async (classData) => {
        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createClass(classData)
            console.log("Response from createClass: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [])

    return {
        createClass,
        isCreating,
        error,
        setError
    }
}

export const useGetProfessorGroups = () => {
    const [groupsIsLoading, setGroupsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [groups, setGroups] = useState([])

    const getProfessorGroups = useCallback(async (professorId) => {
        setGroupsIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorGroups(professorId)
            console.log("Response from getProfessorGroups: ", response)
            setGroups(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupsIsLoading(false)
        }
    }, [])

    return {
        getProfessorGroups,
        groupsIsLoading,
        error,
        groups,
        setError
    }
}

export const useGetGroup = () => {
    const [groupIsLoading, setGroupIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [group, setGroup] = useState(null)

    const getGroup = useCallback(async (groupId) => {
        setGroupIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getGroup(groupId)
            console.log("Response from getGroup: ", response)
            setGroup(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupIsLoading(false)
        }
    }, [])

    const updateGroup = useCallback(async (groupId, data) => {
        setGroupIsLoading(true)
        setError(null)

        try {
            const response = await professorService.updateGroup(groupId, data)
            setGroup(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupIsLoading(false)
        }
    }, [])

    return {
        getGroup,
        updateGroup,
        groupIsLoading,
        error,
        group,
        setGroup,
        setError
    }
}

export const useCreateGroup = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createGroup = useCallback(async (groupData) => {
        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createGroup(groupData)
            console.log("Response from createGroup: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [])

    return {
        createGroup,
        isCreating,
        error,
        setError
    }
}

export const useGetProfessorProfile = () => {
    const [profileIsLoading, setProfileIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [profile, setProfile] = useState(null)

    const getProfessorProfile = useCallback(async (userId) => {
        setProfileIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorProfile(userId)
            console.log("Response from getProfessorProfile: ", response)
            setProfile(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setProfileIsLoading(false)
        }
    }, [])

    const updateProfessorProfile = useCallback(async (userId, profileData) => {
        setProfileIsLoading(true)
        setError(null)

        try {
            const response = await professorService.updateProfessorProfile(userId, profileData)
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
        getProfessorProfile,
        updateProfessorProfile,
        profileIsLoading,
        error,
        profile,
        setProfile,
        setError
    }
}

