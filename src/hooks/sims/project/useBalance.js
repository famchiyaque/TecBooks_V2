import computePassives from "@/sims/project-feasibility/balance/computePassives";
import computeEquity from "@/sims/project-feasibility/balance/computeEquity";
import computeActives from "@/sims/project-feasibility/balance/computeActives.js";

function useBalance(project) {
  project = project.cbm;
  const years = project.timeline.years;

  const actives = computeActives(project);
  const passives = computePassives(project);
  const utility = computeEquity(project);
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
