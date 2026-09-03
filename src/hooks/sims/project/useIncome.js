import {
  computeRawMaterialCost,
  sumSalariesByCategory,
} from "@/utils/dashboard/costCalculations";
import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";

function useIncome(project) {
  project = project.cbm;
  console.log(project);
  const { employees, production, premises } = cbmToCostTableInputs(project);

  const timelineArr = Array.from(
    { length: project.timeline.endYear - project.timeline.startYear + 1 },
    (_, i) => project.timeline.startYear + i,
  );

  const costRawMaterials = computeRawMaterialCost(production);
  const workForce = sumSalariesByCategory(employees);
  const adminExpenses = calculateAdminExpenses(
    project.services,
    project.premises,
    timelineArr,
  );

  return { costRawMaterials, workForce, adminExpenses };
}

function calculateAdminExpenses(services, premises, timeline) {
  const adminExpensesFirst = services.reduce((acc, curr) => {
    return (acc += curr.monthlyAmount);
  }, 0);

  const adminExpensesAll = timeline.reduce((acc, curr, idx) => {
    acc[curr] =
      adminExpensesFirst * Math.pow(1 - premises.nationalInflation[idx], idx);
    return acc;
  }, {});

  return adminExpensesAll;
}

export default useIncome;
