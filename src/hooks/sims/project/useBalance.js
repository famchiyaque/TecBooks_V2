import computePassives from "@/sims/project-feasibility/balance/computePassives";
import computeActives from "@/sims/project-feasibility/balance/computeActives.js";

// Shareholder's equity is no longer computed here - Equity.jsx recomputes it
// itself, live, from the effective (override-aware) Current/Defered Actives
// and Current/Long term Passives tables instead of this hook's static values.
function useBalance(project) {
  project = project.cbm;

  const actives = computeActives(project);
  const passives = computePassives(project);

  return { actives, passives };
}

export default useBalance;
