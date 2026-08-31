import { createProgram, listPrograms } from '../services/program.service.js';

export async function createProgramUseCase(env, { name, projects, createdBy }) {
  return createProgram(env.DB, { name, projects, createdBy });
}

export async function listProgramsUseCase(env, { createdBy }) {
  return listPrograms(env.DB, createdBy);
}
