
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
                    maxScore: 1000,
                    avgScore: 745.5
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
                    maxScore: 800,
                    avgScore: 612.3
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
                    maxScore: 1200,
                    avgScore: 892.7
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
                    maxScore: 900,
                    avgScore: 523.1
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
                    maxScore: 1000,
                    avgScore: 781.4
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
                createdAt: "2024-01-15T10:00:00Z",
                startDate: "2024-02-01T00:00:00Z",
                endDate: "2024-03-15T23:59:59Z",
                numTeams: 8,
                numStudents: 32,
                maxScore: 1000,
                avgScore: 745.5,
                configurations: {
                    difficulty: "intermediate",
                    timeLimit: 120,
                    allowHints: true,
                    teamSize: 4
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

    async getProfessorClasses(professorId) {
        return {
            success: true,
            data: [
                {
                    id: "class001",
                    name: "Network Security",
                    code: "CS-401",
                    createdAt: "2024-01-10T10:00:00Z",
                    numGroups: 4,
                    description: "Advanced network security concepts and practices"
                },
                {
                    id: "class002",
                    name: "Web Application Security",
                    code: "CS-402",
                    createdAt: "2024-01-15T14:00:00Z",
                    numGroups: 3,
                    description: "Security vulnerabilities in web applications"
                },
                {
                    id: "class003",
                    name: "Cryptography",
                    code: "CS-403",
                    createdAt: "2023-08-20T09:00:00Z",
                    numGroups: 2,
                    description: "Mathematical foundations of cryptography"
                }
            ]
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

    async createClass(classData) {
        return {
            success: true,
            data: {
                id: "class" + Date.now(),
                ...classData,
                createdAt: new Date().toISOString(),
                numGroups: 0
            }
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

    async getProfessorGroups(professorId) {
        return {
            success: true,
            data: [
                {
                    id: "group001",
                    groupCode: "NS-G1",
                    className: "Network Security",
                    classId: "class001",
                    semester: "Feb-Jun-2025",
                    subperiod: "1-2",
                    status: "current",
                    numStudents: 28,
                    createdAt: "2025-02-01T10:00:00Z"
                },
                {
                    id: "group002",
                    groupCode: "NS-G2",
                    className: "Network Security",
                    classId: "class001",
                    semester: "Feb-Jun-2025",
                    subperiod: "2-3",
                    status: "current",
                    numStudents: 25,
                    createdAt: "2025-02-01T10:00:00Z"
                },
                {
                    id: "group003",
                    groupCode: "WAS-G1",
                    className: "Web Application Security",
                    classId: "class002",
                    semester: "Feb-Jun-2025",
                    subperiod: "1",
                    status: "current",
                    numStudents: 30,
                    createdAt: "2025-02-01T10:00:00Z"
                },
                {
                    id: "group004",
                    groupCode: "NS-G1",
                    className: "Network Security",
                    classId: "class001",
                    semester: "Aug-Dec-2024",
                    subperiod: "1-2",
                    status: "past",
                    numStudents: 32,
                    createdAt: "2024-08-01T10:00:00Z"
                },
                {
                    id: "group005",
                    groupCode: "CRYPT-G1",
                    className: "Cryptography",
                    classId: "class003",
                    semester: "Aug-Dec-2024",
                    subperiod: "2",
                    status: "past",
                    numStudents: 24,
                    createdAt: "2024-08-01T10:00:00Z"
                }
            ]
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

    async createGroup(groupData) {
        return {
            success: true,
            data: {
                id: "group" + Date.now(),
                ...groupData,
                createdAt: new Date().toISOString(),
                numStudents: 0,
                status: "current"
            }
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

