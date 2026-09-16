import React, { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  const { data, isPending, isError } = useQuery({
    queryKey: ['programs'],
    queryFn: listProgramsRequest,
  })

  const programs = Array.isArray(data) ? data : []
  const status = isPending ? 'loading' : isError ? 'error' : 'ready'

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
