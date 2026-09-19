import computeFlow from "@/sims/project-feasibility/flow/computeFlow.js";

function useFlow(project) {
  project = project.cbm;
  const flow = computeFlow(project);

  return flow;
}

export default useFlow;
