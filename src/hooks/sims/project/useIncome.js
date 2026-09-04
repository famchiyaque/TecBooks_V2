import computeProductionCost from "@/sims/project-feasibility/income/computeProductionCosts";

function useIncome(project) {
  project = project.cbm;
  const productionCosts = computeProductionCost(project);

  return { productionCosts };
}

export default useIncome;
