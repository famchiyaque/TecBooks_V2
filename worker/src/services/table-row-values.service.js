import { listTableRowValues, replaceTableRowValues } from '../models/table-row-values.model.js';

function toApiShape(row) {
  return {
    rowKey: row.row_key,
    label: row.label,
    isCustom: Boolean(row.is_custom),
    year: row.year,
    value: row.value,
  };
}

export async function getTableRowValues(database, gameId, type) {
  const rows = await listTableRowValues(database, gameId, type);
  return rows.map(toApiShape);
}

export async function saveTableRowValues(database, gameId, type, rows) {
  await replaceTableRowValues(database, gameId, type, rows);
  return getTableRowValues(database, gameId, type);
}
