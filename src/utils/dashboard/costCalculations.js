/**
 * Cost table (RF 50) calculations.
 * Consolidates MP, MOD, MO indirecta, Ingenieria and Administrative into
 * the per-year cost-of-sales table shown in the "Estado" statement.
 */

import { sumAssetsValueInYear } from "./assetSchedule.js";

const CATEGORY_TO_KEY = {
  direct: "MOD",
  indirect: "MOIndirecta",
  engineering: "Ingenieria",
  administrative: "Administrative",
};

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * RF-00-01: every registered cost value must be numeric.
 * production.salesPricePerUnit may be a flat scalar (standalone Cost Table
 * upload page) or a {year: price} map (CBM path, price grown by inflation
 * per year) - both shapes get flattened to their numeric values here.
 */
export function areCostsNumeric(employees, production) {
  const employeesOk = employees.every(
    (emp) => isFiniteNumber(emp.quantity) && isFiniteNumber(emp.monthlySalary),
  );

  const salesPriceValues =
    typeof production.salesPricePerUnit === "object" &&
    production.salesPricePerUnit !== null
      ? Object.values(production.salesPricePerUnit)
      : [production.salesPricePerUnit];

  const productionOk = [
    ...Object.values(production.purchaseOrders || {}),
    ...Object.values(production.qualityYield || {}),
    production.materialCostPerUnit,
    ...salesPriceValues,
  ].every(isFiniteNumber);

  return employeesOk && productionOk;
}

/**
 * Sums annual salaries by category: MOD, MO indirecta, Ingenieria, Administrative.
 * Employees whose category didn't match any of the 4 known buckets are skipped -
 * use findUnclassifiedEmployees to surface those instead of losing them silently.
 */
export function sumSalariesByCategory(employees) {
  const totals = { MOD: 0, MOIndirecta: 0, Ingenieria: 0, Administrative: 0 };
  
  for (const emp of employees) {
    const key = CATEGORY_TO_KEY[emp.category];
    if (!key) continue;
    totals[key] += emp.quantity * emp.monthlySalary * 12;
  }

  return totals;
}

/**
 * Same 4 category totals as sumSalariesByCategory, but grown year over year
 * by national inflation (getInflation) - MOD/MOIndirecta/Ingenieria/
 * Administrative were previously a single flat total reused for every year
 * of the projection (no raise, ever), unlike raw material/net sales which
 * already grow with inflation. Year zero (idx 0) always equals the flat
 * total, since getInflation(premises, 0) = (1 + rate[0])^0 = 1.
 */
export function sumSalariesByCategoryPerYear(employees, years, premises) {
  const base = sumSalariesByCategory(employees);
  const salariesByYear = {};

  years.forEach((year, idx) => {
    const inflation = getInflation(premises, idx);
    salariesByYear[year] = {
      MOD: base.MOD * inflation,
      MOIndirecta: base.MOIndirecta * inflation,
      Ingenieria: base.Ingenieria * inflation,
      Administrative: base.Administrative * inflation,
    };
  });

  return salariesByYear;
}

/**
 * Employees whose category is missing/unrecognized - these get silently excluded
 * from sumSalariesByCategory's totals, so callers should warn about them instead
 * of trusting the totals blindly.
 */
export function findUnclassifiedEmployees(employees) {
  return employees
    .filter((emp) => !CATEGORY_TO_KEY[emp.category])
    .map((emp) => emp.name);
}

/**
 * netSales[year] = purchaseOrders[year] (units sold) * salesPricePerUnit[year]
 * (BOM "Costo de venta", grown by national inflation each year - Ingresos!C23
 * = B23 * (1 + Premisas!C12)). salesPricePerUnit may also be passed as a flat
 * scalar (the standalone Cost Table upload page's shape, no per-year data) -
 * that value is then reused for every year, same as before.
 */
export function computeNetSales(production) {
  const { purchaseOrders, salesPricePerUnit } = production;
  const netSalesByYear = {};
  const isPriceMap =
    typeof salesPricePerUnit === "object" && salesPricePerUnit !== null;

  for (const [year, orders] of Object.entries(purchaseOrders)) {
    const priceForYear = isPriceMap
      ? (salesPricePerUnit[year] ?? 0)
      : (salesPricePerUnit ?? 0);

    netSalesByYear[year] = orders * priceForYear;
  }

  return netSalesByYear;
}

