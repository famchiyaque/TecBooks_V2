import {
  calculateTotalInvestment,
  calculateFinancialInvestments,
  getServieInvestments,
  fetchYears,
  fetchInflation,
} from "../services/expenses.service";

export async function getExpensesUseCase(env, gameId) {
  const yearsRaw = await fetchYears(env.DB, gameId);
  const inflation = await fetchInflation(env.DB, gameId);
  const serviceExpenses = await getServieInvestments(env.DB, gameId);
  const investments = await calculateTotalInvestment(env.DB, gameId);

  const years = Array.from(
    { length: parseInt(yearsRaw.end_date) - parseInt(yearsRaw.start_date) + 1 },
    (_, i) => parseInt(yearsRaw.start_date) + i,
  );

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

  return { years, inflation, serviceExpenses, investments, expenses };
}
