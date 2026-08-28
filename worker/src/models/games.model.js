/*
  Interact with game information / games table
*/

export async function getGameIdByUserId(db, userId) {
  return db
    .prepare("SELECT id FROM games WHERE created_by = ?")
    .bind(userId)
    .first();
}

export async function getTeam(db, gameId) {
  return db
    .prepare("SELECT id FROM game_teams WHERE game_id = ?")
    .bind(gameId)
    .first();
}
