import capacity from "../models/capacity.model";
export async function getCapacity(db, programId, projectId) {
  return await capacity.getCapacity(db, programId, projectId);
}
