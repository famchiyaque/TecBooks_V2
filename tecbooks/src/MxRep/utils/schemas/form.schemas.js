import { z } from 'zod'

// UTILITY CONFIGURATIONS
const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")

const institutionSchema = z.object({
    name: z.string(),
    domain: z.string(),
    id: z.string()
})

// FORM-SPECIFIC SCHEMAS

export const signInSchema = z.object({
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
}).refine((data) => data.email.split('@')[2] === data.institution.domain, {
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
}).refine((data) => data.email.split('@')[2] === data.institution.domain, {
    message: "Your email does not match your institution's domain, you must use your institution email",
    path: ["email"]
})

export const finalizeProfessorSchema = registerProfessorSchema.safeExtend({
    ...newPasswordSchema.shape
})

export const registerInstitution = z.object({
    institution: institutionSchema,
    country: z.string(),
    city: z.string(),
    phoneNumber: z.number(),
    contactEmail: z.email(),
    userType: z.enum(["professor", "admin"]),
    email: z.email(),
    firstNames: z.string(),
    lastNames: z.string(),
    // may not be necessary depending on userType
    department: z.string()
})