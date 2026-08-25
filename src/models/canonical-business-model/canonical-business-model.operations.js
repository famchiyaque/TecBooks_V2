/**
 * Merges additional data into an existing business model
 * @param {Object} model
 * @param {Object} additionalData
 * @returns {Object}
 */
export function mergeAdditionalData(model, additionalData) {
  return {
    ...model,
    additionalData: {
      ...model.additionalData,
      ...additionalData,
    },
  }
}

/**
 * Gets a summary of the business model for debugging
 * @param {Object} model
 * @returns {Object}
 */
export function getModelSummary(model) {
  return {
    businessName: model.metadata?.name,
    type: model.metadata?.type,
    country: model.metadata?.country,
    source: model.metadata?.source,
    months: model.timeline?.totalMonths || model.timeline?.months?.length || 0,
    hasBOMs: (model.boms?.products?.length || 0) > 0,
    hasAssets: (model.assets?.assets?.length || 0) > 0 || model.assets?.totalAssets > 0,
    hasFinancing: model.financing?.initialInvestment > 0,
    numberOfProducts: model.boms?.products?.length || 0,
    totalAssets: model.assets?.totalAssets || 0,
  }
}
