import computeProductionCost from "@/sims/project-feasibility/income/computeProductionCosts";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment";
import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest";

function useIncome(project) {
  project = project.cbm;
  const periods = project.timeline.financingPeriods;
  const interestRate = project.premises.nationalLeadingRate;

  const productionCosts = computeProductionCost(project);
  const { total } = computeInvestment(project);
  const amortizationInterest = computeAmortizationInterest(
    total,
    periods,
    interestRate,
  );
  console.log("Amortization Interest", amortizationInterest);

  return { productionCosts };
}

export default useIncome;
