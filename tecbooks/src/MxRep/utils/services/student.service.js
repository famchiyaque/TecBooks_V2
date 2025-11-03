const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const studentService = {
    async getStudentProfile(userId) {
        // Mock data - combines student user data and institution data
        return {
            success: true,
            data: {
                // Student user data
                user: {
                    id: userId,
                    email: "student@hogwarts.edu",
                    firstNames: "Harry",
                    lastNames: "Potter",
                    role: "student",
                    major: "Defense Against the Dark Arts",
                    studentId: "STU001"
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

    async updateStudentProfile(userId, profileData) {
        // Mock response
        return {
            success: true,
            data: {
                user: {
                    id: userId,
                    email: profileData.email,
                    firstNames: profileData.firstNames,
                    lastNames: profileData.lastNames,
                    role: "student",
                    major: profileData.major || "",
                    studentId: profileData.studentId || ""
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

    async getStudentGames(studentId) {
        return {
            success: true,
            data: [
                {
                    id: "game001",
                    name: "Network Security Simulation",
                    description: "A comprehensive simulation game focusing on network security principles and threat mitigation",
                    status: "active",
                    code: "NS-2025-001",
                    groupId: "group001",
                    professorId: "prof001",
                    configurationId: "config001",
                    createdAt: "2025-01-15T10:00:00Z",
                    startDate: "2025-03-01T00:00:00Z",
                    endDate: "2025-03-15T23:59:59Z",
                    numTeams: 5,
                    numStudents: 20,
                    maxScore: 1000,
                    avgScore: 750.5,
                    run: {
                        id: "run001",
                        status: "in-progress"
                    }
                },
                {
                    id: "game002",
                    name: "Web Application Security",
                    description: "Learn web security vulnerabilities and how to protect applications",
                    status: "active",
                    code: "WAS-2025-001",
                    groupId: "group002",
                    professorId: "prof001",
                    configurationId: "config002",
                    createdAt: "2025-01-20T14:00:00Z",
                    startDate: "2025-02-15T00:00:00Z",
                    endDate: "2025-02-28T23:59:59Z",
                    numTeams: 3,
                    numStudents: 12,
                    maxScore: 1000,
                    avgScore: 820.3
                }
            ]
        }
    },

    async getStudentGame(gameId, studentId) {
        const games = {
            "game001": {
                id: "game001",
                name: "Network Security Simulation",
                description: "A comprehensive simulation game focusing on network security principles and threat mitigation",
                status: "active",
                code: "NS-2025-001",
                groupId: "group001",
                professorId: "prof001",
                configurationId: "config001",
                createdAt: "2025-01-15T10:00:00Z",
                // Game configuration
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
                },
                // Student's team in this game
                team: {
                    id: "team001",
                    name: "Team Alpha",
                    gameId: "game001",
                    studentIds: ["student001", "student002", "student003"],
                    createdAt: "2025-01-16T10:00:00Z",
                    members: [
                        {
                            id: "student001",
                            firstNames: "Harry",
                            lastNames: "Potter",
                            email: "harry.potter@hogwarts.edu"
                        },
                        {
                            id: "student002",
                            firstNames: "Hermione",
                            lastNames: "Granger",
                            email: "hermione.granger@hogwarts.edu"
                        },
                        {
                            id: "student003",
                            firstNames: "Ron",
                            lastNames: "Weasley",
                            email: "ron.weasley@hogwarts.edu"
                        }
                    ]
                },
                // Student's team's run
                run: {
                    id: "run001",
                    teamId: "team001",
                    gameId: "game001",
                    configurationId: "config001",
                    lineIds: ["line001", "line002", "line003"],
                    teamCapital: 50000,
                    status: "in-progress",
                    startedAt: "2025-03-01T09:00:00Z",
                    endedAt: null,
                    lines: [
                        {
                            id: "line001",
                            name: "Production Line 1",
                            throughput: 120,
                            downtime: 5,
                            quality: 0.95
                        },
                        {
                            id: "line002",
                            name: "Production Line 2",
                            throughput: 110,
                            downtime: 8,
                            quality: 0.92
                        },
                        {
                            id: "line003",
                            name: "Production Line 3",
                            throughput: 115,
                            downtime: 6,
                            quality: 0.94
                        }
                    ]
                }
            }
        }

        return {
            success: true,
            data: games[gameId] || null
        }
    },

    async getGroupStudents(groupId, gameId, currentStudentId) {
        // Mock data - returns students in the group with their team status
        // Note: In real implementation, this would filter out the current student
        const allStudents = [
            {
                id: "student004",
                firstNames: "Neville",
                lastNames: "Longbottom",
                email: "neville.longbottom@hogwarts.edu",
                status: "available"
            },
            {
                id: "student005",
                firstNames: "Luna",
                lastNames: "Lovegood",
                email: "luna.lovegood@hogwarts.edu",
                status: "available"
            },
            {
                id: "student006",
                firstNames: "Ginny",
                lastNames: "Weasley",
                email: "ginny.weasley@hogwarts.edu",
                status: "in-team"
            },
            {
                id: "student007",
                firstNames: "Dean",
                lastNames: "Thomas",
                email: "dean.thomas@hogwarts.edu",
                status: "available"
            },
            {
                id: "student008",
                firstNames: "Seamus",
                lastNames: "Finnigan",
                email: "seamus.finnigan@hogwarts.edu",
                status: "in-team"
            }
        ]
        
        // Filter out current student
        const filteredStudents = allStudents.filter(s => s.id !== currentStudentId)
        
        return {
            success: true,
            data: filteredStudents
        }
    },

    async inviteStudentToTeam(teamId, studentId) {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        teamId,
                        studentId,
                        message: "Invitation sent successfully"
                    }
                })
            }, 1000)
        })
    }
}

export default studentService

