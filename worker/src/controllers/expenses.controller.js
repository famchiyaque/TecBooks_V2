import { getExpensesUseCase } from "../usecases/expenses.usecase";

export async function getExpensesController(c) {
  const gameId = Number(c.req.query("gameId"));
  if (!Number.isInteger(gameId) || gameId < 1) {
    return c.json({ error: "invalid_game_id" }, 400);
  }
  const example = await getExpensesUseCase(c.env, gameId);
  return c.json(example);
}
