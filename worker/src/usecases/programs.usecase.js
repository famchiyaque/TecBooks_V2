import { createProgram, listPrograms } from '../services/program.service.js';

export async function createProgramUseCase(env, payload) {
  return createProgram(env, payload);
}

export async function listProgramsUseCase(env, { createdBy }) {
  return listPrograms(env.DB, createdBy);
}
