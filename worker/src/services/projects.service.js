export async function listProjects(db) {
  const { results } = await db
    .prepare(
      "SELECT project_id AS id, project AS name FROM projects_temp ORDER BY project",
    )
    .all();
  return results;
}
