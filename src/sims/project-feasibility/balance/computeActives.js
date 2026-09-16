import computeCurrentActives from "./computeCurrentActives.js";
import computeInvestment from "@/sims/project-feasibility/income/computeInvestment.js";
import computeDeferedActives from "./computeDeferedActives.js";
import { computeFixedAssetsByCategory, computeFixedAssetsTotal } from "./computeFixedAssets.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ComputeActives");

function computeActives(project) {
  const years = project.timeline.years;

  const currentActives = computeCurrentActives(project);
  const { investment } = computeInvestment(project);

  const fixedAssetsByCategory = computeFixedAssetsByCategory(project, years);
  const fixedAssets = computeFixedAssetsTotal(fixedAssetsByCategory, years);

  const deferedActives = computeDeferedActives(project);

  const result = { currentActives, investment, fixedAssetsByCategory, fixedAssets, deferedActives };
  logger.debug("computeActives", result);
  return result;
}

export default computeActives;
