/**
 * Mexico Manufacturing Excel Adapter
 * 
 * Specialized adapter for the Mexico Manufacturing Excel template.
 * This template has 8 sheets with specific structure for manufacturing businesses in Mexico.
 */

import { createEmptyBusinessModel } from '../../models/dashboard/BusinessModel.js';
import { sanitizeNumber } from '../../models/dashboard/schemas.js';
import {
  deriveBOMSalesPriceAndCost,
  deriveDemand,
  deriveProduction,
  deriveWorkforceSalaries,
  deriveAssetsDepreciation,
  deriveExpenses,
  deriveFinancingPayments,
} from '../dashboard/index.js';

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
  // B10/C10 through B36/C36 (added CETES and Reward Margin at B15/C15 and B16/C16)
  const premises = {
    interestRate: sanitizeNumber(premisesSheet[10]?.[2]), // C11
    inflationRate: sanitizeNumber(premisesSheet[11]?.[2]), // C12
    businessIncomeTax: sanitizeNumber(premisesSheet[12]?.[2]), // C13
    employeeShareOfProfit: sanitizeNumber(premisesSheet[13]?.[2]), // C14 (PTU)
    cetes: sanitizeNumber(premisesSheet[14]?.[2]), // C15 - NEW
    rewardMargin: sanitizeNumber(premisesSheet[15]?.[2]), // C16 - NEW
    inventoryPercentage: sanitizeNumber(premisesSheet[16]?.[2]), // C17 (shifted down)
    providerPercentage: sanitizeNumber(premisesSheet[17]?.[2]), // C18 (shifted down)
    shortTermPassive: sanitizeNumber(premisesSheet[18]?.[2]), // C19 (shifted down)
    directProductCosts: sanitizeNumber(premisesSheet[19]?.[2]), // C20 (shifted down)
    indirectProductCosts: sanitizeNumber(premisesSheet[20]?.[2]), // C21 (shifted down)
    salesExpenses: sanitizeNumber(premisesSheet[21]?.[2]), // C22 (shifted down)
    administrationPercentage: sanitizeNumber(premisesSheet[22]?.[2]), // C23 (shifted down)
    depreciationRates: {
      building: sanitizeNumber(premisesSheet[23]?.[2]), // C24 (shifted down)
      machinery: sanitizeNumber(premisesSheet[24]?.[2]), // C25 (shifted down)
      vehicle: sanitizeNumber(premisesSheet[25]?.[2]), // C26 (shifted down)
      computerEquipment: sanitizeNumber(premisesSheet[26]?.[2]), // C27 (shifted down)
    },
    machineryInstallationRate: sanitizeNumber(premisesSheet[27]?.[2]), // C28 (shifted down)
    qualityImprovementRate: sanitizeNumber(premisesSheet[28]?.[2]), // C29 (shifted down)
    utilizationRate: sanitizeNumber(premisesSheet[29]?.[2]), // C30 (shifted down)
    laborBenefits: {
      imss: sanitizeNumber(premisesSheet[30]?.[2]), // C31 (shifted down)
      infonavit: sanitizeNumber(premisesSheet[31]?.[2]), // C32 (shifted down)
      valesDespensa: sanitizeNumber(premisesSheet[32]?.[2]), // C33 (shifted down)
      aguinaldo: sanitizeNumber(premisesSheet[33]?.[2]), // C34 (shifted down)
      fondoAhorro: sanitizeNumber(premisesSheet[34]?.[2]), // C35 (shifted down)
      comedor: sanitizeNumber(premisesSheet[35]?.[2]), // C36 (shifted down)
    },
  };
  
  // Calculate TREMA (discount rate): CETES + Reward Margin + Inflation
  premises.trema = premises.cetes + premises.rewardMargin + premises.inflationRate;
  
  console.log('[MexicoManufacturingAdapter] Premises extracted, TREMA:', premises.trema);
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
      const productName = bomsSheet[currentRow]?.[2] || `Product ${boms.length + 1}`; // C1 has the name
      const salesPrice = sanitizeNumber(bomsSheet[currentRow]?.[4]); // E11 has sales price
      
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
  
  // Machinery starts at B13/C13 (row 12, cols 1-2)
  let row = 12;
  while (row < assetsSheet.length && assetsSheet[row]?.[1]) {
    assets.machinery.push({
      name: assetsSheet[row][1],
      cost: sanitizeNumber(assetsSheet[row][2]),
      amount: 1,
    });
    row++;
  }
  
  // Vehicles at E13/F13 (row 12, cols 4-5)
  row = 12;
  while (row < assetsSheet.length && assetsSheet[row]?.[4]) {
    assets.vehicles.push({
      name: assetsSheet[row][4],
      cost: sanitizeNumber(assetsSheet[row][5]),
      amount: 1,
    });
    row++;
  }
  
  // Buildings at H13/I13 (row 12, cols 7-8)
  row = 12;
  while (row < assetsSheet.length && assetsSheet[row]?.[7]) {
    assets.buildings.push({
      name: assetsSheet[row][7],
      cost: sanitizeNumber(assetsSheet[row][8]),
      amount: 1,
    });
    row++;
  }
  
  // Computer Equipment at K13/L13 (row 12, cols 10-11)
  row = 12;
  while (row < assetsSheet.length && assetsSheet[row]?.[10]) {
    assets.computerEquipment.push({
      name: assetsSheet[row][10],
      cost: sanitizeNumber(assetsSheet[row][11]),
      amount: 1,
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
    directLaborSalaries: Math.round(sanitizeNumber(workforceSheet[40]?.[3])), // D41
    indirectLaborSalaries: Math.round(sanitizeNumber(workforceSheet[41]?.[3])), // D42
    engineeringSalaries: Math.round(sanitizeNumber(workforceSheet[42]?.[3])), // D43
    administrativeSalaries: Math.round(sanitizeNumber(workforceSheet[43]?.[3])), // D44
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
  const initialInvestment = sanitizeNumber(financingSheet[10]?.[2]); // C11
  
  // Extract loans (currently supporting one loan, can be extended to multiple)
  const loans = [];
  
  // First loan at row 13-14
  const loanAmount = sanitizeNumber(financingSheet[12]?.[2]); // C13
  const loanPeriods = sanitizeNumber(financingSheet[13]?.[4]); // E13 - loan duration in months
  const loanInterestRate = sanitizeNumber(financingSheet[13]?.[2]); // C14
  const loanStartPeriod = sanitizeNumber(financingSheet[12]?.[4]) || 0; // E14 - period when loan starts
  
  if (loanAmount > 0) {
    loans.push({
      name: 'Bank Loan',
      amount: loanAmount,
      periods: loanPeriods,
      rate: loanInterestRate,
      period: loanStartPeriod,
    });
  }
  
  // Future: Can add more loans from additional rows if needed
  
  console.log('[MexicoManufacturingAdapter] Financing extracted:', { initialInvestment, loans: loans.length });
  return {
    initialInvestment,
    loans,
  };
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
    // ===== PHASE 1: Extract Inputs =====
    
    // Extract metadata from Welcome sheet
    const metadata = extractMetadata(excelData.Welcome || excelData['Welcome']);
    model.metadata.name = metadata.businessName;
    model.metadata.type = metadata.businessType;
    model.metadata.country = metadata.country;
    model.metadata.source = 'mexico-manufacturing-excel';
    model.metadata.currency = 'MXN';
    model.metadata.startDate = new Date().toISOString(); // Default to now
    
    // Extract premises from 1_Premises sheet
    model.premises = extractPremises(excelData['1_Premises']);
    model.premises.forecastWindowSize = 5; // Default window size for statistical forecasts
    
    // Extract BOMs from 2_BOMs sheet
    const bomsData = extractBOMs(excelData['2_BOMs']);
    model.boms = {
      availableForecastingMethods: ['inflation'],
      forecastingMethod: 'inflation',
      products: bomsData,
    };

    // Extract production from 4_Production sheet
    const productionData = extractProduction(excelData['4_Production']);
    model.production = {
      availableForecastingMethods: ['log'],
      forecastingMethod: 'log',
      lines: [{
        name: 'Production Line',
        qualityYield: productionData.qualityYield,
        qualityImprovementRate: model.premises.qualityImprovementRate || 0,
        utilizationRate: model.premises.utilizationRate || 0.85,
        // processes: [{
        //   name: 'Primary Process',
        //   unitsPerHour: productionData.unitsPerHour,
        // }],
        unitsPerHour: productionData.unitsPerHour,
        numberOfShifts: productionData.numberOfShifts,
        hoursPerShift: productionData.hoursPerShift,
        daysPerWeek: productionData.daysPerWeek,
        weeksPerYear: productionData.weeksPerMonth * 12,
      }],
    };

    // Set demand - distribute units across months using monthly tendency
    const monthlyTendency = [0.02, 0.02, 0.04, 0.08, 0.1, 0.13, 0.15, 0.12, 0.11, 0.1, 0.06, 0.07];
    
    // Year Zero Demand: distribute units across the months they occur
    const yearZeroMonths = productionData.firstYearDemand.months;
    const yearZeroUnits = productionData.firstYearDemand.units;
    const yearZeroTendencySum = monthlyTendency.slice(0, yearZeroMonths).reduce((sum, t) => sum + t, 0);
    const yearZeroAnnualized = yearZeroUnits / yearZeroTendencySum;
    
    const yearZeroDemand = [];
    for (let i = 0; i < yearZeroMonths; i++) {
      yearZeroDemand.push({
        month: i + 1,
        orders: Math.round(yearZeroAnnualized * monthlyTendency[i])
      });
    }
    
    // First Full Year Demand: distribute across all 12 months
    const firstFullYearUnits = productionData.firstFullYearDemand.units;
    const firstFullYearDemand = [];
    for (let i = 0; i < 12; i++) {
      firstFullYearDemand.push({
        month: i + 1,
        orders: Math.round(firstFullYearUnits * monthlyTendency[i])
      });
    }
    
    model.demand = {
      availableForecastingMethods: ['slr', 'dlr', 'sma', 'dma', 'ses', 'des', 'winters'],
      ordersForecastMethod: 'sma',
      monthlyTendency,
      previousYearsDemand: firstFullYearDemand,
      yearZeroDemand,
      firstFullYearDemand: [],
    };

    // Extract assets from 3_Assets sheet
    const assetsData = extractAssets(excelData['3_Assets']);
    model.assets = {
      categories: ['machinery', 'vehicles', 'buildings', 'computerEquipment', 'furniture'],
      assets: [
        ...assetsData.machinery.map(a => ({ ...a, category: 'machinery' })),
        ...assetsData.vehicles.map(a => ({ ...a, category: 'vehicles' })),
        ...assetsData.buildings.map(a => ({ ...a, category: 'buildings' })),
        ...assetsData.computerEquipment.map(a => ({ ...a, category: 'computerEquipment' })),
      ],
      totalAssets: assetsData.totalAssets,
    };
    
    // Extract workforce from 5_Workforce sheet
    const workforceData = extractWorkforce(excelData['5_Workforce']);
    model.workforce = {
      availableForecastingMethods: ['inflation'],
      forecastingMethod: 'inflation',
      categories: ['direct', 'indirect', 'engineering', 'administrative'],
      directLaborSalaries: workforceData.directLaborSalaries,
      indirectLaborSalaries: workforceData.indirectLaborSalaries,
      engineeringSalaries: workforceData.engineeringSalaries,
      administrativeSalaries: workforceData.administrativeSalaries,
      totalMonthlySalaries: workforceData.totalMonthlySalaries,
      // employees: [
      //   { title: 'Direct Labor', category: 'direct', amount: 1, baseSalary: workforceData.directLaborSalaries, laborBenefits: model.premises.laborBenefits },
      //   { title: 'Indirect Labor', category: 'indirect', amount: 1, baseSalary: workforceData.indirectLaborSalaries, laborBenefits: model.premises.laborBenefits },
      //   { title: 'Engineering', category: 'engineering', amount: 1, baseSalary: workforceData.engineeringSalaries, laborBenefits: model.premises.laborBenefits },
      //   { title: 'Administrative', category: 'administrative', amount: 1, baseSalary: workforceData.administrativeSalaries, laborBenefits: model.premises.laborBenefits },
      // ],
    };
    
    // Extract expenses from 6_Expenses sheet
    const expensesData = extractExpenses(excelData['6_Expenses']);
    model.expenses = {
      availableForecastingMethods: ['inflation', 'static', 'production'],
      forecastingMethod: 'inflation',
      fixedExpenses: expensesData.map(e => ({ name: e.name, cost: e.monthlyCost })),
      variableExpenses: [],
    };
    
    // Extract financing from 7_Financing sheet
    const financingData = extractFinancing(excelData['7_Financing']);
    model.financing = financingData;
    
    // ===== PHASE 2: Generate Timeline =====
    
    const projectYears = 10;
    const totalMonths = projectYears * 12;
    const startDate = new Date(model.metadata.startDate);
    
    model.timeline = {
      months: [],
      periods: [],
      startMonth: 0,
      endMonth: totalMonths - 1,
      totalMonths: totalMonths,
    };
    
    // Generate month labels and period numbers
    for (let i = 0; i < totalMonths; i++) {
      const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      model.timeline.months.push(monthLabel);
      model.timeline.periods.push(i + 1);
    }
    
    console.log('[MexicoManufacturingAdapter] Timeline generated:', totalMonths, 'months');
    
    // ===== PHASE 3: Calculate Derived Values =====
    
    console.log('[MexicoManufacturingAdapter] Calculating derived values...');
    
    // Derive BOMs (sales price and cost with inflation)
    model.bomsDerived = deriveBOMSalesPriceAndCost(
      model.boms.products,
      totalMonths,
      model.premises.inflationRate,
      model.boms.forecastingMethod
    );
    
    // Derive demand (purchase orders using forecasting method)
    model.demandDerived = deriveDemand(
      model.demand,
      totalMonths,
      model.boms.products,
      model.premises.forecastWindowSize || 5
    );
    
    // Derive production (capacity, quality, work orders)
    model.productionDerived = deriveProduction(
      model.production.lines,
      totalMonths,
      model.premises.qualityImprovementRate || 0,
      model.production.forecastingMethod || 'log',
      model.demandDerived
    );
    
    // Derive workforce salaries
    model.workforceDerived = deriveWorkforceSalaries(
      model.workforce,
      totalMonths,
      model.premises.inflationRate,
      model.workforce.forecastingMethod || 'inflation'
    );
    
    // Derive asset depreciation
    model.assetsDerived = deriveAssetsDepreciation(
      model.assets,
      model.premises,
      totalMonths,
      startDate
    );
    
    // Derive expenses
    model.expensesDerived = deriveExpenses(
      model.expenses.fixedExpenses,
      model.expenses.variableExpenses,
      model.expenses.forecastingMethod,
      totalMonths,
      model.premises.inflationRate,
      null // No production scaling for now
    );
    
    // Derive financing payments
    model.financingDerived = deriveFinancingPayments(
      model.financing.loans || [],
      totalMonths
    );
    
    console.log('[MexicoManufacturingAdapter] Derived values calculated');
    
    // ===== PHASE 4: Calculate Cash Flows =====
    
    console.log('[MexicoManufacturingAdapter] Calculating cash flows...');
    
    // Calculate inflows and outflows for each period
    model.cashFlows = {
      inflows: [],
      outflows: [],
      netCashFlow: [],
      cumulativeCashFlow: [],
    };
    
    let cumulativeCash = 0;
    
    for (let month = 0; month < totalMonths; month++) {
      // INFLOWS
      let inflow = 0;
      
      // 1. Sales revenue = purchaseOrders * salesPrice
      if (model.demandDerived[0] && model.bomsDerived[0]) {
        const purchaseOrders = model.demandDerived[0].purchaseOrders[month] || 0;
        const salesPrice = model.bomsDerived[0].salesPrice[month] || 0;
        inflow += purchaseOrders * salesPrice;
      }
      
      // 2. Loan disbursements (in the period the loan was taken)
      for (const loan of model.financingDerived) {
        // Check if this is the loan start period (remaining goes from 0 to loan amount)
        if (month > 0 && loan.remaining[month] > 0 && loan.remaining[month - 1] === 0) {
          inflow += loan.remaining[month];
        } else if (month === 0 && loan.remaining[month] > 0) {
          inflow += loan.remaining[month];
        }
      }
      
      model.cashFlows.inflows.push(Math.round(inflow * 100) / 100);
      
      // OUTFLOWS
      let outflow = 0;
      
      // 1. Production costs = workOrders * totalCost
      if (model.productionDerived[0] && model.bomsDerived[0]) {
        const workOrders = model.productionDerived[0].workOrders[month] || 0;
        const totalCost = model.bomsDerived[0].totalCost[month] || 0;
        outflow += workOrders * totalCost;
      }
      
      // 2. All salaries
      outflow += model.workforceDerived.directLaborSalaries[month] || 0;
      outflow += model.workforceDerived.indirectLaborSalaries[month] || 0;
      outflow += model.workforceDerived.engineeringSalaries[month] || 0;
      outflow += model.workforceDerived.administrativeSalaries[month] || 0;
      
      // 3. Asset purchases (in the period they were purchased, assumed all in period 0)
      if (month === 0) {
        for (const asset of model.assets.assets) {
          const assetCost = sanitizeNumber(asset.cost) * sanitizeNumber(asset.amount);
          outflow += assetCost;
        }
      }
      
      // 4. All expenses
      for (const expense of model.expensesDerived) {
        outflow += expense.cost[month] || 0;
      }
      
      // 5. Loan payments (amortization + interest)
      for (const loan of model.financingDerived) {
        outflow += loan.amortization[month] || 0;
        outflow += loan.interest[month] || 0;
      }
      
      model.cashFlows.outflows.push(Math.round(outflow * 100) / 100);
      
      // NET CASH FLOW
      const netCashFlow = inflow - outflow;
      model.cashFlows.netCashFlow.push(Math.round(netCashFlow * 100) / 100);
      
      // CUMULATIVE CASH FLOW
      cumulativeCash += netCashFlow;
      model.cashFlows.cumulativeCashFlow.push(Math.round(cumulativeCash * 100) / 100);
    }
    
    console.log('[MexicoManufacturingAdapter] Cash flows calculated');
    
    // Set project parameters for compatibility
    model.project.initialInvestment = model.financing.initialInvestment;
    model.project.discountRate = model.premises.trema; // Use TREMA as discount rate
    
    console.log('[MexicoManufacturingAdapter] Transformation complete');
    
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