/**
 * MP (raw material cost) per year.
 * WO = CO / Quality yield (work orders needed to fulfill purchase orders at the given quality yield -
 * a low yield means MORE work orders are needed to net the same good units, matching Capacidad!E17: '=E16/E3')
 */
export function computeRawMaterialCost(production) {
  const { purchaseOrders, qualityYield, materialCostPerUnit } =
    production ?? {};
  const rawMaterialByYear = {};

  for (const year of Object.keys(purchaseOrders ?? {})) {
    const workOrders = (qualityYield[year] || 0) === 0
      ? 0
      : (purchaseOrders[year] || 0) / qualityYield[year];
    rawMaterialByYear[year] = workOrders * (materialCostPerUnit || 0);
  }

  return rawMaterialByYear;
}

/**
 * RF-43: Computes the total administrative expenses for a production project.
 * @param {Object} project - The production object containing project information.
 * @returns {Object} An object where keys are years and values are the corresponding administrative expenses.
 */
export function computeAdminExpenses(project) {
  const { services, premises } = project;
  const timeline = createTimelineArr(project);

  const adminExpensesFirst = services.reduce((acc, curr) => {
    return (acc += curr.monthlyAmount);
  }, 0);

  const adminExpensesAll = timeline.reduce((acc, curr, idx) => {
    acc[curr] = adminExpensesFirst * getInflation(premises, idx);
    return acc;
  }, {});

  return adminExpensesAll;
}

/**
 * Computes the annual salaries for a given project.
 *
 * @param {Object} project - project information - extract premises - national inflation
 * @param {Object} cbmCostTable - employees, production and premises - cbmToCostTableInputs()
 * @returns {Object} An object mapping years to arrays of employee types and their corresponding annual salaries.
 */
export function computeWorkforceAnualSalaries(project, cbmCostTable) {
  const { employees, production } = cbmCostTable;
  const { premises } = project;
  const initialSalary = sumSalariesByCategory(employees);

  const anualSalaries = Object.fromEntries(
    Object.entries(production.purchaseOrders).map(([year, co], idx) => {
      const salaries = Object.fromEntries(
        Object.entries(initialSalary).map(([type, amount]) => [
          type,
          (amount * getInflation(premises, idx)) / co,
        ]),
      );

      return [year, salaries];
    }),
  );

  return anualSalaries;
}

/**
 * RF-43: Creates an array of years for a given timeline object.
 * @param {Object} project - The project object containing timeline information.
 * @returns {Array} An array of years.
 */
export function createTimelineArr(project) {
  const { timeline } = project;
  const { startYear, endYear } = timeline;

  const timelineArr = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  return timelineArr;
}

/**
 * indirectMaterials[year] = netSales[year] * indirectProductPercentage[year]
 */
