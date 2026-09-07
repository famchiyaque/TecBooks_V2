import workerApi from '@/utils/worker.util'
import { applyDerivedBase } from '@/sims/project-feasibility/model/applyDerivedBase'

export default async function getFeasibilityModel(gameId) {
  const { data } = await workerApi.get(`/api/feasibility/${gameId}`)
  return applyDerivedBase(data)
}
