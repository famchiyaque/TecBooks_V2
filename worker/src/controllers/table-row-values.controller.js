import { getTableRowValuesUseCase, saveTableRowValuesUseCase } from '../usecases/table-row-values.usecase.js';
import { replaceTableRowValuesRequestSchema, tableRowValueTypeSchema } from '../requests/table-row-values.request.js';

function parseParams(context) {
  const gameId = Number(context.req.param('gameId'));
  const typeResult = tableRowValueTypeSchema.safeParse(context.req.param('type'));
  if (!Number.isInteger(gameId) || gameId < 1) return { error: 'invalid_game_id' };
  if (!typeResult.success) return { error: 'invalid_type' };
  return { gameId, type: typeResult.data };
}

export async function getTableRowValuesController(context) {
  const { gameId, type, error } = parseParams(context);
  if (error) return context.json({ error }, 400);

  const rows = await getTableRowValuesUseCase(context.env, { gameId, type });
  return context.json({ rows }, 200);
}

export async function replaceTableRowValuesController(context) {
  const { gameId, type, error } = parseParams(context);
  if (error) return context.json({ error }, 400);

  const body = await context.req.json().catch(() => null);
  const validationResult = replaceTableRowValuesRequestSchema.safeParse(body);
  if (!validationResult.success) {
    return context.json({ error: 'invalid_body', details: validationResult.error.flatten() }, 400);
  }

  const rows = await saveTableRowValuesUseCase(context.env, {
    gameId,
    type,
    rows: validationResult.data.rows,
  });
  return context.json({ rows }, 200);
}
