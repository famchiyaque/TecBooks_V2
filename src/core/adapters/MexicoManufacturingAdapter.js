/**
 * Mexico Manufacturing Excel Adapter
 * 
 * Specialized adapter for the Mexico Manufacturing Excel template.
 * This template has 8 sheets with specific structure for manufacturing businesses in Mexico.
 */

import { createEmptyBusinessModel } from '../models/BusinessModel.js';
import { sanitizeNumber } from '../models/schemas.js';

/**
 * Extract metadata from Welcome sheet
 * @param {Array} welcomeSheet - Welcome sheet data
 * @returns {Object}
 */
function extractMetadata(welcomeSheet) {
  const country = welcomeSheet[0]?.[1] || 'mexico'; // B1
  const businessType = welcomeSheet[0]?.[0] || 'manufacturing'; // A1
  const businessName = welcomeSheet[15]?.[2] || 'Unnamed Business'; // C16
  
  console.log('[MexicoManufacturingAdapter] Metadata:', { country, businessType, businessName });
  
  return {
    country,
    businessType,
    businessName,
  };
}

/**
 * Extract premises (financial assumptions) from 1_Premises sheet
 * @param {Array} premisesSheet - Premises sheet data
 * @returns {Object}
 */
function extractPremises(premisesSheet) {
  // Premises data starts at row 10 (index 9)
  // B10/C10 through B34/C34
  const premises = {
    interestRate: sanitizeNumber(premisesSheet[9]?.[2]), // C10
    inflationRate: sanitizeNumber(premisesSheet[10]?.[2]), // C11
    businessIncomeTax: sanitizeNumber(premisesSheet[11]?.[2]), // C12
    employeeShareOfProfit: sanitizeNumber(premisesSheet[12]?.[2]), // C13 (PTU)
    inventoryPercentage: sanitizeNumber(premisesSheet[13]?.[2]), // C14
    providerPercentage: sanitizeNumber(premisesSheet[14]?.[2]), // C15
    shortTermPassive: sanitizeNumber(premisesSheet[15]?.[2]), // C16
    directProductCosts: sanitizeNumber(premisesSheet[16]?.[2]), // C17
    indirectProductCosts: sanitizeNumber(premisesSheet[17]?.[2]), // C18
    salesExpenses: sanitizeNumber(premisesSheet[18]?.[2]), // C19
    administrationPercentage: sanitizeNumber(premisesSheet[19]?.[2]), // C20
    depreciationRates: {
      building: sanitizeNumber(premisesSheet[20]?.[2]), // C21
      machinery: sanitizeNumber(premisesSheet[21]?.[2]), // C22
      vehicle: sanitizeNumber(premisesSheet[22]?.[2]), // C23
      computerEquipment: sanitizeNumber(premisesSheet[23]?.[2]), // C24
    },
    machineryInstallationRate: sanitizeNumber(premisesSheet[24]?.[2]), // C25
    qualityImprovementRate: sanitizeNumber(premisesSheet[25]?.[2]), // C26
    utilizationRate: sanitizeNumber(premisesSheet[26]?.[2]), // C27
    laborBenefits: {
      imss: sanitizeNumber(premisesSheet[27]?.[2]), // C28
      infonavit: sanitizeNumber(premisesSheet[28]?.[2]), // C29
      valesDespensa: sanitizeNumber(premisesSheet[29]?.[2]), // C30
      aguinaldo: sanitizeNumber(premisesSheet[30]?.[2]), // C31
      fondoAhorro: sanitizeNumber(premisesSheet[31]?.[2]), // C32
      comedor: sanitizeNumber(premisesSheet[32]?.[2]), // C33
    },
  };
  
  console.log('[MexicoManufacturingAdapter] Premises extracted');
  return premises;
}

/**
 * Extract BOMs (Bills of Materials) from 2_BOMs sheet
 * @param {Array} bomsSheet - BOMs sheet data
 * @returns {Array}
 */
function extractBOMs(bomsSheet) {
  const boms = [];
  let currentRow = 10; // Start at row 11 (index 10)
  
  while (currentRow < bomsSheet.length) {
    const row = bomsSheet[currentRow];
    
    // Check if this is the start of a BOM block (has data in column B)
    if (row && row[1]) {
      const productName = bomsSheet[0]?.[2] || `Product ${boms.length + 1}`; // C1 has the name
      const salesPrice = sanitizeNumber(bomsSheet[10]?.[4]); // E11 has sales price
      
      const parts = [];
      let partRow = currentRow + 2; // Parts start 2 rows after block start (B13)
      
      // Read parts until empty row
      while (partRow < bomsSheet.length) {
        const partData = bomsSheet[partRow];
        
        // Empty row indicates end of this BOM
        if (!partData || !partData[1]) {
          break;
        }
        
        parts.push({
          name: partData[1] || '', // B column
          quantity: sanitizeNumber(partData[2]), // C column
          cost: sanitizeNumber(partData[3]), // D column
          subtotal: sanitizeNumber(partData[4]), // E column
        });
        
        partRow++;
      }
      
      if (parts.length > 0) {
        boms.push({
          name: productName,
          salesPrice,
          parts,
        });
      }
      
      // Move to next block (skip to after empty row)
      currentRow = partRow + 1;
    } else {
      currentRow++;
    }
  }
  
  console.log('[MexicoManufacturingAdapter] BOMs extracted:', boms.length);
  return boms;
}

