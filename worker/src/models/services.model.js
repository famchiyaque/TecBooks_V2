export async function getExpenses(db, gameId) {
  return db
    .prepare("SELECT * FROM expenses WHERE game_id = ?")
    .bind(gameId)
    .first();
}
