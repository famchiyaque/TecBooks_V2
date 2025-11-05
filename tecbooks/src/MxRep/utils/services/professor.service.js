import fetchWithAuth from '@/MxRep/utils/apis/api.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const professorService = {
    async getProfessorGames(professorId) {
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

    async getGame(gameId) {
        // Mock data
        const games = {
            "game001": {
                id: "game001",
                name: "Network Security Challenge",
                description: "A comprehensive network security simulation covering firewall configuration, intrusion detection, and incident response",
                status: "active",
                code: "NS-2025-001",
                groupId: "group001",
                groupName: "Spring 2025 - Group A",
                classId: "class001",
                className: "Network Security Fundamentals",
                createdAt: "2024-01-15T10:00:00Z",
                startDate: "2024-02-01T00:00:00Z",
                endDate: "2024-03-15T23:59:59Z",
                numTeams: 8,
                numStudents: 32,
                numRuns: 12,
                configuration: {
                    premises: {
                        name: "Factory A",
                        area: 5000,
                        rentCost: 5000,
                        powerCapacity: 1000,
                        inflationRate: 0.03,
                        lendingRate: 0.05
                    },
                    orderConfig: {
                        productType: "Widgets",
                        initialOrders: 1000,
                        demandRate: {
                            "Month 1": 0.15,
                            "Month 2": 0.18,
                            "Month 3": 0.20,
                            "Month 4": 0.17,
                            "Month 5": 0.15,
                            "Month 6": 0.15
                        }
                    },
                    machinery: [
                        { name: "Assembly Line Machine A" },
                        { name: "Quality Control Scanner B" },
                        { name: "Packaging Unit C" }
                    ],
                    boms: [
                        { productName: "Standard Widget", materialCost: 10 },
                        { productName: "Premium Widget", materialCost: 15 }
                    ],
                    employees: [
                        { name: "John Doe", jobTitle: "Production Manager", salary: 5000 },
                        { name: "Jane Smith", jobTitle: "Quality Inspector", salary: 3500 }
                    ],
                    expenses: [
                        { name: "Utilities", cost: 500 },
                        { name: "Marketing", cost: 1000 }
                    ]
                }
            }
        }

        return {
            success: true,
            data: games[gameId] || null
        }
        // const suffix = `get-game?gameId=${gameId}`
        // const response = await fetch(`${API_BASE_URL}/mxrep/professor-panel/${suffix}`, {
        //     method: "GET",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     }
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to get game: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
    },

    async createGame(gameData) {
        return {
            success: true,
            data: {
                id: "game" + Date.now(),
                ...gameData,
                createdAt: new Date().toISOString(),
                status: "active"
            }
        }
        // const suffix = `create-game`
        // const response = await fetch(`${API_BASE_URL}/mxrep/professor-panel/${suffix}`, {
        //     method: "POST",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(gameData)
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to create game: ${response.status} ${response.statusText}`)
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

    async getGroup(groupId) {
        const groups = {
            "group001": {
                id: "group001",
                groupCode: "NS-G1",
                className: "Network Security",
                classId: "class001",
                semester: "Feb-Jun-2025",
                subperiod: "1-2",
                status: "current",
                numStudents: 28,
                createdAt: "2025-02-01T10:00:00Z"
            }
        }

        return {
            success: true,
            data: groups[groupId] || null
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

    async updateGroup(groupId, groupData) {
        return {
            success: true,
            data: {
                id: groupId,
                ...groupData
            }
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

