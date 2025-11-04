import fetchWithAuth from '@/MxRep/utils/apis/api.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const adminService = {
    async getInstitutionProfessors(institutionId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/get-institution-professors?institutionId=${institutionId}`,
            token,
            { method: "GET" }
        )
        return data
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

    async getInstitutionStudents(institutionId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/get-institution-students?institutionId=${institutionId}`,
            token,
            { method: "GET" }
        )
        return data
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
    },

    async getAdminProfile(userId) {
        // Mock data - combines admin user data and institution data
        return {
            success: true,
            data: {
                // Admin user data
                user: {
                    id: userId,
                    email: "admin@hogwarts.edu",
                    firstNames: "Albus",
                    lastNames: "Dumbledore",
                    role: "admin"
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
        // const suffix = `get-admin-profile?userId=${userId}`
        // const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
        //     method: "GET",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     }
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to get admin profile: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
    },

    async updateAdminProfile(userId, profileData) {
        // Mock response
        return {
            success: true,
            data: {
                user: {
                    id: userId,
                    email: profileData.email,
                    firstNames: profileData.firstNames,
                    lastNames: profileData.lastNames,
                    role: "admin"
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
        // const suffix = `update-admin-profile`
        // const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
        //     method: "PUT",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ userId, ...profileData })
        // })

        // if (!response.ok) {
        //     throw new Error(`Failed to update admin profile: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        // return data
    }
}