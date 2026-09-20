import computeInvestment from "@/sims/project-feasibility/income/computeInvestment";
import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest";
import computeProductionCost from "@/sims/project-feasibility/income/computeProductionCosts";
import { computeAdminExpenses } from "@/utils/dashboard/computeAdminExpenses.js";

function emptyProductionCosts() {
  return {
    total: {},
    costRawMaterials: {},
    workForce: {},
    adminExpenses: {},
  };
}

export default function useOutflows(project) {
  const adminExpenses = computeAdminExpenses(project);
  const { investment, total } = computeInvestment(project);
  const services = formatServices(project);
  const amortizationInterests = computeAmortizationInterest(total, project);
  const productionCosts =
    project?.timeline && project?.bom && project?.premises
      ? computeProductionCost(project)
      : emptyProductionCosts();
  const { yearAmortization, yearInterest } = amortizationInterests;

  const totalFinancialExpenses = Object.values(productionCosts.total).map(
    (yearTotal, idx) => {
      let financial = 0;
      if (yearAmortization.length > idx) {
        financial += yearAmortization[idx] + yearInterest[idx];
      }
      return yearTotal + financial;
    },
  );

  return {
    adminExpenses,
    investment: formatAssets(investment),
    services,
    amortizationInterests,
    totalFinancialExpenses,
  };
}

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

  return Object.entries(investments).map(([key, value]) => ({
    concept: pairName[key],
    amount: value,
  }));
}
