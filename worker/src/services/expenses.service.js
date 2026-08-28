import { getTeam } from "../models/games.model";
import { getPremises } from "../models/premises.model";
import { getTeamAssetsTotalExpense } from "../models/assets.model";
import { getTotalExpenses } from "../models/services.model";
import { getEmployeesTotalSalaries } from "../models/employees.model";

// Retrieve session information of investment
// Calculate investment types and total investment
export async function calculateTotalInvestment(db, gameId) {
  const team = await getTeam(db, gameId);
  const assetExpenses = await getTeamAssetsTotalExpense(db, team.id);
  const serviceExpenses = await getTotalExpenses(db, gameId);
  const employeeExpenses = await getEmployeesTotalSalaries(db, team.id);

  if (!assetExpenses || !serviceExpenses || !employeeExpenses) {
    const error = new Error("Error getting session information");
    console.error("Assets", assetExpenses);
    console.error("Services", serviceExpenses);
    console.error("Employees", employeeExpenses);
    error.status = 404;
    throw error;
  }

  const investments = {
    assetExpenses,
    workforceCapital:
      serviceExpenses.serviceExpenses + employeeExpenses.employeeSalary,
  };

  return investments;
}

export async function calculateFinancialInvestments(
  db,
  totalInvestment,
  gameId,
) {
  const premises = await getPremises(db, gameId);

  if (!premises) {
    const error = new Error("Error getting session information");
    console.error("Premises", premises);
    error.status = 404;
    throw error;
  }

  let interest = new Array(premises.periods).fill(0);

  const amortization = totalInvestment / premises.periods;

  const rate = premises.national_leading_rate / 12;
  interest[0] = rate * totalInvestment;

  for (let i = 1; i < premises.periods - 12; i++) {
    totalInvestment -= amortization;
    interest[i] = rate * totalInvestment;
  }

  for (let i = premises.periods - 12; i < premises.periods; i++) {
    totalInvestment -= amortization;
    interest[i] = totalInvestment * premises.cpp;
  }

  const financialExpenses = {
    amortization: amortization * 12,
    interests: interest,
  };
  return financialExpenses;
}
