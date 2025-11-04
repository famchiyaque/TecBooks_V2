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

    async getInstitution(institutionId) {
        // Mock data
        const institutions = {
            "inst001": {
                id: "inst001",
                name: "Tecnológico de Monterrey",
                slug: "tec",
                country: "Mexico",
                city: "Monterrey",
                email: "contact@tec.mx",
                domain: "tec.mx",
                status: "active",
                createdAt: "2023-01-15T10:00:00Z",
                paymentStatus: "on-time",
                numUsers: 1250,
                numProfessors: 45,
                numStudents: 1205,
                paymentHistory: [
                    {
                        id: "payment001",
                        amount: 5000,
                        currency: "USD",
                        date: "2024-12-01T00:00:00Z",
                        status: "completed",
                        invoiceId: "INV-2024-12-001"
                    },
                    {
                        id: "payment002",
                        amount: 5000,
                        currency: "USD",
                        date: "2024-11-01T00:00:00Z",
                        status: "completed",
                        invoiceId: "INV-2024-11-001"
                    },
                    {
                        id: "payment003",
                        amount: 5000,
                        currency: "USD",
                        date: "2024-10-01T00:00:00Z",
                        status: "completed",
                        invoiceId: "INV-2024-10-001"
                    },
                    {
                        id: "payment004",
                        amount: 5000,
                        currency: "USD",
                        date: "2024-09-01T00:00:00Z",
                        status: "completed",
                        invoiceId: "INV-2024-09-001"
                    }
                ],
                subscriptionPlan: "Enterprise",
                billingCycle: "monthly"
            }
        }

        return {
            success: true,
            data: institutions[institutionId] || null
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

