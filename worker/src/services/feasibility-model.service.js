import { getPremises } from '../models/premises.model.js';
import { getExpenses } from '../models/services.model.js';
import {
  getBom,
  getCapacityForTeam,
  getGameTeamId,
  getOwnedGame,
  getProductionLine,
  getYearZeroDemand,
  listPremisesDeprecations,
  getPremisesPercentage,
  listAssetCostsYearly,
  listBomParts,
  listEmployeeCompensation,
  listMonthShares,
  listPremisesDeprecationsYearly,
  listPremisesPercentageYearly,
  listPremisesYearly,
  listTeamAssets,
  listTeamEmployees,
} from '../models/feasibility-read.model.js';
import { mapGameRowsToCbm } from '../mappers/game-to-cbm.mapper.js';

export async function getFeasibilityModel(database, { gameId, userId }) {
  const game = await getOwnedGame(database, gameId, userId);
  if (!game) {
    const error = new Error('game_not_found');
    error.status = 404;
    throw error;
  }

  const teamId = await getGameTeamId(database, gameId);
  const employees = teamId ? await listTeamEmployees(database, teamId) : [];
  const compensation = await listEmployeeCompensation(
    database,
    employees.map((employee) => employee.id)
  );
  const assets = teamId ? await listTeamAssets(database, teamId) : [];
  const assetCosts = await listAssetCostsYearly(
    database,
    assets.map((asset) => asset.id)
  );
  const capacity = teamId ? await getCapacityForTeam(database, teamId) : null;
  const productionLine = await getProductionLine(database, capacity?.production_lines);
  const bom = await getBom(database, productionLine?.product_id);
  const bomParts = await listBomParts(database, bom?.id);

  return mapGameRowsToCbm({
    game,
    premises: await getPremises(database, gameId),
    premisesYearly: await listPremisesYearly(database, gameId),
    premisesPercentage: await getPremisesPercentage(database, gameId),
    premisesPercentageYearly: await listPremisesPercentageYearly(database, gameId),
    premisesDeprecations: await listPremisesDeprecations(database, gameId),
    premisesDeprecationsYearly: await listPremisesDeprecationsYearly(database, gameId),
    employees,
    compensation,
    assets,
    assetCosts,
    capacity,
    productionLine,
    bom,
    bomParts,
    services: await getExpenses(database, gameId),
    yearZeroDemand: await getYearZeroDemand(database, gameId),
    monthShares: await listMonthShares(database, gameId),
  });
}
