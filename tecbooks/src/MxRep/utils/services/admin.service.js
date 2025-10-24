
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const adminService = {
    async getInstitutionProfessors(institutionId) {
        const suffix = `get-institution-professors?institutionId=${institutionId}`
        const response = await fetch(`${API_BASE_URL}/mxrep/admin-panel/${suffix}`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to get institution professors: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
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
    }
}