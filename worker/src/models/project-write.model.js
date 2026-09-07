const FEASIBILITY_CLASS_NAME = 'Project Feasibility';
const GENERAL_SCHOOL_SLUG = 'general';
const D1_BATCH_SIZE = 25;

async function runBatch(database, statements) {
  if (!statements.length) return;
  for (let index = 0; index < statements.length; index += D1_BATCH_SIZE) {
    await database.batch(statements.slice(index, index + D1_BATCH_SIZE));
  }
}

export async function findUserSchoolId(database, userId) {
  console.log("userId passed: ", userId);
  const row = await database
    .prepare('SELECT school_id FROM users WHERE id = ?')
    .bind(userId)
    .first();
  return row?.school_id ?? null;
}

export async function findOrCreateFeasibilityClass(database, { schoolId, teacherId }) {
  const general = await database
    .prepare('SELECT id FROM schools WHERE slug = ?')
    .bind(GENERAL_SCHOOL_SLUG)
    .first();
  const resolvedSchoolId = general?.id ?? schoolId;

  const existing = await database
    .prepare('SELECT id FROM classes WHERE school_id = ? AND name = ?')
    .bind(resolvedSchoolId, FEASIBILITY_CLASS_NAME)
    .first();
  if (existing?.id) return existing.id;

  const created = await database
    .prepare(
      `INSERT INTO classes (school_id, teacher_id, name, created_at)
       VALUES (?, ?, ?, datetime('now'))
       RETURNING id`
    )
    .bind(resolvedSchoolId, teacherId, FEASIBILITY_CLASS_NAME)
    .first();
  return created.id;
}

export async function ensureFullTimeSchedule(database) {
  const existing = await database
    .prepare('SELECT id FROM schedules WHERE name = ?')
    .bind('full-time')
    .first();
  if (existing?.id) return;

  await database
    .prepare(
      `INSERT INTO schedules
        (name, description, hours_per_week, days_per_week, hours_per_day, start_time, end_time)
       VALUES ('full-time', 'Full-time schedule', 40, 5, 8, '09:00', '18:00')`
    )
    .run();
}

export async function insertGame(database, { classId, createdBy, name, startYear, endYear }) {
  return database
    .prepare(
      `INSERT INTO games (class_id, created_by, name, status, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, 'draft', ?, ?, datetime('now'), datetime('now'))
       RETURNING id`
    )
    .bind(classId, createdBy, name, String(startYear), String(endYear))
    .first();
}

export async function insertGameTeam(database, gameId) {
  return database
    .prepare(
      `INSERT INTO game_teams (game_id, name, capital, status, created_at)
       VALUES (?, 'Default', 0, 'ready', datetime('now'))
       RETURNING id`
    )
    .bind(gameId)
    .first();
}

export async function insertPremises(database, gameId, premises, periods) {
  await database
    .prepare(
      `INSERT INTO premises (
        game_id, starting_money, exchange_rate, national_leading_rate, cpp, cetes, libor,
        national_inflation, foreign_inflation, isr, impac, ptu, periods
      ) VALUES (?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      gameId,
      premises.exchangeRate,
      premises.nationalLeadingRate,
      premises.cpp,
      premises.cetes,
      premises.libor,
      premises.nationalInflation,
      premises.foreignInflation,
      premises.isr,
      premises.impac,
      premises.ptu,
      periods
    )
    .run();

  await database
    .prepare(
      `INSERT INTO premises_percentage (
        game_id, inventary_percentage, provider_percentage, short_term_passive_percentage,
        product_direct_cost_percentage, product_indirect_cost, sale_expenses, administration_percentage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      gameId,
      premises.inventoryPct,
      premises.suppliersPct,
      premises.shortTermLiabilityPct,
      premises.directProductCostPct,
      premises.indirectProductCostPct,
      premises.salesExpensePct,
      premises.adminPct
    )
    .run();

  await database
    .prepare(
      `INSERT INTO premises_deprecations (game_id, building, transport, compute, machinery)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(
      gameId,
      premises.depreciationBuildings,
      premises.depreciationTransport,
      premises.depreciationCompute,
      premises.depreciationMachinery
    )
    .run();

  const yearlyStatements = (premises.yearly ?? []).flatMap((row) => [
    database
      .prepare(
        `INSERT INTO premises_yearly (
          game_id, year, exchange_rate, national_leading_rate, cpp, cetes, libor,
          national_inflation, foreign_inflation, isr, impac, ptu
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        gameId,
        row.year,
        row.exchangeRate,
        row.nationalLeadingRate,
        row.cpp,
        row.cetes,
        row.libor,
        row.nationalInflation,
        row.foreignInflation,
        row.isr,
        row.impac,
        row.ptu
      ),
    database
      .prepare(
        `INSERT INTO premises_percentage_yearly (
          game_id, year, inventary_percentage, provider_percentage, short_term_passive_percentage,
          product_direct_cost_percentage, product_indirect_cost, sale_expenses, administration_percentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        gameId,
        row.year,
        row.inventoryPct,
        row.suppliersPct,
        row.shortTermLiabilityPct,
        row.directProductCostPct,
        row.indirectProductCostPct,
        row.salesExpensePct,
        row.adminPct
      ),
    database
      .prepare(
        `INSERT INTO premises_deprecations_yearly (game_id, year, building, transport, compute, machinery)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        gameId,
        row.year,
        row.depreciationBuildings,
        row.depreciationTransport,
        row.depreciationCompute,
        row.depreciationMachinery
      ),
  ]);

  await runBatch(database, yearlyStatements);
}

