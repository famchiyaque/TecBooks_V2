import premisesModel from "../models/premises.model";

export async function getPremises(db, programId, projectId) {
  return await premisesModel.getPremises(db, programId, projectId);
}
