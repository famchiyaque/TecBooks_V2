import { useState, useCallback } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { professorService } from '@/MxRep/utils/services/professor.service'

export const useGetProfessorGames = () => {
    const { token } = useAuth()
    const [gamesIsLoading, setGamesIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [games, setGames] = useState([])

    const getProfessorGames = useCallback(async (professorId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGamesIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorGames(professorId, token)
            console.log("Response from getProfessorGames: ", response)
            // Normalize _id to id
            const normalizedGames = (response.data || []).map(game => ({
                ...game,
                id: game.id || game._id
            }))
            setGames(normalizedGames)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGamesIsLoading(false)
        }
    }, [token])

    return {
        getProfessorGames,
        gamesIsLoading,
        error,
        games,
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
            const response = await professorService.getGame(gameId, token)
            console.log("Response from getGame: ", response)
            // Normalize _id to id and handle nested objects
            const normalizedGame = {
                ...response.data,
                id: response.data.id || response.data._id,
                // Handle nested groupId
                groupName: typeof response.data.groupId === 'object' ? response.data.groupId.name : null,
                groupId: typeof response.data.groupId === 'object' ? response.data.groupId._id : response.data.groupId,
                // Handle nested classId
                className: typeof response.data.classId === 'object' ? response.data.classId.name : null,
                classId: typeof response.data.classId === 'object' ? response.data.classId._id : response.data.classId,
                // Handle nested institutionId
                institutionName: typeof response.data.institutionId === 'object' ? response.data.institutionId.name : null,
                institutionId: typeof response.data.institutionId === 'object' ? response.data.institutionId._id : response.data.institutionId,
                // Handle nested professorId
                professorName: typeof response.data.professorId === 'object' 
                    ? `${response.data.professorId.firstNames} ${response.data.professorId.lastNames}` 
                    : null,
                professorId: typeof response.data.professorId === 'object' ? response.data.professorId._id : response.data.professorId,
                // Handle nested configurationId
                configurationName: typeof response.data.configurationId === 'object' ? response.data.configurationId.name : null,
                configuration: typeof response.data.configurationId === 'object' ? response.data.configurationId : null,
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

export const useCreateGame = () => {
    const { token } = useAuth()
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createGame = useCallback(async (gameData) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createGame(gameData, token)
            console.log("Response from createGame: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [token])

    return {
        createGame,
        isCreating,
        error,
        setError
    }
}

export const useUpdateGame = () => {
    const { token } = useAuth()
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState(null)

    const updateGame = useCallback(async (gameId, gameData) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsUpdating(true)
        setError(null)

        try {
            const response = await professorService.updateGame(gameId, gameData, token)
            console.log("Response from updateGame: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsUpdating(false)
        }
    }, [token])

    return {
        updateGame,
        isUpdating,
        error,
        setError
    }
}

export const useGameActions = () => {
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const activateGame = useCallback(async (gameId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await professorService.activateGame(gameId, token)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const pauseGame = useCallback(async (gameId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await professorService.pauseGame(gameId, token)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const completeGame = useCallback(async (gameId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await professorService.completeGame(gameId, token)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const deleteGame = useCallback(async (gameId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await professorService.deleteGame(gameId, token)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }, [token])

    return {
        activateGame,
        pauseGame,
        completeGame,
        deleteGame,
        isLoading,
        error,
        setError
    }
}

export const useGetTemplates = () => {
    const { token } = useAuth()
    const [templatesIsLoading, setTemplatesIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [templates, setTemplates] = useState(null)

    const getTemplates = useCallback(async () => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setTemplatesIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getTemplates(token)
            console.log("Response from getTemplates: ", response)
            setTemplates(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setTemplatesIsLoading(false)
        }
    }, [token])

    return {
        getTemplates,
        templatesIsLoading,
        error,
        templates,
        setError
    }
}

export const useGetDefaultConfigs = () => {
    const { token } = useAuth()
    const [configsIsLoading, setConfigsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [defaultConfigs, setDefaultConfigs] = useState(null)

    const getDefaultConfigs = useCallback(async () => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setConfigsIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getDefaultConfigs(token)
            console.log("Response from getDefaultConfigs: ", response)
            setDefaultConfigs(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setConfigsIsLoading(false)
        }
    }, [token])

    return {
        getDefaultConfigs,
        configsIsLoading,
        error,
        defaultConfigs,
        setError
    }
}

export const useGetProfessorClasses = () => {
    const { token } = useAuth()
    const [classesIsLoading, setClassesIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [classes, setClasses] = useState([])

    const getProfessorClasses = useCallback(async (professorId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setClassesIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorClasses(professorId, token)
            console.log("Response from getProfessorClasses: ", response)
            // Normalize _id to id for consistency
            const normalizedClasses = (response.data || []).map(classItem => ({
                ...classItem,
                id: classItem.id || classItem._id
            }))
            setClasses(normalizedClasses)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setClassesIsLoading(false)
        }
    }, [token])

    return {
        getProfessorClasses,
        classesIsLoading,
        error,
        classes,
        setError
    }
}

export const useGetClass = () => {
    const { token } = useAuth()
    const [classIsLoading, setClassIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [classData, setClassData] = useState(null)

    const getClass = useCallback(async (classId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setClassIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getClass(classId, token)
            console.log("Response from getClass: ", response)
            setClassData(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setClassIsLoading(false)
        }
    }, [token])

    const updateClass = useCallback(async (classId, data) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setClassIsLoading(true)
        setError(null)

        try {
            const response = await professorService.updateClass(classId, data, token)
            setClassData(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setClassIsLoading(false)
        }
    }, [token])

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
    const { token } = useAuth()
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createClass = useCallback(async (classData) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createClass(classData, token)
            console.log("Response from createClass: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [token])

    return {
        createClass,
        isCreating,
        error,
        setError
    }
}

export const useGetProfessorGroups = () => {
    const { token } = useAuth()
    const [groupsIsLoading, setGroupsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [groups, setGroups] = useState([])

    const getProfessorGroups = useCallback(async (professorId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGroupsIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorGroups(professorId, token)
            console.log("Response from getProfessorGroups: ", response)
            // Normalize _id to id and handle nested classId object
            const normalizedGroups = (response.data || []).map(group => ({
                ...group,
                id: group.id || group._id,
                classId: typeof group.classId === 'object' ? (group.classId._id || group.classId.id || group.classId) : group.classId,
                className: typeof group.classId === 'object' ? group.classId.name : group.className,
                numStudents: group.members ? group.members.length : group.numStudents || 0
            }))
            console.log("Normalized groups: ", normalizedGroups)
            setGroups(normalizedGroups)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupsIsLoading(false)
        }
    }, [token])

    return {
        getProfessorGroups,
        groupsIsLoading,
        error,
        groups,
        setError
    }
}

export const useGetGroup = () => {
    const { token } = useAuth()
    const [groupIsLoading, setGroupIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [group, setGroup] = useState(null)

    const getGroup = useCallback(async (groupId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGroupIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getGroup(groupId, token)
            console.log("Response from getGroup: ", response)
            // Normalize the group data
            const groupData = response.data || response
            const normalizedGroup = {
                ...groupData,
                id: groupData.id || groupData._id,
                classId: typeof groupData.classId === 'object' ? (groupData.classId._id || groupData.classId.id || groupData.classId) : groupData.classId,
                className: typeof groupData.classId === 'object' ? groupData.classId.name : groupData.className,
                numStudents: groupData.members ? groupData.members.length : groupData.numStudents || 0,
                members: groupData.members || []
            }
            setGroup(normalizedGroup)
            return { success: true, data: normalizedGroup }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupIsLoading(false)
        }
    }, [token])

    const updateGroup = useCallback(async (groupId, data) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGroupIsLoading(true)
        setError(null)

        try {
            const response = await professorService.updateGroup(groupId, data, token)
            console.log("Response from updateGroup: ", response)
            const groupData = response.data || response
            const normalizedGroup = {
                ...groupData,
                id: groupData.id || groupData._id,
                classId: typeof groupData.classId === 'object' ? (groupData.classId._id || groupData.classId.id || groupData.classId) : groupData.classId,
                className: typeof groupData.classId === 'object' ? groupData.classId.name : groupData.className,
                numStudents: groupData.members ? groupData.members.length : groupData.numStudents || 0,
                members: groupData.members || []
            }
            setGroup(normalizedGroup)
            return { success: true, data: normalizedGroup }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupIsLoading(false)
        }
    }, [token])

    const addStudentToGroup = useCallback(async (groupId, studentId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGroupIsLoading(true)
        setError(null)

        try {
            const response = await professorService.addStudentToGroup(groupId, studentId, token)
            console.log("Response from addStudentToGroup: ", response)
            // Refresh group data after adding student
            await getGroup(groupId)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupIsLoading(false)
        }
    }, [token, getGroup])

    const removeStudentFromGroup = useCallback(async (groupId, studentId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGroupIsLoading(true)
        setError(null)

        try {
            const response = await professorService.removeStudentFromGroup(groupId, studentId, token)
            console.log("Response from removeStudentFromGroup: ", response)
            // Refresh group data after removing student
            await getGroup(groupId)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupIsLoading(false)
        }
    }, [token, getGroup])

    const deleteGroup = useCallback(async (groupId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setGroupIsLoading(true)
        setError(null)

        try {
            const response = await professorService.deleteGroup(groupId, token)
            console.log("Response from deleteGroup: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGroupIsLoading(false)
        }
    }, [token])

    return {
        getGroup,
        updateGroup,
        addStudentToGroup,
        removeStudentFromGroup,
        deleteGroup,
        groupIsLoading,
        error,
        group,
        setGroup,
        setError
    }
}

export const useCreateGroup = () => {
    const { token } = useAuth()
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createGroup = useCallback(async (groupData) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createGroup(groupData, token)
            console.log("Response from createGroup: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [token])

    return {
        createGroup,
        isCreating,
        error,
        setError
    }
}

export const useGetInstitutionStudents = () => {
    const { token } = useAuth()
    const [studentsIsLoading, setStudentsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [students, setStudents] = useState([])

    const getInstitutionStudents = useCallback(async (institutionId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setStudentsIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getInstitutionStudents(institutionId, token)
            console.log("Response from getInstitutionStudents: ", response)
            // Normalize _id to id for consistency
            const normalizedStudents = (response.data || []).map(student => ({
                ...student,
                id: student.id || student._id
            }))
            setStudents(normalizedStudents)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setStudentsIsLoading(false)
        }
    }, [token])

    return {
        getInstitutionStudents,
        studentsIsLoading,
        error,
        students,
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

export const useGetTeamsByGame = () => {
    const { token } = useAuth()
    const [teamsIsLoading, setTeamsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [teams, setTeams] = useState([])

    const getTeamsByGame = useCallback(async (gameId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setTeamsIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getTeamsByGame(gameId, token)
            console.log("Response from getTeamsByGame: ", response)
            const normalizedTeams = (response.data || []).map(team => ({
                ...team,
                id: team.id || team._id
            }))
            setTeams(normalizedTeams)
            return { success: true, data: normalizedTeams }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setTeamsIsLoading(false)
        }
    }, [token])

    return {
        getTeamsByGame,
        teamsIsLoading,
        error,
        teams,
        setError
    }
}

export const useGetStudentsByGroup = () => {
    const { token } = useAuth()
    const [studentsIsLoading, setStudentsIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [students, setStudents] = useState([])

    const getStudentsByGroup = useCallback(async (groupId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setStudentsIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getStudentsByGroup(groupId, token)
            console.log("Response from getStudentsByGroup: ", response)
            const normalizedStudents = (response.data || []).map(student => ({
                ...student,
                id: student.id || student._id
            }))
            setStudents(normalizedStudents)
            return { success: true, data: normalizedStudents }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setStudentsIsLoading(false)
        }
    }, [token])

    return {
        getStudentsByGroup,
        studentsIsLoading,
        error,
        students,
        setError
    }
}

export const useCreateTeam = () => {
    const { token } = useAuth()
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createTeam = useCallback(async (teamData) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createTeam(teamData, token)
            console.log("Response from createTeam: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [token])

    return {
        createTeam,
        isCreating,
        error,
        setError
    }
}

export const useTeamManagement = () => {
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const removeStudentFromTeam = useCallback(async (teamId, studentId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await professorService.removeStudentFromTeam(teamId, studentId, token)
            console.log("Response from removeStudentFromTeam: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const addStudentToTeam = useCallback(async (teamId, studentId) => {
        if (!token) {
            setError("No authentication token available")
            return { success: false, error: "No authentication token available" }
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await professorService.addStudentToTeam(teamId, studentId, token)
            console.log("Response from addStudentToTeam: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }, [token])

    return {
        removeStudentFromTeam,
        addStudentToTeam,
        isLoading,
        error,
        setError
    }
}

