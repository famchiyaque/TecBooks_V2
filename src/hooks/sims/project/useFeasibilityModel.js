import { useQuery } from '@tanstack/react-query'
import getFeasibilityModel from '@/api/sims/feasibility/getFeasibilityModel.service'

export default function useFeasibilityModel(gameId, currencyIn, currencyOut) {
  return useQuery({
    queryKey: ['feasibility-model', gameId, currencyIn, currencyOut],
    queryFn: () => getFeasibilityModel(gameId, currencyIn, currencyOut),
    enabled: Number.isInteger(gameId) && gameId > 0,
  })
}
