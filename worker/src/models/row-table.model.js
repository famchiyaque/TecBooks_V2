const D1_BATCH_SIZE = 25;

async function runBatch(database, statements) {
  if (!statements.length) return;
  for (let index = 0; index < statements.length; index += D1_BATCH_SIZE) {
    await database.batch(statements.slice(index, index + D1_BATCH_SIZE));
  }
}

/** All custom rows for a game, every table - one row per (row_id, year). */
export async function listRowsForGame(database, gameId) {
  const { results } = await database
    .prepare('SELECT table_key, row_id, label, year, value FROM row_table WHERE game_id = ? ORDER BY table_key, row_id, year')
    .bind(gameId)
    .all();
  return results ?? [];
}

/**
 * Atomic replace: delete every row this table currently has for this game,
 * then insert the full set the client sent - same "whole set, not a diff"
 * shape EditableTableSlice already keeps in Redux (customRows array), so
 * there's no add/remove reconciliation to get wrong here.
 */
export async function replaceRowsForTable(database, gameId, tableKey, rows) {
  const statements = [
    database.prepare('DELETE FROM row_table WHERE game_id = ? AND table_key = ?').bind(gameId, tableKey),
  ];
  for (const row of rows) {
    for (const [year, value] of Object.entries(row.values ?? {})) {
      statements.push(
        database
          .prepare(
            `INSERT INTO row_table (game_id, table_key, row_id, label, year, value)
             VALUES (?, ?, ?, ?, ?, ?)`
          )
          .bind(gameId, tableKey, row.rowId, row.label, Number(year), value)
      );
    }
  }
  await runBatch(database, statements);
}

export async function deleteRow(database, gameId, tableKey, rowId) {
  await database
    .prepare('DELETE FROM row_table WHERE game_id = ? AND table_key = ? AND row_id = ?')
    .bind(gameId, tableKey, rowId)
    .run();
}
