export function toProgramResponse(programRow, projectRows) {
  return {
    id: programRow.id,
    name: programRow.name,
    createdAt: programRow.created_at,
    createdBy: programRow.created_by,
    projects: projectRows.map((row) => ({
      id: row.id,
      programId: row.program_id,
      name: row.name,
      gameId: row.game_id,
      r2Key: row.r2_key ?? null,
    })),
  };
}
