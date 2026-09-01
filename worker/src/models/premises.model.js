export async function getPremises(db, gameId) {
  return await db
    .prepare("SELECT * FROM premises WHERE game_id = ?")
    .bind(gameId)
    .first();
}
