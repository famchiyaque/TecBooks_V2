import { createProgram } from '../services/program.service.js';

export async function createProgramUseCase(env, { name, projects, createdBy }) {
  return createProgram(env.DB, { name, projects, createdBy });
}
