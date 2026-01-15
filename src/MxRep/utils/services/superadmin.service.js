import fetchWithAuth from '@/MxRep/utils/apis/api.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const superAdminService = {
    async getAllInstitutions(token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/super-admin-panel/get-all-institutions`,
            token,
            { method: "GET" }
        )
        return {
            success: true,
            data: data.data || data
        }
    },

    async getInstitution(institutionId, token) {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/mxrep/super-admin-panel/get-institution-by-id?institutionId=${institutionId}`,
            token,
            { method: "GET" }
        )
        
        const institution = data.data || data
        
        // Add mock payment data for now
        const institutionWithPayment = {
            ...institution,
            id: institution.id || institution._id,
            paymentStatus: institution.paymentStatus || "on-time",
            subscriptionPlan: institution.subscriptionPlan || "Enterprise",
            billingCycle: institution.billingCycle || "monthly",
            paymentHistory: institution.paymentHistory || [
                {
                    id: "payment001",
                    amount: 5000,
                    currency: "USD",
                    date: new Date().toISOString(),
                    status: "completed",
                    invoiceId: `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-001`
                }
            ]
        }
        
        return {
            success: true,
            data: institutionWithPayment
        }
    },

    async toggleInstitutionStatus(institutionId) {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        institutionId,
                        message: "Institution status updated successfully"
                    }
                })
            }, 1000)
        })
    }
}

export default superAdminService

