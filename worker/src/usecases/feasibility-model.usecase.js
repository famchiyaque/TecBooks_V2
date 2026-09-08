import { getFeasibilityModel } from '../services/feasibility-model.service.js';

export async function getFeasibilityModelUseCase(env, payload) {
  return getFeasibilityModel(env.DB, payload);
}
