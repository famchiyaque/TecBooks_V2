import {
  deleteFeasibilityProgram,
  insertFeasibilityProgram,
  insertFeasibilityProject,
  listFeasibilityProgramsByCreatedBy,
  listFeasibilityProjectsByProgramId,
} from '../models/programs.model.js';
import {
  deleteGameGraph,
  ensureFullTimeSchedule,
  findOrCreateFeasibilityClass,
  findUserSchoolId,
  insertAssetsForTeam,
  insertBomGraph,
  insertDemand,
  insertEmployeesForTeam,
  insertExpenses,
  insertGame,
  insertGameTeam,
  insertPremises,
} from '../models/project-write.model.js';
import { mapCbmToGamePlan } from '../mappers/cbm-to-game.mapper.js';
import { toProgramResponse } from '../mappers/program.mapper.js';
import { deleteProjectWorkbook, projectObjectKey, putProjectWorkbook } from './r2.service.js';

async function persistGameFromPlan(database, plan, { classId, createdBy }) {
  await ensureFullTimeSchedule(database);

  const game = await insertGame(database, {
    classId,
    createdBy,
    name: plan.game.name,
    startYear: plan.game.startYear,
    endYear: plan.game.endYear,
  });
  const team = await insertGameTeam(database, game.id);

  await insertPremises(database, game.id, plan.premises, plan.game.periods);
  await insertExpenses(database, game.id, plan.expenses);
  await insertAssetsForTeam(database, team.id, plan.assets);
  await insertEmployeesForTeam(database, team.id, plan.employees);
  await insertBomGraph(database, team.id, plan.bom, plan.capacity);
  await insertDemand(database, game.id, plan.demand);

  return game.id;
}

export async function createProgram(env, { name, projects, files, createdBy }) {
  const schoolId = await findUserSchoolId(env.DB, createdBy);
  if (!schoolId) {
    const error = new Error('user_school_not_found');
    error.status = 400;
    throw error;
  }

  const classId = await findOrCreateFeasibilityClass(env.DB, {
    schoolId,
    teacherId: createdBy,
  });

  const program = await insertFeasibilityProgram(env.DB, { name, createdBy });
  const createdGameIds = [];
  const uploadedKeys = [];

  try {
    for (let index = 0; index < projects.length; index += 1) {
      const project = projects[index];
      const file = files[index];
      const plan = mapCbmToGamePlan(project.cbm, project.name);
      const gameId = await persistGameFromPlan(env.DB, plan, { classId, createdBy });
      createdGameIds.push(gameId);

      const r2Key = projectObjectKey({
        createdBy,
        programId: program.id,
        gameId,
        fileName: file?.name ?? `${plan.game.name}.xlsx`,
      });
      await putProjectWorkbook(env.R2, r2Key, file);
      uploadedKeys.push(r2Key);

      await insertFeasibilityProject(env.DB, program.id, {
        name: plan.game.name,
        gameId,
        r2Key,
      });
    }

    const projectRows = await listFeasibilityProjectsByProgramId(env.DB, program.id);
    return toProgramResponse(program, projectRows);
  } catch (error) {
    await deleteFeasibilityProgram(env.DB, program.id);
    for (const gameId of createdGameIds) {
      await deleteGameGraph(env.DB, gameId);
    }
    for (const key of uploadedKeys) {
      await deleteProjectWorkbook(env.R2, key);
    }
    throw error;
  }
}

export async function listPrograms(database, createdBy) {
  const programRows = await listFeasibilityProgramsByCreatedBy(database, createdBy);
  const programs = [];
  for (const programRow of programRows) {
    const projectRows = await listFeasibilityProjectsByProgramId(database, programRow.id);
    programs.push(toProgramResponse(programRow, projectRows));
  }
  return programs;
}
