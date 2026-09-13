import { buildCostOfSales } from "@/sims/project-feasibility/costTable/buildCostOfSales.js";
import computePassives from "@/sims/project-feasibility/balance/computePassives.js";
import computeTotalActives from "@/sims/project-feasibility/balance/computeTotalActives.js";

function computeEquity(project) {
  const years = project.timeline.years;
  const { costOfSalesByYear } = buildCostOfSales(project);

  const periodUtility = years.reduce((acc, year, idx) => {
    acc[year] = costOfSalesByYear[idx].netIncome;
    return acc;
  }, {});

  const acumUtility = years.reduce((acc, year, idx) => {
    if (idx == 0) acc[year] = 0;
    else acc[year] = periodUtility[year - 1] + periodUtility[year];
    return acc;
  }, {});

  const totalActives = computeTotalActives(project);

  const { totalPassives } = computePassives(project);

  const legacy = Object.entries(periodUtility).reduce((acc, [year, value]) => {
    acc[year] =
      totalActives[year] - totalPassives[year] - value - acumUtility[year];
    return acc;
  }, {});

  const totalEquity = Object.entries(legacy).reduce((acc, [year, value]) => {
    acc[year] = value + acumUtility[year] + periodUtility[year];
    return acc;
  }, {});

  return { periodUtility, acumUtility, legacy, totalEquity };
}

export default computeEquity;
