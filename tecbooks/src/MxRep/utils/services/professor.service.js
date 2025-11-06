import fetchWithAuth from '@/MxRep/utils/apis/api.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const professorService = {
    async getProfessorGames(professorId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-my-games`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getGame(gameId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-game?gameId=${gameId}`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async createGame(gameData, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/create-game`,
            token,
            {
                method: "POST",
                body: JSON.stringify(gameData)
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async updateGame(gameId, gameData, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/update-game`,
            token,
            {
                method: "POST",
                body: JSON.stringify({ gameId, ...gameData })
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async activateGame(gameId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/activate-game`,
            token,
            {
                method: "POST",
                body: JSON.stringify({ gameId })
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async pauseGame(gameId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/pause-game`,
            token,
            {
                method: "POST",
                body: JSON.stringify({ gameId })
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async completeGame(gameId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/complete-game`,
            token,
            {
                method: "POST",
                body: JSON.stringify({ gameId })
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async deleteGame(gameId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/delete-game`,
            token,
            {
                method: "POST",
                body: JSON.stringify({ gameId })
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getTemplates(token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/templates`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getDefaultConfigs(token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/default-configs`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getProfessorClasses(professorId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-my-classes`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getClass(classId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-class?classId=${classId}`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async createClass(classData, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/create-class`,
            token,
            {
                method: "POST",
                body: {
                    name: classData.name,
                    code: classData.code,
                    ...(classData.description && { description: classData.description })
                }
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async updateClass(classId, classData, token) {
        return {
            success: true,
            data: {
                id: classId,
                ...classData
            }
        }
    },

    async getProfessorGroups(professorId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-my-groups`,
            token,
            { method: "GET" }
        )
        console.log("[PROFESSOR SERVICE] Raw response from get-my-groups: ", data)
        // Handle both array response and wrapped response
        const groupsArray = Array.isArray(data) ? data : (data.data || [])
        console.log("[PROFESSOR SERVICE] Extracted groups array: ", groupsArray)
        return {
            success: true,
            data: groupsArray
        }
    },

    async getGroup(groupId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-group?groupId=${groupId}`,
            token,
            { method: "GET" }
        )
        console.log("[PROFESSOR SERVICE] Raw response from get-group: ", data)
        return {
            success: true,
            data: data.data || data
        }
    },

    async createGroup(groupData, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/create-group`,
            token,
            {
                method: "POST",
                body: {
                    classId: groupData.classId,
                    name: groupData.name,
                    code: groupData.code,
                    ...(groupData.description && { description: groupData.description })
                }
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async updateGroup(groupId, groupData, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/update-group`,
            token,
            {
                method: "POST",
                body: {
                    groupId,
                    ...groupData
                }
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async addStudentToGroup(groupId, studentId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/group/add-student`,
            token,
            {
                method: "POST",
                body: {
                    groupId,
                    studentId
                }
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async removeStudentFromGroup(groupId, studentId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/group/remove-student`,
            token,
            {
                method: "POST",
                body: {
                    groupId,
                    studentId
                }
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async deleteGroup(groupId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/delete-group`,
            token,
            {
                method: "POST",
                body: {
                    groupId
                }
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getInstitutionStudents(institutionId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-institution-students?institutionId=${institutionId}`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getProfessorProfile(userId) {
        // Mock data - combines professor user data and institution data
        return {
            success: true,
            data: {
                // Professor user data
                user: {
                    id: userId,
                    email: "professor@hogwarts.edu",
                    firstNames: "Severus",
                    lastNames: "Snape",
                    role: "professor",
                    department: "Potions"
                },
                // Institution data
                institution: {
                    institutionId: "inst123",
                    name: "Hogwarts",
                    domain: "hogwarts.edu",
                    slug: "hogwarts",
                    country: "United Kingdom",
                    city: "Scottish Highlands",
                    phoneNumber: "+44 1234 567890",
                    contactEmail: "contact@hogwarts.edu"
                }
            }
        }
    },

    async updateProfessorProfile(userId, profileData) {
        // Mock response
        return {
            success: true,
            data: {
                user: {
                    id: userId,
                    email: profileData.email,
                    firstNames: profileData.firstNames,
                    lastNames: profileData.lastNames,
                    role: "professor",
                    department: profileData.department || ""
                },
                institution: {
                    institutionId: profileData.institutionId,
                    name: profileData.institutionName,
                    domain: profileData.domain,
                    slug: profileData.slug,
                    country: profileData.country,
                    city: profileData.city,
                    phoneNumber: profileData.phoneNumber,
                    contactEmail: profileData.contactEmail
                }
            }
        }
    },


    async getTeamsByGame(gameId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-teams-by-game?gameId=${gameId}`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getStudentsByGroup(groupId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/get-students-by-group?groupId=${groupId}`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async createTeam(teamData, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/create-team`,
            token,
            {
                method: "POST",
                body: JSON.stringify(teamData)
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async removeStudentFromTeam(teamId, studentId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/team/remove-student`,
            token,
            {
                method: "POST",
                body: JSON.stringify({ teamId, studentId })
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async addStudentToTeam(teamId, studentId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/professor-panel/team/add-student`,
            token,
            {
                method: "POST",
                body: JSON.stringify({ teamId, studentId })
            }
        )
        return {
            success: true,
            data: data.data || data
        }
    }
}

