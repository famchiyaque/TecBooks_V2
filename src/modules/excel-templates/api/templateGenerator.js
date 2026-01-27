/**
 * Template Generator
 * 
 * Generates Excel templates dynamically by fetching real-time data
 * and updating cell values before download.
 */

import * as XLSX from 'xlsx';
import { fetchMexicoFinancialData } from './dataFetchers/mexicoDataFetcher';

/**
 * Load base template from public folder
 * @param {string} templatePath - Path to template file
 * @returns {Promise<XLSX.WorkBook>}
 */
async function loadBaseTemplate(templatePath) {
  const response = await fetch(templatePath);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  return workbook;
}

/**
 * Update cell value in worksheet
 * @param {XLSX.WorkSheet} worksheet 
 * @param {string} cellAddress - e.g., 'A1', 'B5'
 * @param {any} value 
 */
function updateCell(worksheet, cellAddress, value) {
  worksheet[cellAddress] = { v: value, t: typeof value === 'number' ? 'n' : 's' };
}

/**
 * Generate Manufacturing Mexico template with real-time data
 * @returns {Promise<Blob>}
 */
export async function generateManufacturingMexicoTemplate() {
  console.log('[TemplateGenerator] Generating Manufacturing Mexico template...');
  
  try {
    // Load base template
    const workbook = await loadBaseTemplate('/templates/manufacturing-mexico-template.xlsx');
    
    // Fetch real-time data
    const financialData = await fetchMexicoFinancialData();
    
    // Update Overview sheet with real-time data
    const overviewSheet = workbook.Sheets['Overview'];
    if (overviewSheet && financialData) {
      // Update inflation rate (example: cell H2)
      if (financialData.inflationRate) {
        updateCell(overviewSheet, 'H2', financialData.inflationRate);
      }
      
      // Update PTU rate (example: cell H3)
      if (financialData.ptuRate) {
        updateCell(overviewSheet, 'H3', financialData.ptuRate);
      }
      
      // Update minimum wage (example: cell H4)
      if (financialData.minimumWage) {
        updateCell(overviewSheet, 'H4', financialData.minimumWage);
      }
      
      // Update last updated date
      updateCell(overviewSheet, 'H5', new Date().toLocaleDateString('es-MX'));
    }
    
    // Add metadata sheet with data sources
    const metadataSheet = XLSX.utils.aoa_to_sheet([
      ['Template Metadata'],
      ['Generated:', new Date().toISOString()],
      ['Version:', '1.0.0'],
      ['Country:', 'Mexico'],
      ['Type:', 'Manufacturing'],
      [''],
      ['Real-time Data Sources:'],
      ['Inflation Rate:', financialData?.inflationRateSource || 'INEGI'],
      ['PTU Rate:', financialData?.ptuRateSource || 'SAT'],
      ['Minimum Wage:', financialData?.minimumWageSource || 'CONASAMI'],
    ]);
    workbook.Sheets['Metadata'] = metadataSheet;
    workbook.SheetNames.push('Metadata');
    
    // Convert to blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    console.log('[TemplateGenerator] Template generated successfully');
    return blob;
    
  } catch (error) {
    console.error('[TemplateGenerator] Error generating template:', error);
    // Fallback: return static template
    const response = await fetch('/templates/manufacturing-mexico-template.xlsx');
    return await response.blob();
  }
}

/**
 * Generate template by ID
 * @param {string} templateId 
 * @returns {Promise<Blob>}
 */
export async function generateTemplate(templateId) {
  switch (templateId) {
    case 'manufacturing-mexico':
      return await generateManufacturingMexicoTemplate();
    
    // Add more template generators here
    case 'services-mexico':
      // return await generateServicesMexicoTemplate();
      throw new Error('Services Mexico template not yet implemented');
    
    case 'retail-mexico':
      // return await generateRetailMexicoTemplate();
      throw new Error('Retail Mexico template not yet implemented');
    
    default:
      throw new Error(`Unknown template ID: ${templateId}`);
  }
}

/**
 * Trigger download of generated template
 * @param {Blob} blob 
 * @param {string} filename 
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
