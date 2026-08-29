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
      cbm: typeof row.cbm_json === 'string' ? JSON.parse(row.cbm_json) : row.cbm_json,
    })),
  };
}
