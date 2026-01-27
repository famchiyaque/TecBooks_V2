/**
 * Manufacturing Projections Engine
 * 
 * Calculates financial projections for manufacturing businesses including:
 * - Production capacity and demand forecasting
 * - Annual cashflows over multiple years
 * - NPV, IRR, ROI, and break-even analysis
 * - Multi-lifetime optimization
 */

/**
 * 1. Calculate annual production capacity (without quality consideration)
 * @param {Object} production - Production parameters
 * @returns {number} Annual capacity in units
 */
export function calculateAnnualCapacity(production) {
  const {
    unitsPerHour,
    hoursPerShift,
    numberOfShifts,
    numberOfLines,
    daysPerWeek,
    weeksPerMonth,
    monthsPerYear,
  } = production;

  const capacity = 
    unitsPerHour *
    hoursPerShift *
    numberOfShifts *
    numberOfLines *
    daysPerWeek *
    weeksPerMonth *
    monthsPerYear;

  console.log('[ManufacturingProjections] Annual capacity:', capacity);
  return capacity;
}

/**
 * 2. Project purchase orders using selected method
 * @param {number} firstYearDemand - Initial demand in first full year
 * @param {number} inflationRate - Annual inflation rate
 * @param {number} years - Number of years to project
 * @param {string} method - Projection method ('inflation', 'linear', 'statistical')
 * @returns {Array<number>} Projected purchase orders for each year
 */
export function projectPurchaseOrders(firstYearDemand, inflationRate, years, method = 'inflation') {
  const purchaseOrders = [0]; // Year 0 has no purchase orders

  // Year 1 starts with first full year demand
  for (let year = 1; year <= years; year++) {
    let demand;

    switch (method) {
      case 'inflation':
        // Demand grows with inflation
        demand = firstYearDemand * Math.pow(1 + inflationRate, year - 1);
        break;
      
      case 'linear':
        // TODO: Implement linear growth
        demand = firstYearDemand * (1 + (inflationRate * (year - 1)));
        break;
      
      case 'statistical':
        // TODO: Implement time series analysis
        demand = firstYearDemand * Math.pow(1 + inflationRate, year - 1);
        break;
      
      default:
        demand = firstYearDemand * Math.pow(1 + inflationRate, year - 1);
    }

    purchaseOrders.push(Math.round(demand));
  }

  console.log('[ManufacturingProjections] Purchase orders projected:', purchaseOrders.length - 1, 'years');
  return purchaseOrders;
}

/**
 * 3. Project work orders based on purchase orders and improving quality
 * @param {Array<number>} purchaseOrders - Projected purchase orders
 * @param {number} initialQualityYield - Initial quality yield (0-1)
 * @param {number} qualityImprovementRate - Annual improvement rate
 * @param {number} years - Number of years
 * @returns {Object} { workOrders: Array, qualityYields: Array }
 */
export function projectWorkOrders(purchaseOrders, initialQualityYield, qualityImprovementRate, years) {
  const workOrders = [0]; // Year 0
  const qualityYields = [initialQualityYield]; // Year 0 uses base quality

  for (let year = 1; year <= years; year++) {
    // Quality improves each year
    const qualityYield = initialQualityYield * Math.pow(1 + qualityImprovementRate, year - 1);
    qualityYields.push(qualityYield);

    // Work orders = purchase orders / quality yield
    const wo = purchaseOrders[year] / qualityYield;
    workOrders.push(Math.round(wo));
  }

  console.log('[ManufacturingProjections] Work orders projected');
  return { workOrders, qualityYields };
}

/**
 * 4. Calculate asset depreciation for each category
 * @param {Object} assets - Assets object with machinery, vehicles, buildings, computerEquipment
 * @param {Object} depreciationRates - Depreciation rates for each category
 * @param {number} years - Number of years
 * @returns {Object} Depreciation arrays for each category
 */
