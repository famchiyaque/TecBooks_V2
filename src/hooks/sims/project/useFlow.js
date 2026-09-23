import { computeCashBalanceByYear } from "@/sims/project-feasibility/costTable/cashFlowCalculations.js";

function useFlow(project) {
  const cbm = project.cbm;
  const { endingBalanceByYear } = computeCashBalanceByYear(cbm);

  return { netFlow: endingBalanceByYear };
}

export default useFlow;
