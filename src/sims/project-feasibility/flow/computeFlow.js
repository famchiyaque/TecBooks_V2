import computeSales from "../income/computeSales";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment.js";
import { buildCostOfSales } from "@/sims/project-feasibility/costTable/buildCostOfSales.js";
import { cbmToOperatingExpenseInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs.js";
import { getAnnualCashOutflowsTotal } from "./yearOutflows.js";

function computeFlow(project) {
  // TODO: initial balance should be extracted from the creation data / project
  const INITIAL_BALANCE = 1000000;

  const sales = computeSales(project);
  const { total } = computeInvestment(project);

  const years = project.timeline.years;

  const initialBalance = {};
  const longTermLoan = mockFills(years);

  // TODO: Short term loans and other income (Not in the template)
  const _periodIncome = mockFills(years);
  const _shortTermIncome = mockFills(years);
  const _otherIncome = mockFills(years);

  initialBalance[years[0]] = INITIAL_BALANCE;
  longTermLoan[years[0]] = total;

  const costOfSales = buildCostOfSales(project);
  const opx = cbmToOperatingExpenseInputs(project, years);

  const totalExpenses = getAnnualCashOutflowsTotal(costOfSales, opx);
  Object.entries(totalExpenses).forEach(([year, amount]) => {
    if (year != years.at(-1)) initialBalance[year + 1] = amount;
  });

  // [years[0]]: initialBalance[0] + longTermLoan[0] + sales[0],

  const totalIncome = Object.entries(initialBalance).reduce(
    (acc, [year, amount]) => {
      acc[year] = amount + longTermLoan[year] + sales[year];
      return acc;
    },
    {},
  );

  const netFlow = Object.entries(totalIncome).reduce((acc, [year, amount]) => {
    acc[year] = amount - totalExpenses[year];
    return acc;
  }, {});

  return { totalIncome, totalExpenses, netFlow };
}

function mockFills(years) {
  return years.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});
}

export default computeFlow;