export function calculateAssetDepreciation(assets, depreciationRates, years) {
  const depreciation = {
    machinery: [],
    vehicles: [],
    buildings: [],
    computerEquipment: [],
    total: [],
  };

  // Calculate total costs
  const totalMachinery = assets.machinery.reduce((sum, item) => sum + item.cost, 0);
  const totalVehicles = assets.vehicles.reduce((sum, item) => sum + item.cost, 0);
  const totalBuildings = assets.buildings.reduce((sum, item) => sum + item.cost, 0);
  const totalComputers = assets.computerEquipment.reduce((sum, item) => sum + item.cost, 0);

  // Annual depreciation is constant for each category
  const annualMachineryDep = totalMachinery * depreciationRates.machinery;
  const annualVehiclesDep = totalVehicles * depreciationRates.vehicle;
  const annualBuildingsDep = totalBuildings * depreciationRates.building;
  const annualComputersDep = totalComputers * depreciationRates.computerEquipment;
  const annualTotalDep = annualMachineryDep + annualVehiclesDep + annualBuildingsDep + annualComputersDep;

  // Year 0 has no depreciation (assets just purchased)
  depreciation.machinery.push(0);
  depreciation.vehicles.push(0);
  depreciation.buildings.push(0);
  depreciation.computerEquipment.push(0);
  depreciation.total.push(0);

  // Years 1+ have constant depreciation
  for (let year = 1; year <= years; year++) {
    depreciation.machinery.push(annualMachineryDep);
    depreciation.vehicles.push(annualVehiclesDep);
    depreciation.buildings.push(annualBuildingsDep);
    depreciation.computerEquipment.push(annualComputersDep);
    depreciation.total.push(annualTotalDep);
  }

  console.log('[ManufacturingProjections] Depreciation calculated:', annualTotalDep, 'per year');
  return {
    depreciation,
    totals: {
      machinery: totalMachinery,
      vehicles: totalVehicles,
      buildings: totalBuildings,
      computerEquipment: totalComputers,
    },
  };
}

/**
 * 5. Calculate loan amortization and interest schedule
 * @param {number} loanAmount - Total loan amount
 * @param {number} periods - Number of monthly periods
 * @param {number} annualRate - Annual interest rate
 * @returns {Object} { annualAmortization: Array, annualInterest: Array }
 */
export function calculateLoanSchedule(loanAmount, periods, annualRate) {
  if (!loanAmount || loanAmount === 0 || !periods) {
    return {
      annualAmortization: [],
      annualInterest: [],
      totalYears: 0,
    };
  }

  const monthlyRate = annualRate / 12;
  const monthlyAmortization = loanAmount / periods;

  let remainingDebt = loanAmount;
  const monthlyInterestPayments = [];

  // Calculate monthly interest for each period
  for (let month = 1; month <= periods; month++) {
    const monthlyInterest = remainingDebt * monthlyRate;
    monthlyInterestPayments.push(monthlyInterest);
    remainingDebt -= monthlyAmortization;
  }

  // Aggregate to annual values
  const totalYears = Math.ceil(periods / 12);
  const annualAmortization = [];
  const annualInterest = [];

  annualAmortization.push(0); // Year 0
  annualInterest.push(0); // Year 0

  for (let year = 1; year <= totalYears; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = Math.min(year * 12, periods);
    
    // Annual amortization: 12 months (or remaining months)
    const monthsInYear = endMonth - startMonth;
    annualAmortization.push(monthlyAmortization * monthsInYear);
    
    // Annual interest: sum of monthly interest for this year
    const yearInterest = monthlyInterestPayments
      .slice(startMonth, endMonth)
      .reduce((sum, val) => sum + val, 0);
    annualInterest.push(yearInterest);
  }

  console.log('[ManufacturingProjections] Loan schedule calculated:', totalYears, 'years');
  return {
    annualAmortization,
    annualInterest,
    totalYears,
  };
}

/**
 * 6. Project salaries with inflation
 * @param {Object} workforce - Workforce salaries object
 * @param {number} inflationRate - Annual inflation rate
 * @param {number} years - Number of years
 * @returns {Object} Projected salaries for each category
 */
export function projectSalaries(workforce, inflationRate, years) {
  const {
    directLaborSalaries,
    indirectLaborSalaries,
    engineeringSalaries,
    administrativeSalaries,
  } = workforce;

  const projectedSalaries = {
    directLabor: [0], // Year 0
    indirectLabor: [0],
    engineering: [0],
    administrative: [0],
    total: [0],
  };

  for (let year = 1; year <= years; year++) {
    const inflationMultiplier = Math.pow(1 + inflationRate, year - 1);
    
    // Monthly salaries × 12 months × inflation
    const directAnnual = directLaborSalaries * 12 * inflationMultiplier;
    const indirectAnnual = indirectLaborSalaries * 12 * inflationMultiplier;
    const engineeringAnnual = engineeringSalaries * 12 * inflationMultiplier;
    const administrativeAnnual = administrativeSalaries * 12 * inflationMultiplier;
    
    projectedSalaries.directLabor.push(directAnnual);
    projectedSalaries.indirectLabor.push(indirectAnnual);
    projectedSalaries.engineering.push(engineeringAnnual);
    projectedSalaries.administrative.push(administrativeAnnual);
    projectedSalaries.total.push(
      directAnnual + indirectAnnual + engineeringAnnual + administrativeAnnual
    );
  }

  console.log('[ManufacturingProjections] Salaries projected');
  return projectedSalaries;
}

