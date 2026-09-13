import {
  computeRawMaterialCost,
  computeAdminExpenses,
  computeWorkforceAnualSalaries,
} from "@/utils/dashboard/costCalculations";
import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";

export default function computeProductionCost(project) {
  const cbm = cbmToCostTableInputs(project);

  const costRawMaterials = computeRawMaterialCost(cbm.production);
  const workForce = computeWorkforceAnualSalaries(project, cbm);
  const adminExpenses = computeAdminExpenses(project);

  const total = Object.keys(costRawMaterials).reduce((acc, curr) => {
    acc[curr] =
      costRawMaterials[curr] +
      adminExpenses[curr] +
      Object.values(workForce[curr]).reduce((acc, val) => acc + val, 0);
    return acc;
  }, {});

  return { costRawMaterials, workForce, adminExpenses, total };
}

function workOrdersForYear(production, year) {
  const yieldRate = production?.qualityYield?.[year] || 0;
  if (yieldRate === 0) return 0;
  return (production?.purchaseOrders?.[year] || 0) / yieldRate;
}

function inflationFactor(premises, yearIndex) {
  return Math.pow(
    1 + (premises?.nationalInflation?.[yearIndex] ?? 0),
    yearIndex,
  );
}

/**
 * Costs per Unit: yearly MP and admin ÷ work orders (purchase orders /
 * quality yield). Labor uses annual category totals (12 × monthly ×
 * headcount), inflated by year, then ÷ work orders — not the shared
 * computeWorkforceAnualSalaries path, which divides by customer orders.
 */
export function toCostPerWorkOrder(
  productionCosts,
  production,
  annualSalaries,
  premises,
) {
  const years = Object.keys(productionCosts?.total ?? {});
  const costRawMaterials = {};
  const adminExpenses = {};
  const workForce = {};
  const total = {};

  years.forEach((year, yearIndex) => {
    const workOrders = workOrdersForYear(production, year);
    const perWorkOrder = (annual) =>
      workOrders === 0 ? 0 : annual / workOrders;
    const inflation = inflationFactor(premises, yearIndex);

    costRawMaterials[year] = perWorkOrder(
      productionCosts.costRawMaterials?.[year] ?? 0,
    );
    adminExpenses[year] = perWorkOrder(
      productionCosts.adminExpenses?.[year] ?? 0,
    );

    workForce[year] = Object.fromEntries(
      Object.entries(annualSalaries ?? {}).map(([type, amount]) => [
        type,
        perWorkOrder((amount ?? 0) * inflation),
      ]),
    );

    total[year] =
      costRawMaterials[year] +
      adminExpenses[year] +
      Object.values(workForce[year]).reduce((sum, val) => sum + val, 0);
  });

  return { costRawMaterials, workForce, adminExpenses, total };
}
