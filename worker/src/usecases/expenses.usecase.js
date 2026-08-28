import {
  calculateTotalInvestment,
  calculateFinancialInvestments,
} from "../services/expenses.service";

export async function getExpensesUseCase(env, gameId) {
  const totalInvestment = await calculateTotalInvestment(env.DB, gameId);
  const expenses = await calculateFinancialInvestments(
    env.DB,
    totalInvestment,
    gameId,
  );

  return expenses;
}
