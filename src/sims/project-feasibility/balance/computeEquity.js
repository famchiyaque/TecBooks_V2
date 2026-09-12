import buildCostOfSales from "@/sims/project-feasibility/costTable/buildCostOfSales.js";
import computePassives from "@/sims/project-feasibility/balance/computePassives.js";

function computeEquity(project) {
  const years = project.timeline.years;
  const { incomeStatementByYear } = buildCostOfSales(project);

  const periodUtility = years.reduce((acc, year, idx) => {
    acc[year] = incomeStatementByYear[idx].netIncome;
    return periodUtility;
  }, {});

  const acumUtility = years.reduce((acc, year, idx) => {
    if (idx == 0) acc[year] = 0;
    else acc[year] = periodUtility[year - 1] + periodUtility[year];
    return acc;
  }, {});

  const totalActives = computeTotalActives();
  const { totalPassives } = computePassives(project);

  const legacy = periodUtility.reduce((acc, [year, value]) => {
    acc[year] =
      totalActives[year] - totalPassives[year] - value - acumUtility[year];
    return acc;
  }, {});

  const totalEquity = legacy.reduce((acc, [year, value]) => {
    acc[year] = value + acumUtility[year] + peroidUtility[year];
  }, {});

  return { periodUtility, acumUtility, legacy };
}

export default computeEquity;
