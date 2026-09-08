import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";
import { getInflation } from "@/utils/dashboard/costCalculations.js";

function rawMaterialPartData(project) {
  const { production } = cbmToCostTableInputs(project);
  const years = project.timeline.years;

  const yearProductionCost = years.reduce((acc, year, idx) => {
    acc[year] =
      project.derivedBase.bomMaterialCost * getInflation(project.premises, idx);
    return acc;
  }, {});

  const WO = years.reduce((acc, year, idx) => {
    acc[year] = production.purchaseOrders / production.qualityYield[year];
    return acc;
  }, {});

  const anualRawMaterialCost = yearProductionCost.reduce(
    (acc, [year, amount], idx) => {
      acc[year] = amount * WO[year];
      return acc;
    },
    {},
  );

  return { yearProductionCost, WO, anualRawMaterialCost };
}

export default rawMaterialPartData;
