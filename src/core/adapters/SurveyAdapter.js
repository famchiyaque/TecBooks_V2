/**
 * Survey Adapter
 * 
 * Transforms survey/questionnaire data into the canonical business model format.
 * This adapter will process data from the TecBooks survey form.
 */

import { createEmptyBusinessModel } from '../models/BusinessModel.js';
import { sanitizeNumber } from '../models/schemas.js';

/**
 * Transform survey data to canonical business model
 * @param {Object} surveyData - Data from survey Redux store
 * @returns {Object} Canonical business model
 */
export function adaptSurveyToBusinessModel(surveyData) {
  console.log('[SurveyAdapter] Starting transformation to canonical model');
  
  const model = createEmptyBusinessModel();
  
  // TODO: Implement based on actual survey structure
  // This is a stub that shows the expected transformation pattern
  
  model.metadata.name = surveyData.businessName || 'Unnamed Business';
  model.metadata.type = surveyData.businessType || 'general';
  model.metadata.source = 'survey';
  model.metadata.country = surveyData.country || 'mexico';
  
  // The survey generates an Excel file, so this adapter might actually
  // just be a pass-through to the Excel adapter after the Excel is generated
  // OR it could transform the survey state directly before Excel generation
  
  console.log('[SurveyAdapter] Transformation complete (stub)');
  
  return model;
}

/**
 * Check if survey data is complete enough to generate a business model
 * @param {Object} surveyData - Data from survey
 * @returns {boolean}
 */
export function isSurveyDataComplete(surveyData) {
  // TODO: Implement validation logic
  return surveyData && surveyData.businessName;
}
