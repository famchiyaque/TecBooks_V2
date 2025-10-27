
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
    }
}

