import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs.js";
import computeProductionCosts from "@/sims/project-feasibility/income/computeProductionCosts.js";

function computeSales(project) {
  const { production } = cbmToCostTableInputs(project);
  const { costRawMaterials } = computeProductionCosts(project);

  const saleIncome = Object.entries(production.purchaseOrders).reduce(
    (acc, [key, value]) => {
      acc[key] = value * costRawMaterials[key];
      return acc;
    },
    {},
  );

  return saleIncome;
}

export default computeSales;