/**
 * 7. Project expenses with inflation
 * @param {Array} expenses - Array of expense objects { name, monthlyCost }
 * @param {number} inflationRate - Annual inflation rate
 * @param {number} years - Number of years
 * @returns {Array<number>} Annual projected expenses
 */
export function projectExpenses(expenses, inflationRate, years) {
  const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.monthlyCost, 0);
  const projectedExpenses = [0]; // Year 0

  for (let year = 1; year <= years; year++) {
    const inflationMultiplier = Math.pow(1 + inflationRate, year - 1);
    const annualExpenses = totalMonthlyExpenses * 12 * inflationMultiplier;
    projectedExpenses.push(annualExpenses);
  }

  console.log('[ManufacturingProjections] Expenses projected');
  return projectedExpenses;
}

/**
 * 8. Project raw material costs
 * @param {Array} boms - Bills of materials
 * @param {Array<number>} workOrders - Projected work orders
 * @param {number} inflationRate - Annual inflation rate
 * @param {number} years - Number of years
 * @returns {Array<number>} Annual raw material costs
 */
export function projectRawMaterialCosts(boms, workOrders, inflationRate, years) {
  // Calculate base BOM cost (sum of all parts for all products)
  const baseBOMCost = boms.reduce((sum, bom) => {
    const bomCost = bom.parts.reduce((partSum, part) => partSum + part.subtotal, 0);
    return sum + bomCost;
  }, 0);

  const projectedCosts = [0]; // Year 0

  for (let year = 1; year <= years; year++) {
    const inflationMultiplier = Math.pow(1 + inflationRate, year - 1);
    const cost = baseBOMCost * inflationMultiplier * workOrders[year];
    projectedCosts.push(cost);
  }

  console.log('[ManufacturingProjections] Raw material costs projected');
  return projectedCosts;
}

/**
 * 9. Project revenue
 * @param {Array} boms - Bills of materials
 * @param {Array<number>} purchaseOrders - Projected purchase orders
 * @param {number} inflationRate - Annual inflation rate
 * @param {number} years - Number of years
 * @returns {Array<number>} Annual revenue
 */
export function projectRevenue(boms, purchaseOrders, inflationRate, years) {
  // Use sales price from BOMs
  const baseSalesPrice = boms.reduce((sum, bom) => sum + bom.salesPrice, 0);
  
  const projectedRevenue = [0]; // Year 0

  for (let year = 1; year <= years; year++) {
    const inflationMultiplier = Math.pow(1 + inflationRate, year - 1);
    const revenue = baseSalesPrice * inflationMultiplier * purchaseOrders[year];
    projectedRevenue.push(revenue);
  }

  console.log('[ManufacturingProjections] Revenue projected');
  return projectedRevenue;
}

/**
 * 10. Calculate machinery installation cost (one-time, Year 0)
 * @param {Array} machineryAssets - Array of machinery assets
 * @param {number} installationRate - Installation rate
 * @returns {number} Total installation cost
 */
export function calculateMachineryInstallationCost(machineryAssets, installationRate) {
  const totalMachineryCost = machineryAssets.reduce((sum, item) => sum + item.cost, 0);
  const installationCost = totalMachineryCost * installationRate;
  
  console.log('[ManufacturingProjections] Machinery installation cost:', installationCost);
  return installationCost;
}

/**
 * 11. Calculate annual cashflows including Year 0
 * @param {Object} projections - All projection data
 * @param {number} initialInvestment - Initial investment
 * @param {number} loanAmount - Loan amount
 * @param {number} totalAssetCosts - Total cost of all assets
 * @param {number} machineryInstallationCost - Machinery installation cost
 * @returns {Object} { inflows, outflows, netCashflows, cumulativeCashflows }
 */
