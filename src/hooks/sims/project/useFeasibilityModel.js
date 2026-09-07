import { useQuery } from '@tanstack/react-query'
import getFeasibilityModel from '@/api/sims/feasibility/getFeasibilityModel.service'

export default function useFeasibilityModel(gameId) {
  return useQuery({
    queryKey: ['feasibility-model', gameId],
    queryFn: () => getFeasibilityModel(gameId),
    enabled: Number.isInteger(gameId) && gameId > 0,
  })
}
