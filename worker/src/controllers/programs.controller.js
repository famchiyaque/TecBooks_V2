import { createProgramUseCase, listProgramsUseCase } from '../usecases/programs.usecase.js';
import { createProgramRequestSchema } from '../requests/program.request.js';

export async function createProgramController(context) {
  const requestBody = await context.req.json();
  const validationResult = createProgramRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return context.json({ error: 'invalid_body', details: validationResult.error.flatten() }, 400);
  }

  const program = await createProgramUseCase(context.env, {
    ...validationResult.data,
    createdBy: context.get('userId'),
  });

  return context.json(program, 201);
}

export async function listProgramsController(context) {
  const programs = await listProgramsUseCase(context.env, {
    createdBy: context.get('userId'),
  });

  return context.json(programs, 200);
}
