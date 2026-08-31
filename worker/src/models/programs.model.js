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

export async function insertFeasibilityProjects(database, programId, projects) {
  const statements = projects.map((project) =>
    database
      .prepare(
        `INSERT INTO feasibility_projects (program_id, name, cbm_json)
         VALUES (?, ?, ?)`
      )
      .bind(programId, project.name, JSON.stringify(project.cbm))
  );
  await database.batch(statements);
}

export async function listFeasibilityProjectsByProgramId(database, programId) {
  const { results } = await database
    .prepare(
      `SELECT id, program_id, name, cbm_json
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