export function calculateAnnualCashflows(
  projections,
  initialInvestment,
  loanAmount,
  totalAssetCosts,
  machineryInstallationCost
) {
  const {
    revenue,
    rawMaterialCosts,
    salaries,
    expenses,
    depreciation,
    loanPayments,
  } = projections;

  const years = revenue.length - 1; // Exclude Year 0
  const inflows = [];
  const outflows = [];
  const netCashflows = [];
  const cumulativeCashflows = [];

  let cumulative = 0;

  // Year 0: Initial investment phase
  const year0Inflows = initialInvestment + (loanAmount || 0);
  const year0Outflows = totalAssetCosts + machineryInstallationCost;
  const year0Net = year0Inflows - year0Outflows;
  
  inflows.push(year0Inflows);
  outflows.push(year0Outflows);
  netCashflows.push(year0Net);
  cumulative += year0Net;
  cumulativeCashflows.push(cumulative);

  // Years 1+: Operational phase
  for (let year = 1; year <= years; year++) {
    const yearInflows = revenue[year];
    
    const yearOutflows = 
      rawMaterialCosts[year] +
      salaries.total[year] +
      expenses[year] +
      depreciation.total[year] +
      (loanPayments.annualAmortization[year] || 0) +
      (loanPayments.annualInterest[year] || 0);
    
    const yearNet = yearInflows - yearOutflows;
    
    inflows.push(yearInflows);
    outflows.push(yearOutflows);
    netCashflows.push(yearNet);
    cumulative += yearNet;
    cumulativeCashflows.push(cumulative);
  }

  console.log('[ManufacturingProjections] Cashflows calculated for', years, 'years');
  return {
    inflows,
    outflows,
    netCashflows,
    cumulativeCashflows,
  };
}

/**
 * 12. Calculate project metrics for a specific lifetime
 * @param {number} initialInvestment - Initial investment
 * @param {Array<number>} inflows - Array of annual inflows
 * @param {Array<number>} outflows - Array of annual outflows
 * @param {number} trema - Discount rate (TREMA as decimal, e.g., 0.15 for 15%)
 * @param {number} lifetime - Project lifetime in years
 * @returns {Object} { npv, irr, roi, breakEven, npvPerYear }
 */
export function calculateProjectMetricsForLifetime(initialInvestment, inflows, outflows, trema, lifetime) {
  // Only consider flows up to the specified lifetime
  const relevantInflows = inflows.slice(0, lifetime);
  const relevantOutflows = outflows.slice(0, lifetime);
  
  // Calculate cashflows: Year 0 includes initial investment subtraction
  const cashflows = relevantInflows.map((inflow, index) => {
    if (index === 0) {
      return inflow - relevantOutflows[index] - initialInvestment;
    } else {
      return inflow - relevantOutflows[index];
    }
  });

  // NPV calculation - discount rate as percentage (trema is decimal, convert to %)
  const discountRatePercent = trema * 100;
  let npv = 0;
  for (let i = 0; i < lifetime; i++) {
    npv += cashflows[i] / Math.pow(1 + (discountRatePercent / 100), i);
  }

  // IRR calculation (binary search method matching the simulator)
  let lowRate = npv > 0 ? 0 : -100;
  let highRate = npv > 0 ? 200 : 0;
  let irr = 0;
  let iterations = 1000;
  const tolerance = 0.01;

  while (iterations--) {
    let guessRate = (lowRate + highRate) / 2;
    let npvAtRate = 0;

    for (let t = 0; t < lifetime; t++) {
      const cashFlow = relevantInflows[t] - relevantOutflows[t];
      npvAtRate += cashFlow / Math.pow(1 + guessRate / 100, t);
    }
    npvAtRate -= initialInvestment;

    if (Math.abs(npvAtRate) < tolerance) {
      irr = guessRate;
      break;
    }

    if (npvAtRate > 0) {
      lowRate = guessRate;
    } else {
      highRate = guessRate;
    }
  }

  // ROI calculation
  const totalInflows = relevantInflows.reduce((sum, val) => sum + val, 0);
  const totalOutflows = relevantOutflows.reduce((sum, val) => sum + val, 0);
  const roi = ((totalInflows - totalOutflows - initialInvestment) / (totalOutflows + initialInvestment)) * 100;

  // Break-even calculation (accumulated cashflows method)
  let breakEven = -1;
  let accumulated = 0;
  
  for (let i = 0; i < lifetime; i++) {
    accumulated += cashflows[i];
    if (accumulated >= 0 && breakEven === -1) {
      breakEven = i + Math.abs(relevantOutflows[i - 1] / relevantInflows[i]);
      break;
    }
  }

  // NPV per year (for optimization)
  const npvPerYear = npv / lifetime;

  return {
    npv: parseFloat(npv.toFixed(2)),
    irr: parseFloat(irr.toFixed(1)),
    roi: parseFloat(roi.toFixed(2)),
    breakEven: breakEven >= 0 ? parseFloat(breakEven.toFixed(1)) : -1,
    npvPerYear: parseFloat(npvPerYear.toFixed(2)),
  };
}

