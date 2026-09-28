export async function getOwnedGame(database, gameId, userId) {
  return database
    .prepare(
      `SELECT id, name, start_date, end_date, created_by
       FROM games
       WHERE id = ? AND created_by = ?`
    )
    .bind(gameId, userId)
    .first();
}

export async function getGameTeamId(database, gameId) {
  const row = await database
    .prepare('SELECT id FROM game_teams WHERE game_id = ?')
    .bind(gameId)
    .first();
  return row?.id ?? null;
}

export async function listPremisesYearly(database, gameId) {
  const { results } = await database
    .prepare('SELECT * FROM premises_yearly WHERE game_id = ? ORDER BY year')
    .bind(gameId)
    .all();
  return results ?? [];
}

export async function getPremisesPercentage(database, gameId) {
  return database
    .prepare('SELECT * FROM premises_percentage WHERE game_id = ?')
    .bind(gameId)
    .first();
}

export async function listPremisesPercentageYearly(database, gameId) {
  const { results } = await database
    .prepare('SELECT * FROM premises_percentage_yearly WHERE game_id = ? ORDER BY year')
    .bind(gameId)
    .all();
  return results ?? [];
}

export async function listPremisesDeprecations(database, gameId) {
  const { results } = await database
    .prepare('SELECT * FROM premises_deprecations WHERE game_id = ?')
    .bind(gameId)
    .all();
  return results ?? [];
}

export async function listPremisesDeprecationsYearly(database, gameId) {
  const { results } = await database
    .prepare(
      `SELECT y.* FROM premises_deprecations_yearly y
       JOIN premises_deprecations d ON d.id = y.deprecation_id
       WHERE d.game_id = ?
       ORDER BY y.year`
    )
    .bind(gameId)
    .all();
  return results ?? [];
}

export async function listTeamEmployees(database, teamId) {
  const { results } = await database
    .prepare(
      `SELECT
         e.id,
         e.name,
         e.job_title,
         e.base_salary,
         e.integrated_salary,
         gte.quantity
       FROM game_team_employees gte
       JOIN employees e ON e.id = gte.employee_id
       WHERE gte.game_team_id = ?
       ORDER BY gte.id`
    )
    .bind(teamId)
    .all();
  return results ?? [];
}

export async function listEmployeeCompensation(database, employeeIds) {
  if (!employeeIds.length) return [];
  const placeholders = employeeIds.map(() => '?').join(', ');
  const { results } = await database
    .prepare(
      `SELECT employee_id, item_name, percentage, amount
       FROM employee_compensation_items
       WHERE employee_id IN (${placeholders})`
    )
    .bind(...employeeIds)
    .all();
  return results ?? [];
}

export async function listTeamAssets(database, teamId) {
  const { results } = await database
    .prepare(
      `SELECT
         a.id,
         a.name,
         a.category,
         a.maintenance_cost,
         gta.unit_price
       FROM game_team_assets gta
       JOIN assets a ON a.id = gta.asset_id
       WHERE gta.game_team_id = ?
       ORDER BY a.id`
    )
    .bind(teamId)
    .all();
  return results ?? [];
}

export async function listAssetCostsYearly(database, assetIds) {
  if (!assetIds.length) return [];
  const placeholders = assetIds.map(() => '?').join(', ');
  const { results } = await database
    .prepare(
      `SELECT asset_id, year, cost
       FROM asset_cost_yearly
       WHERE asset_id IN (${placeholders})
       ORDER BY year`
    )
    .bind(...assetIds)
    .all();
  return results ?? [];
}

export async function getCapacityForTeam(database, teamId) {
  return database
    .prepare('SELECT * FROM capacity WHERE game_team_id = ?')
    .bind(teamId)
    .first();
}

export async function getProductionLine(database, lineId) {
  if (!lineId) return null;
  return database
    .prepare('SELECT * FROM production_lines WHERE id = ?')
    .bind(lineId)
    .first();
}

export async function listCapacityLineYearly(database, productionLineId) {
  if (!productionLineId) return [];
  const { results } = await database
    .prepare('SELECT * FROM production_line_capacity_yearly WHERE production_line_id = ? ORDER BY year')
    .bind(productionLineId)
    .all();
  return results ?? [];
}

export async function getBom(database, bomId) {
  if (!bomId) return null;
  return database
    .prepare('SELECT * FROM boms WHERE id = ?')
    .bind(bomId)
    .first();
}

export async function listBomParts(database, bomId) {
  if (!bomId) return [];
  const { results } = await database
    .prepare(
      `SELECT material_code, material, price, amount
       FROM required_materials
       WHERE bom_id = ?
       ORDER BY id`
    )
    .bind(bomId)
    .all();
  return results ?? [];
}

// BUG FIX: used to be `ORDER BY year DESC LIMIT 1` - only worked because the
// table used to hold year zero + PAST history years (is_projection = 0,
// strictly before year zero), so year zero was always the latest one. Now
// that COs' "Año Cero | Total" block also saves real FUTURE years the same
// way (see insertDemand), the latest row is a future year, not year zero -
// picking by year is ambiguous either direction (MIN grabs history, MAX
// grabs the furthest future year). `startYear` (the game's own horizon
// start, set once at upload from cbm.timeline.years[0]) is the one
// unambiguous anchor for which row IS year zero.
export async function getYearZeroDemand(database, gameId, startYear) {
  return database
    .prepare(
      `SELECT year, total
       FROM purchase_order_yearly_total
       WHERE game_id = ? AND is_projection = 0 AND year = ?`
    )
    .bind(gameId, startYear)
    .first();
}

export async function listDemandYearlyTotals(database, gameId) {
  const { results } = await database
    .prepare(
      `SELECT year, total, is_projection
       FROM purchase_order_yearly_total
       WHERE game_id = ?
       ORDER BY year`
    )
    .bind(gameId)
    .all();
  return results ?? [];
}

export async function listMonthShares(database, gameId) {
  const { results } = await database
    .prepare(
      `SELECT month, percentage, fixed_amount
       FROM purchase_order_monthly_distribution
       WHERE game_id = ?
       ORDER BY month`
    )
    .bind(gameId)
    .all();
  return results ?? [];
}
