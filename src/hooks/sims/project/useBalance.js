import computeInvestment from "@/sims/project-feasibility/income/computeInvestment.js";
import computeDeferedActives from "@/sims/project-feasibility/balance/computeDeferedActives";
import computePassives from "@/sims/project-feasibility/balance/computePassives";
import computeLongTermPassive from "@/sims/project-feasibility/balance/computeLongTermPassive";
import computeUtility from "@/sims/project-feasibility/balance/computeUtility";
import computeActives from "@/sims/project-feasibility/balance/computeActives.js";

function useBalance(project) {
  project = project.cbm;
  const years = project.timeline.years;

  const actives = computeActives(project);
  const passives = computePassives(project);
  const utility = computeUtility(project);
  // utility["heritage"] ? actives - passives - utility.acumUtility - utility.periodUtility

  return { actives, passives, utility };
}

function mockFills(years) {
  return years.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});
}

export default useBalance;
