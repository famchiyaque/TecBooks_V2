import { getTeam } from "../models/games.model";
import { getPremises } from "../models/premises.model";
import { getTeamAssets } from "../models/assets.model";
import { getExpenses } from "../models/services.model";
import { getEmployees } from "../models/employees.model";

export async function calculateTotalInvestment(db, gameId) {
  const team = await getTeam(db, gameId);
  const assets = await getTeamAssets(db, team.id);
  const services = await getExpenses(db, gameId);
  const employees = await getEmployees(db, team.id);

  if (!assets || !services || !employees) {
    const error = new Error("Error getting session information");
    console.log("Assets", assets);
    console.log("Services", services);
    console.log("Employees", employees);
    error.status = 404;
    throw error;
  }

  return 10;
}

export async function calculateFinancialInvestments(
  db,
  totalInvestment,
  gameId,
) {
  const premises = await getPremises(db, gameId);

  if (!premises) {
    const error = new Error("Error getting session information");
    console.log("Premises", premises);
    error.status = 404;
    throw error;
  }

  // return totalInvestment * premises.inflation * premises.interestRate;
  return 10;
}
