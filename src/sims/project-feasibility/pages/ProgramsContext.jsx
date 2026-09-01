import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { listProgramsRequest } from '../api/programs.api'
import { toSidebarPrograms } from '../model/programExtractors'

const ProgramsContext = createContext(null)

export function usePrograms() {
  const context = useContext(ProgramsContext)
  if (!context) {
    throw new Error('usePrograms must be used within ProgramsProvider')
  }
  return context
}

export function ProgramsProvider({ children }) {
  const [programs, setPrograms] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    listProgramsRequest()
      .then((data) => {
        if (cancelled) return
        setPrograms(Array.isArray(data) ? data : [])
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [])

  const value = useMemo(
    () => ({
      programs,
      status,
      sidebarPrograms: toSidebarPrograms(programs),
    }),
    [programs, status]
  )

  return <ProgramsContext.Provider value={value}>{children}</ProgramsContext.Provider>
}
