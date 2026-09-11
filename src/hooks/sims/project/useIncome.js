import computeProductionCost from "@/sims/project-feasibility/income/computeProductionCosts";

function emptyIncome() {
  return {
    productionCosts: { total: {}, costRawMaterials: {}, workForce: {}, adminExpenses: {} },
    utilityCost: { 10: [], 20: [], 30: [] },
    competitivaPrice: [],
  }
}

function useIncome(project) {
  project = project?.cbm
  if (!project?.timeline || !project?.bom || !project?.premises) {
    return emptyIncome()
  }

  const productionCosts = computeProductionCost(project);

  const utilityCost = Object.values(productionCosts.total).reduce(
    (acc, yearTotal) => {
      acc[10].push(yearTotal * 0.1);
      acc[20].push(yearTotal * 0.2);
      acc[30].push(yearTotal * 0.3);
      return acc;
    },
    { 10: [], 20: [], 30: [] },
  );

  const competitivaPrice = Object.values(productionCosts.total).map(
    (_, idx) => {
      return (
        project.bom.salePrice *
        Math.pow(1 + project.premises.nationalInflation[idx], idx)
      );
    },
  );

  return {
    productionCosts,
    utilityCost,
    competitivaPrice,
  };
}

export default useIncome;
