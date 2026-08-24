import { getExampleByIdUseCase, listExamplesUseCase, createExampleUseCase } from '../usecases/example.usecase.js';

export async function getExampleController(c) {
  const id = c.req.param('id');
  const example = await getExampleByIdUseCase(c.env, id);
  return c.json(example);
}

export async function listExamplesController(c) {
  const examples = await listExamplesUseCase(c.env);
  return c.json(examples);
}

export async function createExampleController(c) {
  const body = await c.req.json();
  const example = await createExampleUseCase(c.env, body.name);
  return c.json(example, 201);
}
