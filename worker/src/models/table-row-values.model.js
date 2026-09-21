const D1_BATCH_SIZE = 25;

async function runBatch(database, statements) {
  if (!statements.length) return;
  for (let index = 0; index < statements.length; index += D1_BATCH_SIZE) {
    await database.batch(statements.slice(index, index + D1_BATCH_SIZE));
  }
}

export async function listTableRowValues(database, gameId, type) {
  const { results } = await database
    .prepare(
      `SELECT row_key, label, is_custom, year, value
       FROM table_row_values
       WHERE game_id = ? AND type = ?
       ORDER BY row_key, year`
    )
    .bind(gameId, type)
    .all();
  return results;
}

/** Delete-then-reinsert, atomic: replaces every row for this (game, type) with `rows`. */
export async function replaceTableRowValues(database, gameId, type, rows) {
  const statements = [
    database.prepare('DELETE FROM table_row_values WHERE game_id = ? AND type = ?').bind(gameId, type),
    ...rows.map((row) =>
      database
        .prepare(
          `INSERT INTO table_row_values (game_id, type, row_key, label, is_custom, year, value)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(gameId, type, row.rowKey, row.label ?? null, row.isCustom ? 1 : 0, row.year, row.value)
    ),
  ];
  await runBatch(database, statements);
}
