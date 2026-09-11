import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment";

const DOCUMENTS = 450000;
const PROVIDER = 0;

function computePassives(project) {
  const years = project.timeline.years;

  const { total } = computeInvestment(project);
  const { yearAmortization, yearInterest } = computeAmortizationInterest(
    total,
    project,
  );

  // Long term passives
  const longTermPassives = years.reduce((acc, year, idx) => {
    const pending = total - yearAmortization[idx] * (idx + 1);

    if (pending >= 0)
      acc[year] = {
        currentCapital: pending,
        interestsPayment: yearInterest[idx],
      };
    else
      acc[year] = {
        currentCapital: null,
        interestsPayment: null,
      };
    return acc;
  }, {});

  // Current Passives
  const currentPassives = years.reduce((acc, curr) => {
    acc[curr] = {
      documents: DOCUMENTS,
      provider: PROVIDER,
    };
    return acc;
  }, {});

  return { longTermPassives, currentPassives };
}

export default computePassives;
