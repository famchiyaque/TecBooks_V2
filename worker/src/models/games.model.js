/*
  Interact with game information / games table
*/

// TODO: Temp function to interact with other data
export async function createGame(db, game) {
  const classRecord = await db
    .prepare("SELECT id FROM classes WHERE id = ?")
    .bind(game.classId)
    .first();
  if (!classRecord) {
    const error = new Error("Class not found");
    error.status = 404;
    throw error;
  }

  const userRecord = await db
    .prepare("SELECT id FROM users WHERE id = ?")
    .bind(game.createdBy)
    .first();
  if (!userRecord) {
    const error = new Error("Creator not found");
    error.status = 404;
    throw error;
  }

  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `
      INSERT INTO games (
        class_id, created_by, name, status, start_date, end_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .bind(
      game.classId,
      game.createdBy,
      game.name,
      game.status ?? "draft",
      game.startDate ?? null,
      game.endDate ?? null,
      now,
      now,
    )
    .run();

  return db
    .prepare("SELECT * FROM games WHERE id = ?")
    .bind(result.meta.last_row_id)
    .first();
}

export async function getGameIdByUserId(db, userId) {
  return db
    .prepare("SELECT id FROM games WHERE created_by = ?")
    .bind(userId)
    .first();
}
