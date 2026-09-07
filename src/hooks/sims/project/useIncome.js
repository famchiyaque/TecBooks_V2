import computeProductionCost from "@/sims/project-feasibility/income/computeProductionCosts";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment";
import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest";

function useIncome(project) {
  project = project.cbm;

  const productionCosts = computeProductionCost(project);
  const { total } = computeInvestment(project);
  const amortizationInterests = computeAmortizationInterest(total, project);
  const { yearAmortization, yearInterest } = amortizationInterests;

  const totalFinancialExpenses = Object.values(productionCosts.total).map(
    (total, idx) => {
      let financial = 0;
      if (yearAmortization.length > idx) {
        financial += yearAmortization[idx] + yearInterest[idx];
      }
      return total + financial;
    },
  );

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
    amortizationInterests,
    totalFinancialExpenses,
    utilityCost,
    competitivaPrice,
  };
}

export default useIncome;
