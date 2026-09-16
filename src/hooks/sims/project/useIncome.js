import computeProductionCost, {
  toCostPerWorkOrder,
} from "@/sims/project-feasibility/income/computeProductionCosts";
import { sumAnnualSalariesByTitle } from "@/sims/project-feasibility/income/sumAnnualSalariesByTitle";
import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";

function emptyIncome() {
  return {
    productionCosts: { total: {}, costRawMaterials: {}, workForce: {}, adminExpenses: {} },
    utilityCost: { 10: [], 20: [], 30: [] },
    competitivaPrice: [],
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

  const competitivaPrice = years.map((_, idx) => {
    return (
      project.bom.salePrice *
      Math.pow(1 + project.premises.nationalInflation[idx], idx)
    )
  })

  const sales = years.map((year, idx) => {
    return (competitivaPrice[idx] ?? 0) * (purchaseOrders[year] ?? 0)
  })

  const utilityCost = Object.values(productionCosts.total).reduce(
    (acc, yearTotal) => {
      acc[10].push(yearTotal * 1.1)
      acc[20].push(yearTotal * 1.2)
      acc[30].push(yearTotal * 1.3)
      return acc
    },
    { 10: [], 20: [], 30: [] },
  )

  return {
    productionCosts,
    utilityCost,
    competitivaPrice,
    sales,
  }
}

export default useIncome
