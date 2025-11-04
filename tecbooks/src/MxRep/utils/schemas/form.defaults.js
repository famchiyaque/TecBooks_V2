import { z } from 'zod'

export const defaultRegisterStudent = {
    institution: { name: "", domain: "", id: "" },
    email: ""
}

export const defaultFinalizeStudent = {
    institution: { name: "", domain: "", id: "" },
    email: "",
    firstNames: "",
    lastNames: "",
    newPassword: "",
    confirmNewPassword: ""
}

export const defaultRegisterProfessor = {
    institution: { name: "", domain: "", id: ""},
    email: "",
    firstNames: "",
    lastNames: "",
    department: ""
}

export const defaultFinalizeProfessor = {
    institution: { name: "", domain: "", id: "" },
    email: "",
    firstNames: "",
    lastNames: "",
    department: "",
    newPassword: "",
    confirmNewPassword: ""
}

export const defaultRegisterInstitution = {
    institution: { name: "", slug: "", domain: "", id: ""},
    country: "",
    city: "",
    phoneNumber: "",
    contactEmail: "",
    role: "admin",
    email: "",
    firstNames: "",
    lastNames: "",
    department: "",
}

export const defaultInviteProfessor = {
    email: "",
    firstNames: "",
    lastNames: "",
    department: ""
}