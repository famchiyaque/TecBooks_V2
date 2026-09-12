import computePassives from "@/sims/project-feasibility/balance/computePassives";
import computeEquity from "@/sims/project-feasibility/balance/computeEquity";
import computeActives from "@/sims/project-feasibility/balance/computeActives.js";

function useBalance(project) {
  project = project.cbm;
  const years = project.timeline.years;

  const actives = computeActives(project);
  const passives = computePassives(project);
  const equity = computeEquity(project);

  return { actives, passives, equity };
}

function mockFills(years) {
  return years.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});
}

export default useBalance;