/**
 * Main entry point: Calculate complete manufacturing projections
 * @param {Object} businessModel - Canonical business model
 * @param {number} maxYears - Maximum years to project (default 10)
 * @param {string} demandProjectionMethod - Method for projecting demand
 * @returns {Object} Complete projection data
 */
export function calculateManufacturingProjections(businessModel, maxYears = 10, demandProjectionMethod = 'inflation') {
  console.log('[ManufacturingProjections] Starting calculations for', maxYears, 'years');
  
  const {
    premises,
    boms,
    assets,
    production,
    workforce,
    expenses,
    financing,
  } = businessModel;

  // 1. Calculate machinery installation cost
  const machineryInstallationCost = calculateMachineryInstallationCost(
    assets.machinery,
    premises.machineryInstallationRate
  );

  // 2. Project purchase orders
  const purchaseOrders = projectPurchaseOrders(
    production.firstFullYearDemand.units,
    premises.inflationRate,
    maxYears,
    demandProjectionMethod
  );

  // 3. Project work orders
  const { workOrders, qualityYields } = projectWorkOrders(
    purchaseOrders,
    production.qualityYield,
    premises.qualityImprovementRate,
    maxYears
  );

  // 4. Calculate annual capacity
  const annualCapacity = calculateAnnualCapacity(production);

  // 5. Calculate depreciation
  const { depreciation, totals: assetTotals } = calculateAssetDepreciation(
    assets,
    premises.depreciationRates,
    maxYears
  );

  // 6. Calculate loan schedule
  const loanPayments = calculateLoanSchedule(
    financing.loan.amount,
    financing.loan.periods,
    financing.loan.interestRate
  );

  // 7. Project salaries
  const salaries = projectSalaries(workforce, premises.inflationRate, maxYears);

  // 8. Project expenses
  const projectedExpenses = projectExpenses(expenses, premises.inflationRate, maxYears);

  // 9. Project raw material costs
  const rawMaterialCosts = projectRawMaterialCosts(boms, workOrders, premises.inflationRate, maxYears);

  // 10. Project revenue
  const revenue = projectRevenue(boms, purchaseOrders, premises.inflationRate, maxYears);

  // 11. Calculate cashflows
  const totalAssetCosts = assetTotals.machinery + assetTotals.vehicles + assetTotals.buildings + assetTotals.computerEquipment;
  
  const cashflows = calculateAnnualCashflows(
    {
      revenue,
      rawMaterialCosts,
      salaries,
      expenses: projectedExpenses,
      depreciation,
      loanPayments,
    },
    financing.initialInvestment,
    financing.loan.amount,
    totalAssetCosts,
    machineryInstallationCost
  );

  // 12. Calculate metrics for each lifetime
  const metricsByLifetime = [];
  let bestLifetime = null;
  let bestNPVPerYear = -Infinity;

  for (let lifetime = 1; lifetime <= maxYears; lifetime++) {
    const metrics = calculateProjectMetricsForLifetime(
      financing.initialInvestment,
      cashflows.inflows,
      cashflows.outflows,
      premises.trema,
      lifetime
    );

    metrics.lifetime = lifetime;
    metricsByLifetime.push(metrics);

    // Track best lifetime (highest NPV/year)
    if (metrics.npvPerYear > bestNPVPerYear) {
      bestNPVPerYear = metrics.npvPerYear;
      bestLifetime = {
        lifetime,
        npv: metrics.npv,
        npvPerYear: metrics.npvPerYear,
        reason: 'Highest NPV per year ratio',
      };
    }
  }

  console.log('[ManufacturingProjections] Calculations complete');
  console.log('[ManufacturingProjections] Best lifetime:', bestLifetime.lifetime, 'years');

  return {
    baseData: {
      years: Array.from({ length: maxYears + 1 }, (_, i) => i),
      annualCapacity,
      purchaseOrders,
      workOrders,
      qualityYields,
      projectionMethod: demandProjectionMethod,
    },
    baseProjections: {
      revenue,
      rawMaterialCosts,
      salaries,
      expenses: projectedExpenses,
      depreciation,
      loanPayments,
      assetTotals,
      machineryInstallationCost,
    },
    cashflows,
    metricsByLifetime,
    bestLifetime,
    recommendedLifetime: bestLifetime.lifetime,
  };
}
