import {
  deleteFeasibilityProgram,
  insertFeasibilityProgram,
  insertFeasibilityProjects,
  listFeasibilityProgramsByCreatedBy,
  listFeasibilityProjectsByProgramId,
} from "../models/programs.model.js";
import { toProgramResponse } from "../mappers/program.mapper.js";

export async function createProgram(database, { name, projects, createdBy }) {
  // TODO: persist original Excel (or a program archive) to R2 and save r2_key on the program/project row. Not wired yet — D1 cbm_json only.
  console.log("CreatedBY: ", createdBy);
  const program = await insertFeasibilityProgram(database, { name, createdBy });

  try {
    await insertFeasibilityProjects(database, program.id, projects);
    const projectRows = await listFeasibilityProjectsByProgramId(
      database,
      program.id,
    );
    return toProgramResponse(program, projectRows);
  } catch (error) {
    await deleteFeasibilityProgram(database, program.id);
    throw error;
  }
}

export async function listPrograms(database, createdBy) {
  const programRows = await listFeasibilityProgramsByCreatedBy(
    database,
    createdBy,
  );

  const programs = [];
  for (const programRow of programRows) {
    const projectRows = await listFeasibilityProjectsByProgramId(
      database,
      programRow.id,
    );
    programs.push(toProgramResponse(programRow, projectRows));
  }
  return programs;
}
