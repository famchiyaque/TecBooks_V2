import computeCirculatingActives from "./computeCirculatingActives.js";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment.js";
import computeDeferedActives from "./computeDeferedActives.js";

function computeActives(project) {
  const years = project.timeline.years;
  console.log(project.preimses);

  const circulatingActive = computeCirculatingActives(project);
  const { investments } = computeInvestment(project);

  // Fixed assets

  const deferedActives = computeDeferedActives(project);
}

export default computeActives;
