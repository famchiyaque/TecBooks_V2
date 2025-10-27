
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const adminService = {
    async getInstitutionProfessors(institutionId) {
        return {
            success: true,
            data: [
                {
                    id: "professor123",
                    email: "ohernandez@tec.mx",
                    firstNames: "Oscar Ian",
                    lastNames: "Perez Hernandez",
                    department: "Security",
                    numClasses: 3,
                    numGroups: 6,
                    numGames: 12,
                    role: "professor",
                    isAdmin: true
                },
                {
                    id: "professor456",
                    email: "lizbethe@tec.mx",
                    firstNames: "Lisbethe Sona",
                    lastNames: "De la Rosa",
                    department: "Networking",
                    numClasses: 3,
                    numGroups: 6,
                    numGames: 12,
                    role: "professor",
                    isAdmin: false
                },
                {
                    id: "professor789",
                    email: "alexvilch@tec.mx",
                    firstNames: "Alex Alejandro",
                    lastNames: "Vilches",
                    department: "Mobile Apps",
                    numClasses: 5,
                    numGroups: 8,
                    numGames: 20,
                    role: "professor",
                    isAdmin: true
                },
            ]
        }
        // const suffix = `get-institution-professors?institutionId=${institutionId}`
        // const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
        //     method: "GET",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     }
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to get institution professors: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
    }, 
  
    async getInbox(institutionId) {
        const suffix = `get-institution-inbox?institutionId=${institutionId}`
        const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to get institution inbox: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        return data
    },

    async getInstitutionStudents(institutionId) {
        return {
            success: true,
            data: [
                {
                    id: "student001",
                    email: "maria.garcia@tec.mx",
                    firstNames: "Maria Elena",
                    lastNames: "Garcia Rodriguez",
                    studentId: "A01234567",
                    major: "Computer Science",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 15,
                    avgScore: 85.5,
                    status: "active"
                },
                {
                    id: "student002",
                    email: "carlos.lopez@tec.mx",
                    firstNames: "Carlos Alberto",
                    lastNames: "Lopez Martinez",
                    studentId: "A01234568",
                    major: "Software Engineering",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 22,
                    avgScore: 92.3,
                    status: "active"
                },
                {
                    id: "student003",
                    email: "ana.hernandez@tec.mx",
                    firstNames: "Ana Sofia",
                    lastNames: "Hernandez Diaz",
                    studentId: "A01234569",
                    major: "Computer Science",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 18,
                    avgScore: 88.7,
                    status: "active"
                },
                {
                    id: "student004",
                    email: "juan.martinez@tec.mx",
                    firstNames: "Juan Carlos",
                    lastNames: "Martinez Sanchez",
                    studentId: "A01234570",
                    major: "Information Technology",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 12,
                    avgScore: 78.2,
                    status: "active"
                },
                {
                    id: "student005",
                    email: "laura.rodriguez@tec.mx",
                    firstNames: "Laura Patricia",
                    lastNames: "Rodriguez Gomez",
                    studentId: "A01234571",
                    major: "Computer Science",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 25,
                    avgScore: 94.1,
                    status: "active"
                },
                {
                    id: "student006",
                    email: "diego.fernandez@tec.mx",
                    firstNames: "Diego Alejandro",
                    lastNames: "Fernandez Torres",
                    studentId: "A01234572",
                    major: "Software Engineering",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 8,
                    avgScore: 72.5,
                    status: "active"
                },
                {
                    id: "student007",
                    email: "sofia.ramirez@tec.mx",
                    firstNames: "Sofia Isabella",
                    lastNames: "Ramirez Castro",
                    studentId: "A01234573",
                    major: "Computer Science",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 20,
                    avgScore: 90.8,
                    status: "active"
                },
                {
                    id: "student008",
                    email: "miguel.torres@tec.mx",
                    firstNames: "Miguel Angel",
                    lastNames: "Torres Ruiz",
                    studentId: "A01234574",
                    major: "Information Technology",
                    enrollmentDate: "2023-08-15",
                    numGamesPlayed: 14,
                    avgScore: 81.3,
                    status: "active"
                }
            ]
        }
        // const suffix = `get-institution-students?institutionId=${institutionId}`
        // const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
        //     method: "GET",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     }
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to get institution students: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
    },

    async getStudent(studentId) {
        // Mock data - in real implementation, fetch from backend
        const students = {
            "student001": {
                id: "student001",
                email: "maria.garcia@tec.mx",
                firstNames: "Maria Elena",
                lastNames: "Garcia Rodriguez",
                studentId: "A01234567",
                major: "Computer Science",
                enrollmentDate: "2023-08-15",
                numGamesPlayed: 15,
                avgScore: 85.5,
                status: "active"
            },
            "student002": {
                id: "student002",
                email: "carlos.lopez@tec.mx",
                firstNames: "Carlos Alberto",
                lastNames: "Lopez Martinez",
                studentId: "A01234568",
                major: "Software Engineering",
                enrollmentDate: "2023-08-15",
                numGamesPlayed: 22,
                avgScore: 92.3,
                status: "active"
            }
        }

        return {
            success: true,
            data: students[studentId] || null
        }
        // const suffix = `get-student?studentId=${studentId}`
        // const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
        //     method: "GET",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     }
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to get student: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
    },

    async removeStudent(studentId) {
        return {
            success: true,
            message: "Student removed successfully"
        }
        // const suffix = `remove-student`
        // const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
        //     method: "DELETE",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ studentId })
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to remove student: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
    }
}