export async function getCapacity(db, programId, projectId) {
  return await db
    .prepare("SELECT * FROM capacity")
    // .bind()
    .first();
}
