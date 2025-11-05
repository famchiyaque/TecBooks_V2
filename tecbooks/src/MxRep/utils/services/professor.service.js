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

    async getProfessorGames_OLD_MOCK(professorId) {
        // Mock data
        return {
            success: true,
            data: [
                {
                    id: "game001",
                    name: "Network Security Challenge",
                    description: "A comprehensive network security simulation covering firewall configuration, intrusion detection, and incident response",
                    status: "active",
                    createdAt: "2024-01-15T10:00:00Z",
                    startDate: "2024-02-01T00:00:00Z",
                    endDate: "2024-03-15T23:59:59Z",
                    numTeams: 8,
                    numStudents: 32,
                    numRuns: 12
                },
                {
                    id: "game002",
                    name: "Web Application Security",
                    description: "Hands-on practice with OWASP Top 10 vulnerabilities including SQL injection, XSS, and CSRF attacks",
                    status: "active",
                    createdAt: "2024-01-20T14:30:00Z",
                    startDate: "2024-02-10T00:00:00Z",
                    endDate: "2024-03-20T23:59:59Z",
                    numTeams: 6,
                    numStudents: 24,
                    numRuns: 8
                },
                {
                    id: "game003",
                    name: "Cryptography Fundamentals",
                    description: "Learn encryption algorithms, key management, and secure communication protocols through practical exercises",
                    status: "over",
                    createdAt: "2023-11-01T09:00:00Z",
                    startDate: "2023-12-01T00:00:00Z",
                    endDate: "2024-01-15T23:59:59Z",
                    numTeams: 10,
                    numStudents: 40,
                    numRuns: 15
                },
                {
                    id: "game004",
                    name: "Cloud Security Architecture",
                    description: "Design and implement secure cloud infrastructure with AWS, Azure, and GCP security best practices",
                    status: "active",
                    createdAt: "2024-02-01T11:00:00Z",
                    startDate: "2024-02-15T00:00:00Z",
                    endDate: "2024-04-01T23:59:59Z",
                    numTeams: 5,
                    numStudents: 20,
                    numRuns: 6
                },
                {
                    id: "game005",
                    name: "Penetration Testing Basics",
                    description: "Introduction to ethical hacking, reconnaissance, exploitation, and post-exploitation techniques",
                    status: "over",
                    createdAt: "2023-10-15T08:00:00Z",
                    startDate: "2023-11-01T00:00:00Z",
                    endDate: "2023-12-20T23:59:59Z",
                    numTeams: 7,
                    numStudents: 28,
                    numRuns: 10
                }
            ]
        }
        // const suffix = `get-professor-games?professorId=${professorId}`
        // const response = await fetch(`${API_BASE_URL}/mxrep/professor-panel/${suffix}`, {
        //     method: "GET",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     }
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to get professor games: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
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

    async getClass(classId) {
        const classes = {
            "class001": {
                id: "class001",
                name: "Network Security",
                code: "CS-401",
                createdAt: "2024-01-10T10:00:00Z",
                numGroups: 4,
                description: "Advanced network security concepts and practices"
            }
        }

        return {
            success: true,
            data: classes[classId] || null
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

    async updateClass(classId, classData) {
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
    }
}

