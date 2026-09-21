import { getTableRowValues, saveTableRowValues } from '../services/table-row-values.service.js';

export async function getTableRowValuesUseCase(env, { gameId, type }) {
  return getTableRowValues(env.DB, gameId, type);
}

export async function saveTableRowValuesUseCase(env, { gameId, type, rows }) {
  return saveTableRowValues(env.DB, gameId, type, rows);
}
