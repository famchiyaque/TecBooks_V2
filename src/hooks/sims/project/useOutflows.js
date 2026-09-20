import { computeOutflows } from "@/sims/project-feasibility/expenses/computeOutflows";

export default function useOutflows(project) {
  return computeOutflows(project);
}
