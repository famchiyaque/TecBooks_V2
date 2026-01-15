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

    async getProfessor(professorId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/get-professor?professorId=${professorId}`,
            token,
            { method: "GET" }
        )
        return data
    },

    async updateProfessor(professorId, data, token) {
        const response = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/update-professor`,
            token,
            {
                method: "POST",
                body: { professorId, ...data }
            }
        )
        return response
    },

    async toggleProfessorAdminStatus(professorId, token) {
        const response = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/toggle-professor-admin-status`,
            token,
            {
                method: "POST",
                body: { professorId }
            }
        )
        return response
    },

    async getStudent(studentId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/get-student?studentId=${studentId}`,
            token,
            { method: "GET" }
        )
        console.log("Response from getStudent: ", data)
        return data
    },

    async removeStudent(studentId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/remove-student`,
            token,
            {
                method: "DELETE",
                body: { studentId }
            }
        )
        return data
    },

    async inviteProfessor(inviteData, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/admin-panel/invite-professor`,
            token,
            {
                method: "POST",
                body: inviteData
            }
        )
        return data
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