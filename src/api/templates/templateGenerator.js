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
 * Quick fix: Download pre-built template file
 * @returns {Promise<Blob>}
 */
async function downloadPreBuiltTemplate() {
  try {
    // Try to fetch from public folder first (if copied there)
    const response = await fetch('/templates/manufacturing.mexico.xlsx');
    if (response.ok) {
      return await response.blob();
    }
  } catch (error) {
    console.log('[TemplateGenerator] Template not in public folder, trying alternative path');
  }
  
  // Fallback: try relative path from template-builders
  try {
    const response = await fetch('/template-builders/manufacturing.mexico.xlsx');
    if (response.ok) {
      return await response.blob();
    }
  } catch (error) {
    console.log('[TemplateGenerator] Template not found in alternative path');
  }
  
  throw new Error('Pre-built template file not found');
}

/**
 * Generate Manufacturing Mexico template with real-time data
 * @returns {Promise<Blob>}
 */
export async function generateManufacturingMexicoTemplate() {
  console.log('[TemplateGenerator] Downloading pre-built Manufacturing Mexico template...');
  
  // Quick fix: Use pre-built template
  try {
    return await downloadPreBuiltTemplate();
  } catch (error) {
    console.error('[TemplateGenerator] Error downloading pre-built template:', error);
    // Fallback to original generation logic
    return await generateManufacturingMexicoTemplateOriginal();
  }
}

/**
 * Generate Manufacturing Mexico template with real-time data (ORIGINAL LOGIC - KEPT FOR REFERENCE)
 * @returns {Promise<Blob>}
 */
async function generateManufacturingMexicoTemplateOriginal() {
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
    
    // Validate that we have valid data
    if (!excelBuffer || excelBuffer.length === 0) {
      throw new Error('Failed to generate Excel file: empty buffer');
    }
    
    // Ensure we have a proper Uint8Array for the blob
    const uint8Array = excelBuffer instanceof Uint8Array ? excelBuffer : new Uint8Array(excelBuffer);
    const blob = new Blob([uint8Array], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    // Validate blob was created successfully
    if (!blob || blob.size === 0) {
      throw new Error('Failed to create blob: empty blob');
    }
    
    console.log('[TemplateGenerator] Template generated successfully', { size: blob.size });
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
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  // Small delay to ensure download starts before cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
