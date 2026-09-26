import { useQuery } from '@tanstack/react-query'
import { getTableRowsRequest } from '@/sims/project-feasibility/api/rows.api.js'

export default function useTableRows(gameId) {
  return useQuery({
    queryKey: ['table-rows', gameId],
    queryFn: () => getTableRowsRequest(gameId),
    enabled: Number.isInteger(gameId) && gameId > 0,
  })
}
