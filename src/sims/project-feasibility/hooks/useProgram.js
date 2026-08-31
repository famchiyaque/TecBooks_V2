import { useEffect, useState } from 'react'
import { listProgramsRequest } from '../api/programs.api'

/**
 * Fetches the user's programs and returns the one matching programId.
 * No dedicated GET /api/programs/:id yet - the list endpoint already
 * returns full programs (with their projects' cbm), so this just filters
 * client-side rather than adding a new backend route for a handful of rows.
 */
export function useProgram(programId) {
  const [program, setProgram] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    listProgramsRequest()
      .then((programs) => {
        if (cancelled) return
        const found = programs.find((candidate) => String(candidate.id) === String(programId))
        setProgram(found ?? null)
        setStatus(found ? 'ready' : 'not-found')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => { cancelled = true }
  }, [programId])

  return { program, status }
}
