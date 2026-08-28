import {
  calculateTotalInvestment,
  calculateFinancialInvestments,
} from "../services/expenses.service";

export async function getExpensesUseCase(env, gameId) {
  const investments = await calculateTotalInvestment(env.DB, gameId);

  const assetExpenses = investments.assetExpenses.reduce(
    (acum, curr) => (acum += curr.assetExpense),
    0,
  );

  const civilWork = investments.assetExpenses.filter(
    (expense) => expense.category == "machine",
  )[0].assetExpense;

  const totalInvestment =
    assetExpenses + investments.workforceCapital + civilWork * 0.35;

  investments.workforceCapital;
  const expenses = await calculateFinancialInvestments(
    env.DB,
    totalInvestment,
    gameId,
  );

  return { investments, totalInvestment, expenses };
}
