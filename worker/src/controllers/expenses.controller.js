import { getExpensesUseCase } from "../usecases/expenses.usecase";

export async function getExpensesController(c) {
  // c.body => {gameId: number}
  const gameId = 1;
  const example = await getExpensesUseCase(c.env, gameId);
  return c.json(example);
}
