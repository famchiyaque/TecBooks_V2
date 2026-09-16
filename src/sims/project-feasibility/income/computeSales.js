import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs.js";
import computeProductionCosts from "@/sims/project-feasibility/income/computeProductionCosts.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ComputeSales");

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

  logger.debug("computeSales", { saleIncome });
  return saleIncome;
}

export default computeSales;
