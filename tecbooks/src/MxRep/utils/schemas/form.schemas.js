import { z } from 'zod'

// UTILITY CONFIGURATIONS
const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")

const institutionSchema = z.object({
    name: z.string(),
    slug: z.string().optional(),
    domain: z.string(),
    id: z.string()
})

// FORM-SPECIFIC SCHEMAS

export const loginSchema = z.object({
    email: z.email(),
    password: z.string()
})

export const forgotPasswordSchema = z.object({
    email: z.email()
})

export const newPasswordSchema = z.object({
    newPassword: passwordSchema,
    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Confirm password must equal new password",
    path: ["confirmNewPassword"]
});

export const registerStudentSchema = z.object({
    institution: institutionSchema,
    email: z.email()
}).refine((data) => data.email.split('@')[1] === data.institution.domain, {
    message: "Your email does not match your institution's domain, you must use your institution email",
    path: ["email"]
})

export const finalizeStudentSchema = registerStudentSchema.safeExtend({
    firstNames: z.string(),
    lastNames: z.string(),
    // Add all fields from newPasswordSchema
    ...newPasswordSchema.shape
});

export const registerProfessorSchema = z.object({
    institution: institutionSchema,
    email: z.email(),
    firstNames: z.string(),
    lastNames: z.string(),
    department: z.string()
}).refine((data) => data.email.split('@')[1] === data.institution.domain, {
    message: "Your email does not match your institution's domain, you must use your institution email",
    path: ["email"]
})

export const finalizeProfessorSchema = registerProfessorSchema.safeExtend({
    ...newPasswordSchema.shape
})

export const registerInstitution = z.object({
    institution: institutionSchema,
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    phoneNumber: z.string().min(1, "Phone number is required").transform((val) => {
        // Remove non-numeric characters and convert to number for storage
        const cleaned = val.replace(/\D/g, '')
        return cleaned ? Number(cleaned) : 0
    }).pipe(z.number().min(1, "Invalid phone number")),
    contactEmail: z.string().email("Invalid email address"),
    role: z.enum(["professor", "admin"], {
        required_error: "Please select a role"
    }),
    email: z.string().email("Invalid email address"),
    firstNames: z.string().min(1, "First name(s) is required"),
    lastNames: z.string().min(1, "Last name(s) is required"),
    department: z.string().optional()
}).refine((data) => {
    // Department is required if role is professor
    if (data.role === "professor" && (!data.department || data.department.trim() === "")) {
        return false
    }
    return true
}, {
    message: "Department is required for professors",
    path: ["department"]
}).refine((data) => {
    // Validate that user's email matches the institution domain they're registering
    const emailDomain = data.email.split('@')[1]
    return emailDomain === data.institution.domain
}, {
    message: "Your email does not match your institution's domain, you must use your institution email",
    path: ["email"]
})