export function computeIndirectMaterialCosts(premises, netSalesByYear) {
  const { indirectProductPercentage } = premises;
  const indirectMaterialsByYear = {};

  for (const [year, netSales] of Object.entries(netSalesByYear)) {
    indirectMaterialsByYear[year] =
      netSales * (indirectProductPercentage[year] || 0);
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
 * MOD/MOIndirecta/Ingenieria are per-year maps (BUG FIX: used to be a single
 * flat total reused for every year - salaries never got a raise across the
 * whole projection, unlike raw material/net sales which already grow with
 * inflation - see sumSalariesByCategoryPerYear).
 * RF-55: Administrative (admin salaries) is NOT part of cost of sales / gross profit -
 * the reference Estado R template only ever subtracts it later, in Operating Expenses.
 * See computeAdministrativeExpenses / computeOperatingExpenses for where it's used.
 */
export function buildCostOfSalesTable(
  years,
  { MP, MOD, MOIndirecta, Ingenieria, indirectMaterials, netSales },
) {
  return years.map((year) => {
    const rawMaterial = MP[year] || 0;
    const directLabour = MOD[year] || 0;
    const indirectManufacturing = MOIndirecta[year] || 0;
    const engineeringSalaries = Ingenieria[year] || 0;
    const indirectMaterialsForYear = indirectMaterials[year] || 0;
    const totalCostOfSales =
      rawMaterial + directLabour + indirectManufacturing + engineeringSalaries + indirectMaterialsForYear;
    const netSalesForYear = netSales?.[year] || 0;

    return {
      year,
      rawMaterial,
      directLabour,
      indirectManufacturing,
      engineeringSalaries,
      indirectMaterials: indirectMaterialsForYear,
      totalCostOfSales,
      netSales: netSalesForYear,
      grossProfit: computeGrossProfit(netSalesForYear, totalCostOfSales),
    };
  });
}

/**
 * RF-55 BUG FIX: depreciationByYear = rate[year] * total asset value for
 * that year. InputNovus/Template Financiero repeat an asset's value flat
 * across every year column (Inversion!D2 = "=C2", same book value shown
 * again, not a new purchase) - the reference Depreciacion sheet's own
 * "Total" row confirms this stays flat year over year, it does NOT grow
 * (e.g. 8,060,000 in every one of 2025-2029), so acquisitionByYear[year]
 * must be read as-is per year, never accumulated across years. Doing that
 * used to multiply an asset's value by how many years had passed (an asset
 * bought once looked like it was re-bought every year). If a future data
 * source ever lists a genuinely new acquisition mid-project (zeros before
 * its purchase year, a value from then on), this still works correctly
 * without any further change - each year just sums whatever that year's
 * column holds.
 */
export function computeAssetDepreciation(
  assets,
  depreciationRateByYear,
  years,
) {
  const depreciationByYear = {};

  for (const year of years) {
    depreciationByYear[year] =
      sumAssetsValueInYear(assets, year) * (depreciationRateByYear[year] || 0);
  }

  return depreciationByYear;
}

/**
 * salesExpenses[year] = netSales[year] * salesExpensePct[year] (Premisas "Porcentaje de gasto de venta")
 */
export function computeSalesExpenses(
  netSalesByYear,
  salesExpensePctByYear,
  years,
) {
  const salesExpensesByYear = {};
  for (const year of years) {
    salesExpensesByYear[year] =
      (netSalesByYear[year] || 0) * (salesExpensePctByYear[year] || 0);
  }
  return salesExpensesByYear;
}

/**
 * Administrative Expenses = admin salaries (per-year, from Empleados_2 -
 * BUG FIX: used to be a single flat total with no raise across the whole
 * projection) + admin general expenses (Premisas "Porcentaje de
 * administracion" * net sales).
 */
export function computeAdministrativeExpenses(
  administrativeSalaryByYear,
  adminPctByYear,
  netSalesByYear,
  years,
) {
  const administrativeByYear = {};
  for (const year of years) {
    administrativeByYear[year] =
      (administrativeSalaryByYear[year] || 0) +
      (netSalesByYear[year] || 0) * (adminPctByYear[year] || 0);
  }
  return administrativeByYear;
}

/**
 * Operating Expenses = Administrative Expenses + total depreciation + Sales Expenses
 */
export function computeOperatingExpenses(
  administrativeByYear,
  administrativeSalary,
  depreciationTotalByYear,
  salesExpensesByYear,
  years,
) {
  const operatingExpensesByYear = {};

  for (const year of years) {
    // BUG FIX: "(a + b || 0)" applies the fallback AFTER adding - if either
    // side is undefined/NaN for a given year, the whole sum silently
    // collapsed to 0, dropping administrative salary (and administrativeByYear)
    // together instead of just defaulting the missing one. Each term now
    // falls back to 0 on its own before adding.
    operatingExpensesByYear[year] =
      (administrativeByYear[year] || 0) +
      (administrativeSalary[year] || 0) +
      (depreciationTotalByYear[year] || 0)
      // (salesExpensesByYear[year] || 0);
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

/**
 * RF-56 BUG FIX: total (not depreciated) asset value of one or more asset
 * groups for each year - the "Investment"/"Machinery" inputs the financing
 * amount is built from. "Cumulative" here means summed ACROSS the given
 * asset groups within one year, not accumulated across years - same fix and
 * same reasoning as computeAssetDepreciation just without the rate
 * multiplication: acquisitionByYear[year] is that year's value as-is, not a
 * yearly delta to keep adding on top of previous years.
 */
export function computeCumulativeInvestment(assetGroups, years) {
  const totalByYear = {};
  for (const year of years) {
    totalByYear[year] = assetGroups.reduce(
      (groupSum, assets) => groupSum + sumAssetsValueInYear(assets, year),
      0,
    );
  }

  return totalByYear;
}

/**
 * RF-56: "Amount" to finance = Investment (buildings + transport + compute,
 * cumulative) + Salaries (flat annual total, all categories) + Management
 * Bills (admin general expense) + Machinery and Equipment * 0.35.
 */
export function computeFinancingAmount(
  investmentByYear,
  salariesTotal,
  administrativeExpenses,
  machineryInvestmentByYear,
  civilWorks,
  year,
) {
  const assets = machineryInvestmentByYear[year] + investmentByYear[year]
  const workForce = administrativeExpenses[year] + salariesTotal

  const totalAmount = assets + workForce + civilWorks[year]
  
  return totalAmount;
}

/**
 * RF-56: straight-line loan amortization over `periods` MONTHS for a single
 * loan originated once (at project year zero) - each month pays back an
 * equal slice of principal (amortization), and interest accrues on the
 * declining balance, matching Financiamiento's own monthly schedule:
 * Interes[m] = (tasa/12) * saldo[m], saldo[m] = saldo[m-1] - Amortizacion.
 *
 * The monthly schedule is then split into consecutive 12-month blocks -
 * months 1-12 report against `years[0]`, 13-24 against `years[1]`, etc. -
 * so each projection year only carries its own 12 months of interest and
 * principal instead of the loan's full-life totals. A `years` entry with no
 * corresponding month block (loan already paid off, or the loan outlives the
 * projection horizon) reports 0 for both.
 */
export function computeAmortizationSchedule(allAmount, periods, annualRate, years) {  
  const financialExpensesByYear = {};
  const creditPaymentByYear = {};
  for (const year of years) {
    financialExpensesByYear[year] = 0;
    creditPaymentByYear[year] = 0;
  }
  if (!periods) return { financialExpensesByYear, creditPaymentByYear };

  const amortization = allAmount / periods;
  let balance = allAmount;
  const monthlySchedule = [];
  for (let month = 0; month < periods; month += 1) {
    monthlySchedule.push({
      interest: (annualRate / 12) * balance,
      amortization,
    });
    balance -= amortization;
  }

  years.forEach((year, yearIndex) => {
    const monthsForYear = monthlySchedule.slice(
      yearIndex * 12,
      yearIndex * 12 + 12,
    );
    financialExpensesByYear[year] = monthsForYear.reduce(
      (sum, month) => sum + month.interest,
      0,
    );
    creditPaymentByYear[year] = monthsForYear.reduce(
      (sum, month) => sum + month.amortization,
      0,
    );
  });

  return { financialExpensesByYear, creditPaymentByYear };
}

/**
 * RF-56: incomeBeforeTaxes = operatingProfit - Financial Expenses (bank
 * interest) - Credit Payment (principal) + Financial Income ("Productos
 * Financieros" - no source field in InputNovus, manual/overridable only).
 */
export function computeIncomeBeforeTaxes(
  operatingProfit,
  financialExpenses,
  creditPayment,
  financialIncome,
) {
  return operatingProfit - financialExpenses - creditPayment + financialIncome;
}

/**
 * RF-57: ISR + PTU, both a flat rate (Premisas "Tasa ISR" / "Tasa de PTU")
 * applied to incomeBeforeTaxes for that year. A loss year owes no tax (no
 * refund either) - matches Estado R's own guard: '=IF(B36<0, 0, B36*Premisas!B13)'.
 */
export function computeTaxes(
  incomeBeforeTaxesByYear,
  isrRateByYear,
  ptuRateByYear,
  years,
) {
  const taxesByYear = {};
  for (const year of years) {
    const base = incomeBeforeTaxesByYear[year] || 0;
    if (base < 0) {
      taxesByYear[year] = { isr: 0, ptu: 0, total: 0 };
      continue;
    }
    const isr = base * (isrRateByYear[year] || 0);
    const ptu = base * (ptuRateByYear[year] || 0);
    taxesByYear[year] = { isr, ptu, total: isr + ptu };
  }
  return taxesByYear;
}

/**
 * RF-57: netIncome = incomeBeforeTaxes - (ISR + PTU). Same single-value
 * in/out shape as computeGrossProfit/computeOperatingProfit.
 */
export function computeNetIncome(incomeBeforeTaxes, taxesTotal) {
  return incomeBeforeTaxes - taxesTotal;
}

/**
 * getInflation = (1 + NationalInflation)^(currentYear-startYear)
 * @returns float
 */
export function getInflation(premises, idx) {
  return Math.pow(1 + (premises?.nationalInflation?.[idx] ?? 0), idx);
}
