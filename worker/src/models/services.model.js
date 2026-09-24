export async function getExpenses(db, gameId) {
  const { results } = await db
    .prepare("SELECT * FROM expenses WHERE game_id = ?")
    .bind(gameId)
    .all();
  return results;
}

export async function getTotalExpenses(db, gameId) {
  return db
    .prepare(
      "SELECT SUM(default_cost) as serviceExpenses FROM expenses WHERE game_id = ?",
    )
    .bind(gameId)
    .first();
}
