/**
 * Cost table (RF 50) calculations.
 * Consolidates MP, MOD, MO indirecta, Ingenieria and Administracion into
 * the per-year cost-of-sales table shown in the "Estado" statement.
 */

const CATEGORY_TO_KEY = {
  direct: 'MOD',
  indirect: 'MOIndirecta',
  engineering: 'Ingenieria',
  administrative: 'Administracion',
};

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * RF-00-01: every registered cost value must be numeric.
 */
export function areCostsNumeric(employees, production) {
  const employeesOk = employees.every((emp) => (
    isFiniteNumber(emp.quantity) && isFiniteNumber(emp.monthlySalary)
  ));

  const productionOk = [
    ...Object.values(production.purchaseOrders || {}),
    ...Object.values(production.qualityYield || {}),
    production.materialCostPerUnit,
    production.salesPricePerUnit,
  ].every(isFiniteNumber);

  return employeesOk && productionOk;
}

/**
 * Sums annual salaries by category: MOD, MO indirecta, Ingenieria, Administracion.
 * Employees whose category didn't match any of the 4 known buckets are skipped -
 * use findUnclassifiedEmployees to surface those instead of losing them silently.
 */
export function sumSalariesByCategory(employees) {
  const totals = { MOD: 0, MOIndirecta: 0, Ingenieria: 0, Administracion: 0 };

  for (const emp of employees) {
    const key = CATEGORY_TO_KEY[emp.category];
    if (!key) continue;
    totals[key] += emp.quantity * emp.monthlySalary * 12;
  }

  return totals;
}

/**
 * Employees whose category is missing/unrecognized - these get silently excluded
 * from sumSalariesByCategory's totals, so callers should warn about them instead
 * of trusting the totals blindly.
 */
export function findUnclassifiedEmployees(employees) {
  return employees.filter((emp) => !CATEGORY_TO_KEY[emp.category]).map((emp) => emp.name);
}

/**
 * netSales[year] = purchaseOrders[year] (units sold) * salesPricePerUnit (BOM "Costo de venta")
 */
export function computeNetSales(production) {
  const { purchaseOrders, salesPricePerUnit } = production;
  const netSalesByYear = {};

  for (const [year, orders] of Object.entries(purchaseOrders)) {
    netSalesByYear[year] = orders * salesPricePerUnit;
  }

  return netSalesByYear;
}

/**
 * MP (raw material cost) per year.
 * WO = CO * Quality yield (work orders needed to fulfill purchase orders at the given quality yield)
 */
export function computeRawMaterialCost(production) {
  const { purchaseOrders, qualityYield, materialCostPerUnit } = production;
  const rawMaterialByYear = {};

  for (const year of Object.keys(purchaseOrders)) {
    const workOrders = (purchaseOrders[year] || 0) * (qualityYield[year] || 0);
    rawMaterialByYear[year] = workOrders * (materialCostPerUnit || 0);
  }

  return rawMaterialByYear;
}

/**
 * indirectMaterials[year] = netSales[year] * indirectProductPercentage[year]
 */
export function computeIndirectMaterialCosts(premises, netSalesByYear) {
  const { indirectProductPercentage } = premises;
  const indirectMaterialsByYear = {};

  for (const [year, netSales] of Object.entries(netSalesByYear)) {
    indirectMaterialsByYear[year] = netSales * (indirectProductPercentage[year] || 0);
  }

  return indirectMaterialsByYear;
}

/**
 * RF-54: grossProfit = netSales - totalCostOfSales.
 * Single-value in/out on purpose - reused both for the static value baked
 * into buildCostOfSalesTable's rows and for the live, override-aware
 * recompute EditableTable's summary row does on every render.
 */
export function computeGrossProfit(netSales, totalCostOfSales) {
  return netSales - totalCostOfSales;
}

/**
 * Builds the per-year cost-of-sales table consumed by the "Estado" cost table.
 * Salary categories are treated as flat annual totals applied to every year of the projection.
 * RF-55: Administracion (admin salaries) is NOT part of cost of sales / gross profit -
 * the reference Estado R template only ever subtracts it later, in Gastos de Operacion.
 * See computeAdministrativeExpenses / computeOperatingExpenses for where it's used.
 */
export function buildCostOfSalesTable(years, {
  MP, MOD, MOIndirecta, Ingenieria, indirectMaterials, netSales,
}) {
  return years.map((year) => {
    const rawMaterial = MP[year] || 0;
    const indirectMaterialsForYear = indirectMaterials[year] || 0;
    const totalCostOfSales = rawMaterial + MOD + MOIndirecta + Ingenieria + indirectMaterialsForYear;
    const netSalesForYear = netSales?.[year] || 0;

    return {
      year,
      rawMaterial,
      directLabour: MOD,
      indirectManufacturing: MOIndirecta,
      engineeringSalaries: Ingenieria,
      indirectMaterials: indirectMaterialsForYear,
      totalCostOfSales,
      netSales: netSalesForYear,
      grossProfit: computeGrossProfit(netSalesForYear, totalCostOfSales),
    };
  });
}

/**
 * RF-55: depreciationByYear = rate[year] * cumulative acquisition cost of the
 * asset class through that year (assets already owned keep depreciating in
 * later years, new acquisitions join the base from their acquisition year on).
 * Reused for buildings/transport/compute (assets.*) and machinery
 * (capacity.machines - same {acquisitionByYear} shape, just no "name").
 */
export function computeAssetDepreciation(assets, depreciationRateByYear, years) {
  const depreciationByYear = {};
  let cumulativeAcquisition = 0;

  for (const year of years) {
    cumulativeAcquisition += assets.reduce((sum, asset) => sum + (asset.acquisitionByYear[year] || 0), 0);
    depreciationByYear[year] = cumulativeAcquisition * (depreciationRateByYear[year] || 0);
  }

  return depreciationByYear;
}

/**
 * salesExpenses[year] = netSales[year] * salesExpensePct[year] (Premisas "Porcentaje de gasto de venta")
 */
export function computeSalesExpenses(netSalesByYear, salesExpensePctByYear, years) {
  const salesExpensesByYear = {};
  for (const year of years) {
    salesExpensesByYear[year] = (netSalesByYear[year] || 0) * (salesExpensePctByYear[year] || 0);
  }
  return salesExpensesByYear;
}

/**
 * Gastos de Administracion = admin salaries (flat, from Empleados_2) + admin
 * general expenses (Premisas "Porcentaje de administracion" * net sales).
 */
export function computeAdministrativeExpenses(administracionSalary, adminPctByYear, netSalesByYear, years) {
  const administrativeByYear = {};
  for (const year of years) {
    administrativeByYear[year] = administracionSalary + (netSalesByYear[year] || 0) * (adminPctByYear[year] || 0);
  }
  return administrativeByYear;
}

/**
 * Gastos de Operacion = Gastos de Administracion + total depreciation + Gastos de Ventas
 */
export function computeOperatingExpenses(administrativeByYear, depreciationTotalByYear, salesExpensesByYear, years) {
  const operatingExpensesByYear = {};
  for (const year of years) {
    operatingExpensesByYear[year] = (administrativeByYear[year] || 0)
      + (depreciationTotalByYear[year] || 0)
      + (salesExpensesByYear[year] || 0);
  }
  return operatingExpensesByYear;
}

/**
 * RF-55: operatingProfit = grossProfit - operatingExpenses. Same
 * single-value in/out shape as computeGrossProfit, for the same reason -
 * reused both statically and for a live, override-aware recompute.
 */
export function computeOperatingProfit(grossProfit, operatingExpenses) {
  return grossProfit - operatingExpenses;
}