/**
 * Extract assets from 3_Assets sheet
 * @param {Array} assetsSheet - Assets sheet data
 * @returns {Object}
 */
function extractAssets(assetsSheet) {
  const assets = {
    machinery: [],
    vehicles: [],
    buildings: [],
    computerEquipment: [],
  };
  
  // Machinery starts at B11/C11 (row 10, cols 1-2)
  let row = 10;
  while (row < assetsSheet.length && assetsSheet[row]?.[1]) {
    assets.machinery.push({
      name: assetsSheet[row][1],
      cost: sanitizeNumber(assetsSheet[row][2]),
    });
    row++;
  }
  
  // Vehicles at E11/F11 (row 10, cols 4-5)
  row = 10;
  while (row < assetsSheet.length && assetsSheet[row]?.[4]) {
    assets.vehicles.push({
      name: assetsSheet[row][4],
      cost: sanitizeNumber(assetsSheet[row][5]),
    });
    row++;
  }
  
  // Buildings at H11/I11 (row 10, cols 7-8)
  row = 10;
  while (row < assetsSheet.length && assetsSheet[row]?.[7]) {
    assets.buildings.push({
      name: assetsSheet[row][7],
      cost: sanitizeNumber(assetsSheet[row][8]),
    });
    row++;
  }
  
  // Computer Equipment at K11/L11 (row 10, cols 10-11)
  row = 10;
  while (row < assetsSheet.length && assetsSheet[row]?.[10]) {
    assets.computerEquipment.push({
      name: assetsSheet[row][10],
      cost: sanitizeNumber(assetsSheet[row][11]),
    });
    row++;
  }
  
  // Calculate totals
  assets.totalMachinery = assets.machinery.reduce((sum, item) => sum + item.cost, 0);
  assets.totalVehicles = assets.vehicles.reduce((sum, item) => sum + item.cost, 0);
  assets.totalBuildings = assets.buildings.reduce((sum, item) => sum + item.cost, 0);
  assets.totalComputerEquipment = assets.computerEquipment.reduce((sum, item) => sum + item.cost, 0);
  assets.totalAssets = assets.totalMachinery + assets.totalVehicles + assets.totalBuildings + assets.totalComputerEquipment;
  
  console.log('[MexicoManufacturingAdapter] Assets extracted:', {
    machinery: assets.machinery.length,
    vehicles: assets.vehicles.length,
    buildings: assets.buildings.length,
    computerEquipment: assets.computerEquipment.length,
    total: assets.totalAssets,
  });
  
  return assets;
}

/**
 * Extract production parameters from 4_Production sheet
 * @param {Array} productionSheet - Production sheet data
 * @returns {Object}
 */
function extractProduction(productionSheet) {
  const production = {
    qualityYield: sanitizeNumber(productionSheet[12]?.[2]), // C13
    unitsPerHour: sanitizeNumber(productionSheet[13]?.[2]), // C14
    hoursPerShift: sanitizeNumber(productionSheet[14]?.[2]), // C15
    numberOfShifts: sanitizeNumber(productionSheet[15]?.[2]), // C16
    numberOfLines: sanitizeNumber(productionSheet[16]?.[2]), // C17
    daysPerWeek: sanitizeNumber(productionSheet[17]?.[2]), // C18
    weeksPerMonth: sanitizeNumber(productionSheet[18]?.[2]), // C19
    monthsPerYear: sanitizeNumber(productionSheet[19]?.[2]), // C20
    firstYearDemand: {
      units: sanitizeNumber(productionSheet[23]?.[2]), // C24
      months: sanitizeNumber(productionSheet[23]?.[3]), // D24
    },
    firstFullYearDemand: {
      units: sanitizeNumber(productionSheet[24]?.[2]), // C25
      months: sanitizeNumber(productionSheet[24]?.[3]) || 12, // D25
    },
  };
  
  console.log('[MexicoManufacturingAdapter] Production extracted');
  return production;
}

/**
 * Extract workforce salaries from 5_Workforce sheet
 * @param {Array} workforceSheet - Workforce sheet data
 * @returns {Object}
 */
