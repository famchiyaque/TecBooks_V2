import computeInvestment from "@/sims/project-feasibility/income/computeInvestment";
import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest";

export default function useExpenses(project) {
  const adminExpenses = calculateAdminExpenses(project);
  const { investment, total } = computeInvestment(project);
  const services = formatServices(project);
  const amortizationInterests = computeAmortizationInterest(total, project);

  return {
    adminExpenses,
    investment: formatAssets(investment),
    services,
    amortizationInterests,
  };
}

/* ---------------- Administrative Expenses ---------------- */

/**
 * Sums monthly service costs as the year-0 base, then compounds it
 * forward using each year's actual national inflation rate.
 */
function calculateAdminExpenses(project) {
  const years = project?.timeline?.years ?? [];
  const inflationRates = project?.premises?.nationalInflation ?? [];
  const services = project?.services ?? [];

  const baseAmount = services.reduce(
    (sum, service) => sum + (service?.monthlyAmount ?? 0),
    0,
  );

  const adminExpensesAll = {};
  let running = baseAmount;

  years.forEach((year, idx) => {
    if (idx === 0) {
      adminExpensesAll[year] = baseAmount;
      return;
    }
    const rate = inflationRates[idx] ?? 0;
    running *= 1 + rate;
    adminExpensesAll[year] = running;
  });

  return adminExpensesAll;
}

/* ---------------- Services Table ---------------- */

function formatServices(project) {
  const items = project?.services;
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    category: item.category,
    subcategory: item.subcategory,
    description: item.description,
    monthlyRange: item.monthlyAmount,
    notes: item.notes ?? null,
  }));
}

function formatAssets(investments) {
  const pairName = {
    buildings: "Building",
    compute: "Computer Equipment",
    machines: "Machinery and Equipment",
    transport: "Transportation",
    employeeExpenses: "Working Capital",
    civilWork: "Civil Work",
  };

  console.log(investments);

  investments = Object.entries(investments).map(([key, value]) => ({
    concept: pairName[key],
    amount: value,
  }));

  return investments;
}
