import {
  computeRawMaterialCost,
  computeAdminExpenses,
  computeWorkforceAnualSalaries,
} from "@/utils/dashboard/costCalculations";
import { cbmToCostTableInputs } from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";

// Compute all costs and total and reduce to a single component
export default function computeProductionCost(project) {
  const cbm = cbmToCostTableInputs(project);

  const costRawMaterials = computeRawMaterialCost(cbm.production);
  const workForce = computeWorkforceAnualSalaries(project, cbm);
  const adminExpenses = computeAdminExpenses(project);

  const total = Object.keys(costRawMaterials).reduce((acc, curr) => {
    acc[curr] =
      costRawMaterials[curr] +
      adminExpenses[curr] +
      Object.values(workForce[curr]).reduce((acc, val) => acc + val, 0);
    return acc;
  }, {});

  return { costRawMaterials, workForce, adminExpenses, total };
}
