import { getOwnedGame } from '../models/feasibility-read.model.js';
import { listRowsForGame, replaceRowsForTable, deleteRow } from '../models/row-table.model.js';

async function requireOwnedGame(database, gameId, userId) {
  const game = await getOwnedGame(database, gameId, userId);
  if (!game) {
    const error = new Error('game_not_found');
    error.status = 404;
    throw error;
  }
  return game;
}

/** { [tableKey]: [{ rowId, label, values: { [year]: value } }] } - grouped from the flat (row_id, year) rows. */
export async function listTableRows(database, { gameId, userId }) {
  await requireOwnedGame(database, gameId, userId);
  const rows = await listRowsForGame(database, gameId);

  const byTable = {};
  for (const row of rows) {
    const table = (byTable[row.table_key] ??= []);
    let entry = table.find((candidate) => candidate.rowId === row.row_id);
    if (!entry) {
      entry = { rowId: row.row_id, label: row.label, values: {} };
      table.push(entry);
    }
    entry.values[row.year] = row.value;
  }
  return byTable;
}

export async function replaceTableRows(database, { gameId, userId, tableKey, rows }) {
  await requireOwnedGame(database, gameId, userId);
  await replaceRowsForTable(database, gameId, tableKey, rows);
}

export async function deleteTableRow(database, { gameId, userId, tableKey, rowId }) {
  await requireOwnedGame(database, gameId, userId);
  await deleteRow(database, gameId, tableKey, rowId);
}
