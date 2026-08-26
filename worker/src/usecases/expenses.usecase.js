import { getExpenses } from "../models/expenses.model.js";

export async function getExpensesUseCase(env, gameId) {
  return getExpenses(env.DB, gameId);
}
