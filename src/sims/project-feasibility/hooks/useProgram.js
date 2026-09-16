import { useQuery } from '@tanstack/react-query'
import { listProgramsRequest } from '../api/programs.api'

export function useProgram(programId) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['programs'],
    queryFn: listProgramsRequest,
  })

  const program = (data ?? []).find((candidate) => String(candidate.id) === String(programId)) ?? null
  const status = isPending ? 'loading' : isError ? 'error' : program ? 'ready' : 'not-found'

  return { program, status }
}
