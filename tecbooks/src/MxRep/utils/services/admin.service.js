
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
    }
}