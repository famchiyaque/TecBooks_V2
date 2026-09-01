export async function listAssets(db, gameId) {
  const { results } = await db
    .prepare("SELECT * FROM assets ORDER BY id DESC")
    .all();
  return results;
}

export async function getTeamAssets(db, gameTeamId) {
  const { results } = await db
    .prepare("SELECT * FROM game_team_assets WHERE game_team_id = ?")
    .bind(gameTeamId)
    .all();
  return results;
}

export async function getTeamAssetsTotalExpense(db, gameTeamId) {
  const { results } = await db
    .prepare(
      "SELECT SUM(unit_price) as assetExpense, category FROM game_team_assets ga JOIN assets ON assets.id = ga.asset_id WHERE ga.game_team_id = ? GROUP BY category",
    )
    .bind(gameTeamId)
    .all();
  return results;
}
