const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const superAdminService = {
    async getAllInstitutions() {
        // Mock data
        return {
            success: true,
            data: [
                {
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
                    lastPaymentDate: "2024-12-01T00:00:00Z",
                    nextPaymentDate: "2025-01-01T00:00:00Z",
                    numUsers: 1250,
                    numProfessors: 45,
                    numStudents: 1205
                },
                {
                    id: "inst002",
                    name: "Harvard University",
                    slug: "harvard",
                    country: "United States",
                    city: "Cambridge",
                    email: "contact@harvard.edu",
                    domain: "harvard.edu",
                    status: "active",
                    createdAt: "2023-03-20T14:30:00Z",
                    paymentStatus: "overdue",
                    lastPaymentDate: "2024-10-15T00:00:00Z",
                    nextPaymentDate: "2024-11-15T00:00:00Z",
                    numUsers: 850,
                    numProfessors: 32,
                    numStudents: 818
                },
                {
                    id: "inst003",
                    name: "Stanford University",
                    slug: "stanford",
                    country: "United States",
                    city: "Stanford",
                    email: "contact@stanford.edu",
                    domain: "stanford.edu",
                    status: "inactive",
                    createdAt: "2023-05-10T09:00:00Z",
                    paymentStatus: "on-time",
                    lastPaymentDate: "2024-11-01T00:00:00Z",
                    nextPaymentDate: "2024-12-01T00:00:00Z",
                    numUsers: 650,
                    numProfessors: 28,
                    numStudents: 622
                },
                {
                    id: "inst004",
                    name: "MIT",
                    slug: "mit",
                    country: "United States",
                    city: "Cambridge",
                    email: "contact@mit.edu",
                    domain: "mit.edu",
                    status: "active",
                    createdAt: "2023-07-08T11:00:00Z",
                    paymentStatus: "on-time",
                    lastPaymentDate: "2024-12-01T00:00:00Z",
                    nextPaymentDate: "2025-01-01T00:00:00Z",
                    numUsers: 920,
                    numProfessors: 38,
                    numStudents: 882
                }
            ]
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

