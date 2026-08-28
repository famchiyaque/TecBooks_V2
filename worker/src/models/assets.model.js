export async function listAssets(db, gameId) {
  const { results } = await db
    .prepare("SELECT * FROM assets ORDER BY id DESC")
    .all();
  return results;
}

export async function getTeamAssets(db, gameTeamId) {
  const { results } = await db
    .prepare(
      "SELECT * FROM game_team_assets WHERE game_team_id = ?  ORDER BY id DESC",
    )
    .bind(gameTeamId)
    .all();
  return results;
}
