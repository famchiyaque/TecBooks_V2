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

function logCbmToGamePlan(plan, { projectName, fileName }) {
  const tableMap = {
    games: {
      from: 'plan.game',
      columns: {
        name: plan.game.name,
        start_date: String(plan.game.startYear),
        end_date: String(plan.game.endYear),
        status: 'draft',
        class_id: 'find-or-create "Project Feasibility" class',
        created_by: 'session userId',
      },
    },
    game_teams: {
      from: 'one row per game',
      columns: { name: 'Default', capital: 0, status: 'ready' },
    },
    premises: {
      from: 'plan.premises first-finite rates + plan.game.periods',
      columns: {
        exchange_rate: plan.premises.exchangeRate,
        national_leading_rate: plan.premises.nationalLeadingRate,
        cpp: plan.premises.cpp,
        cetes: plan.premises.cetes,
        libor: plan.premises.libor,
        national_inflation: plan.premises.nationalInflation,
        foreign_inflation: plan.premises.foreignInflation,
        isr: plan.premises.isr,
        impac: plan.premises.impac,
        ptu: plan.premises.ptu,
        periods: plan.game.periods,
        starting_money: 0,
      },
    },
    premises_percentage: {
      from: 'plan.premises first-finite policy %',
      columns: {
        inventary_percentage: plan.premises.inventoryPct,
        provider_percentage: plan.premises.suppliersPct,
        short_term_passive_percentage: plan.premises.shortTermLiabilityPct,
        product_direct_cost_percentage: plan.premises.directProductCostPct,
        product_indirect_cost: plan.premises.indirectProductCostPct,
        sale_expenses: plan.premises.salesExpensePct,
        administration_percentage: plan.premises.adminPct,
      },
    },
    premises_yearly: {
      from: 'plan.premises.yearly[]',
      rowCount: plan.premises.yearly?.length ?? 0,
    },
    premises_percentage_yearly: {
      from: 'plan.premises.yearly[] (same years, policy % fields)',
      rowCount: plan.premises.yearly?.length ?? 0,
    },
    premises_deprecations: {
      from: 'plan.premises.depreciationCategories[]',
      categories: (plan.premises.depreciationCategories ?? []).map((item) => item.category),
    },
    premises_deprecations_yearly: {
      from: 'plan.premises.depreciationCategories[].yearly',
    },
    expenses: {
      from: 'plan.expenses[] (CBM services)',
      rowCount: plan.expenses?.length ?? 0,
      columns: ['category', 'subcategory', 'name', 'description', 'default_cost = monthlyAmount', "expense_type = 'fixed'"],
    },
    assets: {
      from: 'plan.assets[] (Inversion byCategory + Capacidad machines as category=machine)',
      rowCount: plan.assets?.length ?? 0,
    },
    asset_cost_yearly: {
      from: 'plan.assets[].acquisitionByYear (nonzero years only, year = 2025 + index)',
    },
    game_team_assets: {
      from: 'one link per asset',
      columns: { quantity: 1, unit_price: 'sum of acquisitionByYear' },
    },
    employees: {
      from: 'plan.employees[]',
      rowCount: plan.employees?.length ?? 0,
      columns: {
        name: 'employee.name',
        job_title: 'category ?? type (not a real title column)',
        base_salary: 'percepcion',
        integrated_salary: 'percepcion + benefits',
        efficiency: 1,
      },
    },
    employee_compensation_items: {
      from: 'plan.employees[].compensation[]',
    },
    game_team_employees: {
      from: 'one link per employee',
      columns: { quantity: 'Math.max(1, round(cantidad))', salary: 'integratedSalary' },
    },
    boms: {
      from: 'plan.bom',
      columns: { product_name: plan.bom.productName, sale_price: plan.bom.salePrice },
    },
    required_materials: {
      from: 'plan.bom.parts[]',
      rowCount: plan.bom.parts?.length ?? 0,
    },
    production_lines: {
      from: 'plan.capacity',
      columns: { code: 'line-1', seconds_per_process: plan.capacity.secondsPerUnit, needed_operators: null },
    },
    capacity: {
      from: 'plan.capacity',
      columns: {
        seconds_x_unit: plan.capacity.secondsPerUnit,
        hours_shift: plan.capacity.hoursShift,
        shifts: plan.capacity.shifts,
        week_working_days: plan.capacity.weekWorkingDays,
        year_working_months: plan.capacity.yearWorkingMonths,
        quality_yield: plan.capacity.qualityYield,
        production_lines: 'production_lines.id (not the CBM line count)',
      },
    },
    purchase_order_yearly_total: {
      from: 'plan.demand',
      columns: {
        year: plan.demand.yearZeroYear,
        total: plan.demand.yearZeroTotal,
        is_projection: 0,
      },
    },
    purchase_order_monthly_distribution: {
      from: 'plan.demand.monthShares[]',
      rowCount: (plan.demand.monthShares ?? []).filter((value) => typeof value === 'number').length,
    },
    notPersistedFromCbm: [
      'derivedBase (stripped on the client before POST)',
      'demand.yearZeroOrders[] monthly counts (only yearZeroTotal + monthShares; GET rebuilds monthly as total × share)',
      'demand.history',
      'capacity.line.monthsWorkingWeeks (GET hardcodes 4)',
      'capacity.line.productionLines count (GET hardcodes 1)',
      'capacity.machines[].operators (machines stored as assets; GET operators = 0)',
    ],
  };

  console.log('[createProgram] mapCbmToGamePlan flattened plan', {
    projectName,
    fileName,
    plan,
  });
  console.log('[createProgram] CBM → D1 table map', {
    projectName,
    fileName,
    tableMap,
  });
}

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
      logCbmToGamePlan(plan, {
        projectName: project.name,
        fileName: file?.name,
      });
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
      console.log('[createProgram] persisted project', {
        programId: program.id,
        gameId,
        r2Key,
        catalogRow: { name: plan.game.name, gameId, r2Key },
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
    const projectRows = await listFeasibilityProjectsByProgramId(
      database,
      programRow.id,
    );
    programs.push(toProgramResponse(programRow, projectRows));
  }
  return programs;
}
