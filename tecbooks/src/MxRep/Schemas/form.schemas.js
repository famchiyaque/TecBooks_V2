import { z } from 'zod'

export const signInSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const forgotPasswordSchema = z.object({
    email: z.string()
})

const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")

export const resetPasswordSchema = z.object({
    newPassword: passwordSchema,
    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Confirm password must equal new password",
    path: ["confirmNewPassword"]
});