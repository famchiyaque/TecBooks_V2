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
    institution: { name: "", domain: "", id: ""},
    country: "",
    city: "",
    phoneNumber: null,
    contactEmail: "",
    role: "admin",
    email: "",
    firstNames: "",
    lastNames: "",
    department: "",
}