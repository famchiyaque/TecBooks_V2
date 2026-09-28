import { listTableRows, replaceTableRows, deleteTableRow } from '../services/row-table.service.js';

export async function listTableRowsUseCase(env, payload) {
  return listTableRows(env.DB, payload);
}

export async function replaceTableRowsUseCase(env, payload) {
  return replaceTableRows(env.DB, payload);
}

export async function deleteTableRowUseCase(env, payload) {
  return deleteTableRow(env.DB, payload);
}
