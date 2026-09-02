import { getPremises } from "../services/premises.service";
import { getCapacity } from "../services/capacity.service";
import { getExpensesUseCase } from "./expenses.usecase";
import {
  calculateOperativeIndicators,
  calculateUtility,
} from "../services/prices.service";

export async function getPricesUseCase(env, programId, projectId) {
  const premises = await getPremises(env.DB, programId, projectId);
  const capacity = await getCapacity(env.DB, programId, projectId);
  const gameId = 1; // TODO
  const expenses = await getExpensesUseCase(env, gameId);
  const operativeIndicators = calculateOperativeIndicators(
    premises,
    capacity,
    expenses,
  );
  const utility = calculateUtility(premises, capacity, expenses);

  return { operativeIndicators, utility };
}
