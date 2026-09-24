export async function getEmployees(db, gameTeamId) {
  const { results } = await db
    .prepare("SELECT * FROM game_team_employees WHERE game_team_id = ?")
    .bind(gameTeamId)
    .all();
  return results;
}

export async function getEmployeesTotalSalaries(db, gameTeamId) {
  return await db
    .prepare(
      "SELECT SUM(salary) as employeeSalary FROM game_team_employees WHERE game_team_id = ?",
    )
    .bind(gameTeamId)
    .first();
}