function extractWorkforce(workforceSheet) {
  const workforce = {
    directLaborSalaries: sanitizeNumber(workforceSheet[40]?.[3]), // D41
    indirectLaborSalaries: sanitizeNumber(workforceSheet[41]?.[3]), // D42
    engineeringSalaries: sanitizeNumber(workforceSheet[42]?.[3]), // D43
    administrativeSalaries: sanitizeNumber(workforceSheet[43]?.[3]), // D44
  };
  
  workforce.totalMonthlySalaries = 
    workforce.directLaborSalaries +
    workforce.indirectLaborSalaries +
    workforce.engineeringSalaries +
    workforce.administrativeSalaries;
  
  console.log('[MexicoManufacturingAdapter] Workforce extracted:', workforce.totalMonthlySalaries);
  return workforce;
}

/**
 * Extract expenses from 6_Expenses sheet
 * @param {Array} expensesSheet - Expenses sheet data
 * @returns {Array}
 */
function extractExpenses(expensesSheet) {
  const expenses = [];
  let row = 11; // Start at B12/C12 (row 11, cols 1-2)
  
  while (row < expensesSheet.length && expensesSheet[row]?.[1]) {
    expenses.push({
      name: expensesSheet[row][1],
      monthlyCost: sanitizeNumber(expensesSheet[row][2]),
    });
    row++;
  }
  
  console.log('[MexicoManufacturingAdapter] Expenses extracted:', expenses.length);
  return expenses;
}

/**
 * Extract financing from 7_Financing sheet
 * @param {Array} financingSheet - Financing sheet data
 * @returns {Object}
 */
function extractFinancing(financingSheet) {
  const financing = {
    initialInvestment: sanitizeNumber(financingSheet[10]?.[2]), // C11
    loan: {
      amount: sanitizeNumber(financingSheet[12]?.[2]), // C13
      periods: sanitizeNumber(financingSheet[12]?.[4]), // E13
      interestRate: sanitizeNumber(financingSheet[13]?.[2]), // C14
    },
  };
  
  console.log('[MexicoManufacturingAdapter] Financing extracted:', financing.initialInvestment);
  return financing;
}

/**
 * Main adapter function: Transform Mexico Manufacturing Excel to canonical model
 * @param {Object} excelData - Raw Excel data with sheets
 * @returns {Object} Canonical business model
 */
export function adaptMexicoManufacturingToBusinessModel(excelData) {
  console.log('[MexicoManufacturingAdapter] Starting transformation...');
  console.log('[MexicoManufacturingAdapter] Available sheets:', Object.keys(excelData));
  
  const model = createEmptyBusinessModel();
  
  try {
    // Extract metadata from Welcome sheet
    const metadata = extractMetadata(excelData.Welcome || excelData['Welcome']);
    model.metadata.name = metadata.businessName;
    model.metadata.type = metadata.businessType;
    model.metadata.country = metadata.country;
    model.metadata.source = 'mexico-manufacturing-excel';
    model.metadata.currency = 'MXN';
    
    // Extract premises from 1_Premises sheet
    model.premises = extractPremises(excelData['1_Premises']);
    
    // Extract BOMs from 2_BOMs sheet
    model.boms = extractBOMs(excelData['2_BOMs']);
    
    // Extract assets from 3_Assets sheet
    model.assets = extractAssets(excelData['3_Assets']);
    
    // Extract production from 4_Production sheet
    model.production = extractProduction(excelData['4_Production']);
    
    // Extract workforce from 5_Workforce sheet
    model.workforce = extractWorkforce(excelData['5_Workforce']);
    
    // Extract expenses from 6_Expenses sheet
    model.expenses = extractExpenses(excelData['6_Expenses']);
    
    // Extract financing from 7_Financing sheet
    model.financing = extractFinancing(excelData['7_Financing']);
    
    // Set project parameters for compatibility with existing engine
    model.project.initialInvestment = model.financing.initialInvestment;
    model.project.discountRate = model.premises.interestRate;
    
    console.log('[MexicoManufacturingAdapter] Transformation complete');
    console.log('[MexicoManufacturingAdapter] Summary:', getModelSummary(model));
    
    return model;
    
  } catch (error) {
    console.error('[MexicoManufacturingAdapter] Error during transformation:', error);
    throw error;
  }
}

/**
 * Helper to get model summary (imported from BusinessModel)
 */
function getModelSummary(model) {
  return {
    name: model.metadata.name,
    type: model.metadata.type,
    country: model.metadata.country,
    products: model.boms.length,
    totalAssets: model.assets.totalAssets,
    initialInvestment: model.financing.initialInvestment,
  };
}
