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
    }
}

export default studentService