export async function insertExpenses(database, gameId, expenses) {
  if (!expenses.length) return;
  await runBatch(
    database,
    expenses.map((expense) =>
      database
        .prepare(
          `INSERT INTO expenses (game_id, category, subcategory, name, description, default_cost, expense_type)
           VALUES (?, ?, ?, ?, ?, ?, 'fixed')`
        )
        .bind(
          gameId,
          expense.category,
          expense.subcategory,
          expense.name,
          expense.description,
          expense.defaultCost
        )
    )
  );
}

export async function insertAssetsForTeam(database, teamId, assets) {
  for (const asset of assets) {
    const row = await database
      .prepare(
        `INSERT INTO assets (name, category, maintenance_cost)
         VALUES (?, ?, ?)
         RETURNING id`
      )
      .bind(asset.name, asset.category, asset.unitPrice)
      .first();

    const yearly = (asset.acquisitionByYear ?? [])
      .map((cost, index) => ({ year: 2025 + index, cost }))
      .filter((item) => typeof item.cost === 'number' && Number.isFinite(item.cost) && item.cost !== 0);
    if (yearly.length) {
      await runBatch(
        database,
        yearly.map((item) =>
          database
            .prepare('INSERT INTO asset_cost_yearly (asset_id, year, cost) VALUES (?, ?, ?)')
            .bind(row.id, item.year, item.cost)
        )
      );
    }

    await database
      .prepare(
        `INSERT INTO game_team_assets (game_team_id, asset_id, quantity, unit_price, acquired_at, status)
         VALUES (?, ?, 1, ?, datetime('now'), 'active')`
      )
      .bind(teamId, row.id, asset.unitPrice)
      .run();
  }
}

export async function insertEmployeesForTeam(database, teamId, employees) {
  for (const employee of employees) {
    const row = await database
      .prepare(
        `INSERT INTO employees (name, job_title, base_salary, efficiency, integrated_salary)
         VALUES (?, ?, ?, 1, ?)
         RETURNING id`
      )
      .bind(employee.name, employee.category ?? employee.type, employee.baseSalary, employee.integratedSalary)
      .first();

    if (employee.compensation?.length) {
      await runBatch(
        database,
        employee.compensation.map((item) =>
          database
            .prepare(
              `INSERT INTO employee_compensation_items (employee_id, item_name, percentage, amount)
               VALUES (?, ?, ?, ?)`
            )
            .bind(row.id, item.itemName, item.percentage, item.amount)
        )
      );
    }

    await database
      .prepare(
        `INSERT INTO game_team_employees
          (game_team_id, employee_id, employee_name, salary, hired_at, quantity)
         VALUES (?, ?, ?, ?, datetime('now'), ?)`
      )
      .bind(teamId, row.id, employee.name, employee.integratedSalary, employee.quantity)
      .run();
  }
}

