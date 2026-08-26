import { findExpenses } from "../mdoel/expenses.model.js";

export async function getExpenses(db, gameId) {
  const expenses = await findExpenses(db, gameId);
  if (!expenses) {
    const error = new Error("Expenses not found");
    error.status = 404;
    throw error;
  }
  return expenses;
}
