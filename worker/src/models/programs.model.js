export async function insertFeasibilityProgram(database, { name, createdBy }) {
  return database
    .prepare(
      `INSERT INTO feasibility_programs (name, created_by, created_at)
       VALUES (?, ?, datetime('now'))
       RETURNING id, name, created_by, created_at`
    )
    .bind(name, createdBy)
    .first();
}

export async function listFeasibilityProgramsByCreatedBy(database, createdBy) {
  const { results } = await database
    .prepare(
      `SELECT id, name, created_by, created_at
       FROM feasibility_programs
       WHERE created_by = ?
       ORDER BY id DESC`
    )
    .bind(createdBy)
    .all();
  return results;
}

export async function insertFeasibilityProject(database, programId, { name, gameId, r2Key }) {
  return database
    .prepare(
      `INSERT INTO feasibility_projects (program_id, name, game_id, r2_key)
       VALUES (?, ?, ?, ?)
       RETURNING id, program_id, name, game_id, r2_key`
    )
    .bind(programId, name, gameId, r2Key)
    .first();
}

export async function listFeasibilityProjectsByProgramId(database, programId) {
  const { results } = await database
    .prepare(
      `SELECT id, program_id, name, game_id, r2_key
       FROM feasibility_projects
       WHERE program_id = ?
       ORDER BY id`
    )
    .bind(programId)
    .all();
  return results;
}

export async function deleteFeasibilityProgram(database, programId) {
  await database.prepare('DELETE FROM feasibility_projects WHERE program_id = ?').bind(programId).run();
  await database.prepare('DELETE FROM feasibility_programs WHERE id = ?').bind(programId).run();
}
