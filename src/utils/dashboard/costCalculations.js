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
 * Builds the per-year cost-of-sales table consumed by the "Estado" cost table.
 * Salary categories are treated as flat annual totals applied to every year of the projection.
 */
export function buildCostOfSalesTable(years, { MP, MOD, MOIndirecta, Ingenieria, Administracion, indirectMaterials }) {
  return years.map((year) => {
    const rawMaterial = MP[year] || 0;
    const indirectMaterialsForYear = indirectMaterials[year] || 0;
    const totalCostOfSales = rawMaterial + MOD + MOIndirecta + Ingenieria + Administracion + indirectMaterialsForYear;

    return {
      year,
      rawMaterial,
      directLabour: MOD,
      indirectManufacturing: MOIndirecta,
      engineeringSalaries: Ingenieria,
      administrativeExpenses: Administracion,
      indirectMaterials: indirectMaterialsForYear,
      totalCostOfSales,
    };
  });
}
