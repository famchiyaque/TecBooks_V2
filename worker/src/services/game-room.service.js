export async function createGameRoom(c, roomData, projectIds) {
  console.log({ roomData, projectIds });
  const { code, name, userId, numTeams, timePerRound } = roomData;
  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO game_rooms (code, game_name, created_by, created_at, n_teams, time_round)
       VALUES (?,?,?,?,?,?)`,
    ).bind(
      code,
      name,
      userId,
      new Date().toISOString(),
      numTeams,
      timePerRound,
    ),

    ...projectIds.map((projectId) =>
      c.env.DB.prepare(
        `INSERT INTO game_project (game_id, project_id)
         SELECT game_id, ? FROM game_rooms WHERE code = ?`,
      ).bind(projectId, code),
    ),
  ]);
}

export async function validateProjects(c, placeholders, projectIds) {
  return await c.env.DB.prepare(
    `SELECT COUNT(*) AS n FROM projects_temp WHERE project_id IN (${placeholders})`,
  )
    .bind(...projectIds)
    .all();
}
