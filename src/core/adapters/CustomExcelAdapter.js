/**
 * Custom Excel Builder Adapter
 * 
 * Transforms custom excel builder questionnaire data into the canonical business model format.
 * This adapter will process data from the TecBooks custom excel builder form.
 */

import { createEmptyBusinessModel } from '../models/BusinessModel.js';
import { sanitizeNumber } from '../models/schemas.js';

/**
 * Transform custom excel builder data to canonical business model
 * @param {Object} customExcelData - Data from custom excel builder Redux store
 * @returns {Object} Canonical business model
 */
export function adaptCustomExcelToBusinessModel(customExcelData) {
  console.log('[CustomExcelAdapter] Starting transformation to canonical model');
  
  const model = createEmptyBusinessModel();
  
  // TODO: Implement based on actual custom excel builder structure
  // This is a stub that shows the expected transformation pattern
  
  model.metadata.name = customExcelData.businessName || 'Unnamed Business';
  model.metadata.type = customExcelData.businessType || 'general';
  model.metadata.source = 'custom-excel-builder';
  model.metadata.country = customExcelData.country || 'mexico';
  
  // The custom excel builder generates an Excel file, so this adapter might actually
  // just be a pass-through to the Excel adapter after the Excel is generated
  // OR it could transform the builder state directly before Excel generation
  
  console.log('[CustomExcelAdapter] Transformation complete (stub)');
  
  return model;
}

/**
 * Check if custom excel builder data is complete enough to generate a business model
 * @param {Object} customExcelData - Data from custom excel builder
 * @returns {boolean}
 */
export function isCustomExcelDataComplete(customExcelData) {
  // TODO: Implement validation logic
  return customExcelData && customExcelData.businessName;
}

// Legacy function names for backward compatibility
export const adaptSurveyToBusinessModel = adaptCustomExcelToBusinessModel;
export const isSurveyDataComplete = isCustomExcelDataComplete;
