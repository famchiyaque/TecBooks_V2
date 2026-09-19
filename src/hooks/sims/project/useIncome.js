import computeProductionCost, {
  toCostPerWorkOrder,
} from "@/sims/project-feasibility/income/computeProductionCosts";
import { sumAnnualSalariesByTitle } from "@/sims/project-feasibility/income/sumAnnualSalariesByTitle";
import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";
import { computeNetSales } from "@/utils/dashboard/costCalculations";

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
  project = project?.cbm
  if (!project?.timeline || !project?.bom || !project?.premises) {
    return emptyIncome()
  }

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
