import { getFeasibilityModelUseCase } from '../usecases/feasibility-model.usecase.js';

export async function getFeasibilityModelController(context) {
  const gameId = Number(context.req.param('gameId'));
  if (!Number.isInteger(gameId) || gameId < 1) {
    return context.json({ error: 'invalid_game_id' }, 400);
  }

  const model = await getFeasibilityModelUseCase(context.env, {
    gameId,
    userId: context.get('userId'),
  });

  return context.json(model, 200);
}
