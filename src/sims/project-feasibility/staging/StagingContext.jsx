import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  createProgramRequest,
  getFileGateError,
  getProgramFileCountError,
  parseNovusProjectFile,
  validateProgram,
} from '@/sims/project-feasibility'

const StagingContext = createContext(null)

export function useStaging() {
  const context = useContext(StagingContext)
  if (!context) {
    throw new Error('useStaging must be used within StagingProvider')
  }
  return context
}

export function StagingProvider({ children }) {
  const [programName, setProgramName] = useState('')
  const [items, setItems] = useState([])
  const [fileErrors, setFileErrors] = useState([])
  const [confirmError, setConfirmError] = useState(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addFiles = useCallback(async (files) => {
    const incoming = Array.from(files ?? [])
    if (!incoming.length) return

    setConfirmError(null)
    const countError = getProgramFileCountError([
      ...items,
      ...incoming,
    ])
    if (countError && incoming.length + items.length > 10) {
      setFileErrors([{ fileName: '', messages: [countError] }])
      return
    }

    setIsParsing(true)
    const nextErrors = []
    const accepted = []

    for (const file of incoming) {
      const gate = getFileGateError(file)
      if (gate) {
        nextErrors.push({ fileName: file.name, messages: [gate] })
        continue
      }
      const { project, validation } = await parseNovusProjectFile(file)
      if (!validation.valid || !project) {
        nextErrors.push({
          fileName: file.name,
          messages: validation.errors?.length ? validation.errors : ['No se pudo parsear el archivo'],
        })
        continue
      }
      accepted.push({
        fileName: file.name,
        project,
        validation,
      })
    }

    setItems((prev) => [...prev, ...accepted])
    setFileErrors(nextErrors)
    setIsParsing(false)
  }, [items])

  const remove = useCallback((index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const canConfirm = useMemo(() => {
    const nameOk = Boolean(programName.trim())
    const hasProjects = items.length > 0
    const allValid = items.every((item) => item.validation?.valid)
    return nameOk && hasProjects && allValid && !isParsing && !isSubmitting
  }, [programName, items, isParsing, isSubmitting])

  const confirm = useCallback(async () => {
    setConfirmError(null)
    const payload = {
      name: programName.trim(),
      projects: items.map(({ project }) => ({
        name: project.metadata.name,
        cbm: project,
      })),
    }
    const programCheck = validateProgram(payload)
    if (!programCheck.valid) {
      setConfirmError(programCheck.errors.join('. '))
      return null
    }
    setIsSubmitting(true)
    try {
      const createdProgram = await createProgramRequest(payload)
      setItems([])
      setFileErrors([])
      return createdProgram
    } catch (error) {
      const message =
        error.response?.data?.error === 'unauthorized'
          ? 'Inicia sesión para subir el programa'
          : error.response?.data?.error || error.message || 'No se pudo guardar el programa'
      setConfirmError(message)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [programName, items])

  const value = {
    programName,
    setProgramName,
    items,
    fileErrors,
    confirmError,
    isParsing,
    isSubmitting,
    canConfirm,
    addFiles,
    remove,
    confirm,
  }

  return <StagingContext.Provider value={value}>{children}</StagingContext.Provider>
}
