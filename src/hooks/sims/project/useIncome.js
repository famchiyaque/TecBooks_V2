import { useSelector } from "react-redux";
import computeProductionCost, {
  toCostPerWorkOrder,
} from "@/sims/project-feasibility/income/computeProductionCosts";
import { sumAnnualSalariesByTitle } from "@/sims/project-feasibility/income/sumAnnualSalariesByTitle";
import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";
import { applyDerivedBase } from "@/sims/project-feasibility/model/applyDerivedBase";
import { HORIZON_YEARS } from "@/sims/project-feasibility/constants";
import { computeNetSales } from "@/utils/dashboard/costCalculations";
import { capacityLineEditsSlice } from "@/store/costTable.store";

/**
 * Applies Capacity Line edits (CapacityLineTable, capacityLineEditsSlice) on
 * top of the parsed project, then re-derives annualCapacityByYear/qualityYield
 * so a Quality Yield/Shifts/etc. edit is instantly reflected in Customer
 * Orders - same relationship the original Excel had (Capacidad -> Ingresos).
 */
function applyCapacityLineOverrides(project, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return project;

  const line = { ...project.capacity.line };
  let changed = false;
  Object.entries(overrides).forEach(([key, value]) => {
    const [field, yearStr] = key.split(":");
    const index = HORIZON_YEARS.indexOf(Number(yearStr));
    if (index === -1 || !(field in line)) return;
    line[field] = [...(line[field] ?? [])];
    line[field][index] = value;
    changed = true;
  });
  if (!changed) return project;

  const withOverrides = { ...project, capacity: { ...project.capacity, line } };
  applyDerivedBase(withOverrides);
  return withOverrides;
}

function emptyIncome() {
  return {
    productionCosts: { total: {}, costRawMaterials: {}, workForce: {}, adminExpenses: {} },
    utilityCost: { 10: [], 20: [], 30: [] },
    competitivaPrice: [],
    customerOrders: [],
    sales: [],
  }
}

function useIncome(project) {
  const capacityLineOverrides = useSelector(capacityLineEditsSlice.selectOverrides)
  project = project?.cbm
  if (!project?.timeline || !project?.bom || !project?.premises) {
    return emptyIncome()
  }
  project = applyCapacityLineOverrides(project, capacityLineOverrides)

  const inputs = cbmToCostTableInputs(project)
  const production = inputs.production
  const productionCosts = toCostPerWorkOrder(
    computeProductionCost(project),
    production,
    sumAnnualSalariesByTitle(inputs.employees),
    project.premises,
  )
  const years = Object.keys(productionCosts.total)
    .map(Number)
    .sort((a, b) => a - b)
  const purchaseOrders = production?.purchaseOrders ?? {}

  // RF-44: the unit price is NOT recomputed here. cbmToCostTableInputs'
  // projectSalesPrice is the single source of truth - it compounds the BOM
  // price with each year's own inflation rate, and it is the same series
  // computeNetSales uses for the Income Statement. Recomputing it locally as
  // salePrice * (1 + inflation[idx])^idx diverged from that whenever the
  // inflation series was not flat, so Inflows and the Income Statement could
  // report different sales for one project.
  const salesPricePerUnit = production?.salesPricePerUnit ?? {}
  const competitivaPrice = years.map((year) => salesPricePerUnit[year] ?? 0)

  const customerOrders = years.map((year) => purchaseOrders[year] ?? 0)

  // RF-44: total income = CO x unit price, per year. Delegated to the same
  // computeNetSales the Income Statement runs on, so both can't drift.
  const netSalesByYear = computeNetSales(production)
  const sales = years.map((year) => netSalesByYear[year] ?? 0)

  const utilityCost = years.reduce(
    (acc, year) => {
      const unitCost = productionCosts.total[year] ?? 0
      acc[10].push(unitCost / (1 - 0.1))
      acc[20].push(unitCost / (1 - 0.2))
      acc[30].push(unitCost / (1 - 0.3))
      return acc
    },
    { 10: [], 20: [], 30: [] },
  )

  return {
    productionCosts,
    utilityCost,
    competitivaPrice,
    customerOrders,
    sales,
  }
}

export default useIncome
