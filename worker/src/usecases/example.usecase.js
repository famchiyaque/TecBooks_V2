import { getExample, getAllExamples, createExample } from '../services/example.service.js';

export async function getExampleByIdUseCase(env, id) {
  return getExample(env.DB, id);
}

export async function listExamplesUseCase(env) {
  return getAllExamples(env.DB);
}

export async function createExampleUseCase(env, name) {
  return createExample(env.DB, name);
}
