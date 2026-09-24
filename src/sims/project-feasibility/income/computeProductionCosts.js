import {
  computeRawMaterialCost,
  computeAdminExpenses,
  computeWorkforceAnualSalaries,
} from "@/utils/dashboard/costCalculations";
import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ComputeProductionCosts");

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

  const result = { costRawMaterials, workForce, adminExpenses, total };
  logger.debug("computeProductionCost", result);
  return result;
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
 * Costs per Unit: yearly totals ÷ purchase orders (COs). Raw materials
 * yearly total is work orders × BOM, so this equals BOM / quality yield.
 * Labor uses annual category totals (12 × monthly × headcount), inflated
 * by year, then ÷ purchase orders — not the shared
 * computeWorkforceAnualSalaries path (Outflows). Admin from
 * computeAdminExpenses is monthly; ×12 here only so Inflows Unit Costs
 * stay annual without changing the shared helper (see technical-debt.md).
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
  const denominators = {};

  years.forEach((year, yearIndex) => {
    const purchaseOrders = production?.purchaseOrders?.[year] || 0;
    const workOrders = workOrdersForYear(production, year);
    const perPurchaseOrder = (annual) =>
      purchaseOrders === 0 ? 0 : annual / purchaseOrders;
    const inflation = inflationFactor(premises, yearIndex);

    denominators[year] = { customerOrders: purchaseOrders, workOrders };

    costRawMaterials[year] = perPurchaseOrder(
      productionCosts.costRawMaterials?.[year] ?? 0,
    );
    const annualAdmin = (productionCosts.adminExpenses?.[year] ?? 0) * 12;
    adminExpenses[year] = perPurchaseOrder(annualAdmin);

    workForce[year] = Object.fromEntries(
      Object.entries(annualSalaries ?? {}).map(([type, amount]) => [
        type,
        perPurchaseOrder((amount ?? 0) * inflation),
      ]),
    );

    total[year] =
      costRawMaterials[year] +
      adminExpenses[year] +
      Object.values(workForce[year]).reduce((sum, val) => sum + val, 0);
  });

  console.log("[Unit Costs] work orders vs customer orders", denominators);
  console.log(
    "[Unit Costs] yearly admin expenses (before ÷ purchase orders)",
    Object.fromEntries(
      Object.entries(productionCosts.adminExpenses ?? {}).map(([year, monthly]) => [
        year,
        { monthly, annual: monthly * 12 },
      ]),
    ),
  );

  const result = { costRawMaterials, workForce, adminExpenses, total };
  logger.debug("toCostPerWorkOrder", result);
  return result;
}
