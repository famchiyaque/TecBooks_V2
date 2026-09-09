import computeCurrentActives from "./computeCurrentActives.js";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment.js";
import computeDeferedActives from "./computeDeferedActives.js";

function computeActives(project) {
  const years = project.timeline.years;

  const currentActives = computeCurrentActives(project);
  const { investments } = computeInvestment(project);

  // Fixed assets

  const deferedActives = computeDeferedActives(project);

  return { currentActives };
}

export default computeActives;
