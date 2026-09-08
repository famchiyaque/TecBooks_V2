import computeInvestment from "@/sims/project-feasibility/income/computeInvestment.js";
import computeFlow from "@/sims/project-feasibility/flow/computeFlow.js";
import computeDeferedActives from "@/sims/project-feasibility/balance/computeDeferedActives";
import computeCircularPassive from "@/sims/project-feasibility/balance/computeCircularPassive";
import computeLongTermPassive from "@/sims/project-feasibility/balance/computeLongTermPassive";
import computeUtility from "@/sims/project-feasibility/balance/computeUtility";

function useBalance(project) {
  project = project.cbm;

  const flow = computeFlow(project);
  const investments = computeInvestment(project);
  const deferedActives = computeDeferedActives(project);
  const circularPassives = computeCircularPassive(project);
  const longTermPassive = computeLongTermPassive(project);
  const utility = computeUtility(project);
  // utility["heritage"] ? actives - passives - utility.acumUtility - utility.periodUtility

  const actives = { investments, deferedActives };
  const passives = { circularPassives, longTermPassive };

  return { flow, actives, passives, utility };
}

export default useBalance;