export async function insertBomGraph(database, teamId, bom, capacity) {
  const bomRow = await database
    .prepare(
      `INSERT INTO boms (product_name, sale_price)
       VALUES (?, ?)
       RETURNING id`
    )
    .bind(bom.productName, bom.salePrice)
    .first();

  if (bom.parts.length) {
    await runBatch(
      database,
      bom.parts.map((part) =>
        database
          .prepare(
            `INSERT INTO required_materials (bom_id, material_code, material, price, amount)
             VALUES (?, ?, ?, ?, ?)`
          )
          .bind(bomRow.id, part.code, part.material, part.price, part.amount)
      )
    );
  }

  const line = await database
    .prepare(
      `INSERT INTO production_lines (code, product_id, seconds_per_process, needed_operators)
       VALUES (?, ?, ?, ?)
       RETURNING id`
    )
    .bind('line-1', bomRow.id, capacity.secondsPerUnit, null)
    .first();

  await database
    .prepare(
      `INSERT INTO capacity (
        game_team_id, seconds_x_unit, hours_shift, shifts, production_lines,
        week_working_days, year_working_months, quality_yield
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      teamId,
      capacity.secondsPerUnit,
      capacity.hoursShift,
      capacity.shifts,
      line.id,
      capacity.weekWorkingDays,
      capacity.yearWorkingMonths,
      capacity.qualityYield
    )
    .run();
}

export async function insertDemand(database, gameId, demand) {
  if (demand.yearZeroYear !== null && demand.yearZeroTotal !== null) {
    await database
      .prepare(
        `INSERT INTO purchase_order_yearly_total (game_id, year, total, is_projection)
         VALUES (?, ?, ?, 0)`
      )
      .bind(gameId, demand.yearZeroYear, demand.yearZeroTotal)
      .run();
  }

  const months = (demand.monthShares ?? [])
    .map((percentage, index) => ({ month: index + 1, percentage }))
    .filter((row) => typeof row.percentage === 'number' && Number.isFinite(row.percentage));

  if (months.length) {
    await runBatch(
      database,
      months.map((row) =>
        database
          .prepare(
            `INSERT INTO purchase_order_monthly_distribution (game_id, month, percentage)
             VALUES (?, ?, ?)`
          )
          .bind(gameId, row.month, row.percentage)
      )
    );
  }
}

export async function deleteGameGraph(database, gameId) {
  const team = await database
    .prepare('SELECT id FROM game_teams WHERE game_id = ?')
    .bind(gameId)
    .first();
  const teamId = team?.id;

  if (teamId) {
    const capacity = await database
      .prepare('SELECT id, production_lines FROM capacity WHERE game_team_id = ?')
      .bind(teamId)
      .first();
    const lineId = capacity?.production_lines;
    let bomId = null;
    if (lineId) {
      const line = await database
        .prepare('SELECT product_id FROM production_lines WHERE id = ?')
        .bind(lineId)
        .first();
      bomId = line?.product_id ?? null;
    }

    await database.prepare('DELETE FROM capacity WHERE game_team_id = ?').bind(teamId).run();
    if (lineId) {
      await database.prepare('DELETE FROM production_lines WHERE id = ?').bind(lineId).run();
    }
    if (bomId) {
      await database.prepare('DELETE FROM required_materials WHERE bom_id = ?').bind(bomId).run();
      await database.prepare('DELETE FROM boms WHERE id = ?').bind(bomId).run();
    }

    const assetLinks = await database
      .prepare('SELECT asset_id FROM game_team_assets WHERE game_team_id = ?')
      .bind(teamId)
      .all();
    const employeeLinks = await database
      .prepare('SELECT employee_id FROM game_team_employees WHERE game_team_id = ?')
      .bind(teamId)
      .all();

    await database.prepare('DELETE FROM game_team_assets WHERE game_team_id = ?').bind(teamId).run();
    await database.prepare('DELETE FROM game_team_employees WHERE game_team_id = ?').bind(teamId).run();
    await database.prepare('DELETE FROM game_teams WHERE id = ?').bind(teamId).run();

    for (const row of assetLinks.results ?? []) {
      await database.prepare('DELETE FROM asset_cost_yearly WHERE asset_id = ?').bind(row.asset_id).run();
      await database.prepare('DELETE FROM assets WHERE id = ?').bind(row.asset_id).run();
    }
    for (const row of employeeLinks.results ?? []) {
      await database.prepare('DELETE FROM employee_compensation_items WHERE employee_id = ?').bind(row.employee_id).run();
      await database.prepare('DELETE FROM employees WHERE id = ?').bind(row.employee_id).run();
    }
  }

  await database.prepare('DELETE FROM expenses WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM purchase_order_monthly_distribution WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM purchase_order_yearly_total WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM premises_yearly WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM premises_percentage_yearly WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM premises_deprecations_yearly WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM premises_percentage WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM premises_deprecations WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM premises WHERE game_id = ?').bind(gameId).run();
  await database.prepare('DELETE FROM games WHERE id = ?').bind(gameId).run();
}
