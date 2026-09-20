import {
  computeRawMaterialCost,
  computeIndirectMaterialCosts,
  computeNetSales,
  sumSalariesByCategoryPerYear,
} from "@/utils/dashboard/costCalculations";
import { computeAdminExpenses } from "@/utils/dashboard/computeAdminExpenses.js";
import {
  cbmToCostTableInputs,
} from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";
import { computeCapexByYear } from "@/sims/project-feasibility/costTable/outflowCalculations";
import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ComputeOutflows");

const SALARY_ROWS = [
  { key: "MOD", concept: "Direct Labor (MOD)" },
  { key: "MOIndirecta", concept: "Indirect Labor" },
  { key: "Ingenieria", concept: "Engineering" },
  { key: "Administrative", concept: "Administrative Salaries" },
];

const ASSET_ROWS = [
  { key: "buildings", concept: "Buildings" },
  { key: "compute", concept: "Computer Equipment" },
  { key: "machinery", concept: "Machinery and Equipment" },
  { key: "transport", concept: "Transportation" },
];

function emptyOutflows() {
  return {
    years: [],
    servicesCatalog: [],
    rawMaterialRows: [],
    salaryRows: [],
    servicesYearRow: [],
    fixedAssetRows: [],
    financingRows: [],
    totalOutflowRows: [],
  };
}

function yearRow(concept, valuesByYear, years, extra = {}) {
  const row = { concept, ...extra };
  years.forEach((year) => {
    row[String(year)] = valuesByYear[year] ?? 0;
  });
  return row;
}

function yearZeroOnly(years, amount) {
  const values = {};
  years.forEach((year, index) => {
    values[year] = index === 0 ? amount : 0;
  });
  return values;
}

function sumMaps(years, maps) {
  const total = {};
  years.forEach((year) => {
    total[year] = maps.reduce(
      (sum, map) => sum + (Number(map[year]) || 0),
      0,
    );
  });
  return total;
}

function mapTotal(valuesByYear) {
  return Object.values(valuesByYear).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0,
  );
}

function padLoanSeries(values, years) {
  const byYear = {};
  years.forEach((year, index) => {
    byYear[year] = values[index] ?? 0;
  });
  return byYear;
}

function formatServicesCatalog(project) {
  const items = project?.services;
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    category: item.category,
    subcategory: item.subcategory,
    description: item.description,
    monthlyRange: item.monthlyAmount,
    notes: item.notes ?? null,
    tone: "neutral",
  }));
}

/**
 * Outflows tab figures: cash leaving, plus the financing identity that
 * sizes the loan. Salaries follow the Cost Table category buckets.
 * Services yearly totals use the annualized (×12) helper. Asset purchases
 * sit in their acquisition year. Working capital is a year-0 identity.
 * Loan Balance is the year-end remaining principal (Monto), not an outflow.
 */
export function computeOutflows(cbm) {
  if (!cbm?.timeline || !cbm?.premises) return emptyOutflows();

  const years = cbm.timeline.years ?? [];
  if (years.length === 0) return emptyOutflows();

  const { employees, production, premises } = cbmToCostTableInputs(cbm);
  const salariesByYear = sumSalariesByCategoryPerYear(
    employees,
    years,
    cbm.premises,
  );
  const rawMaterialsByYear = computeRawMaterialCost(production);
  const netSales = computeNetSales(production);
  const indirectMaterialsByYear = computeIndirectMaterialCosts(
    premises,
    netSales,
  );
  const servicesByYear = computeAdminExpenses(cbm);
  const capexByYear = computeCapexByYear(cbm, years);

  const buildingsByYear = {};
  const computeByYear = {};
  const machineryByYear = {};
  const transportByYear = {};
  const installationByYear = {};
  years.forEach((year) => {
    const capex = capexByYear[year] ?? {};
    buildingsByYear[year] = capex.buildings ?? 0;
    computeByYear[year] = capex.compute ?? 0;
    machineryByYear[year] = capex.machinery ?? 0;
    transportByYear[year] = capex.transport ?? 0;
    installationByYear[year] = (capex.machinery ?? 0) * 0.35;
  });

  const salaryMaps = {};
  SALARY_ROWS.forEach(({ key }) => {
    salaryMaps[key] = {};
    years.forEach((year) => {
      salaryMaps[key][year] = salariesByYear[year]?.[key] ?? 0;
    });
  });

  const salariesTotalByYear = sumMaps(
    years,
    SALARY_ROWS.map(({ key }) => salaryMaps[key]),
  );
  const rawMaterialsTotalByYear = sumMaps(years, [
    rawMaterialsByYear,
    indirectMaterialsByYear,
  ]);
  const assetMaps = {
    buildings: buildingsByYear,
    compute: computeByYear,
    machinery: machineryByYear,
    transport: transportByYear,
    installation: installationByYear,
  };
  const fixedAssetsTotalByYear = sumMaps(years, Object.values(assetMaps));

  const yearZero = years[0];
  const salariesYearZero = salariesTotalByYear[yearZero] ?? 0;
  const servicesYearZero = servicesByYear[yearZero] ?? 0;
  const workingCapital = salariesYearZero + servicesYearZero;
  const totalFixedAssets = mapTotal(fixedAssetsTotalByYear);
  const loanPrincipal = workingCapital + totalFixedAssets;

  const periods = Number(cbm.timeline.financingPeriods);
  let amortizationByYear = yearZeroOnly(years, 0);
  let interestByYear = yearZeroOnly(years, 0);
  let loanBalanceByYear = yearZeroOnly(years, 0);
  if (Number.isFinite(periods) && periods > 0) {
    const schedule = computeAmortizationInterest(loanPrincipal, cbm);
    amortizationByYear = padLoanSeries(schedule.yearAmortization ?? [], years);
    interestByYear = padLoanSeries(schedule.yearInterest ?? [], years);
    loanBalanceByYear = padLoanSeries(schedule.yearBalance ?? [], years);
  }

  const totalOutflowsByYear = sumMaps(years, [
    rawMaterialsByYear,
    indirectMaterialsByYear,
    ...SALARY_ROWS.map(({ key }) => salaryMaps[key]),
    servicesByYear,
    ...Object.values(assetMaps),
    amortizationByYear,
    interestByYear,
  ]);

  const rawMaterialRows = [
    yearRow("Raw Materials", rawMaterialsByYear, years, { tone: "outflow" }),
    yearRow("Indirect Material Costs", indirectMaterialsByYear, years, {
      tone: "outflow",
    }),
    yearRow("Total Raw Materials", rawMaterialsTotalByYear, years, {
      rowVariant: "total",
      tone: "neutral",
    }),
  ];

  const salaryRows = [
    ...SALARY_ROWS.map(({ key, concept }) =>
      yearRow(concept, salaryMaps[key], years, { tone: "outflow" }),
    ),
    yearRow("Total Salaries", salariesTotalByYear, years, {
      rowVariant: "total",
      tone: "neutral",
    }),
  ];

  const servicesYearRow = [
    yearRow("Total Services", servicesByYear, years, { tone: "outflow" }),
  ];

  const fixedAssetRows = [
    ...ASSET_ROWS.map(({ key, concept }) =>
      yearRow(concept, assetMaps[key], years, { tone: "outflow" }),
    ),
    yearRow("Installation", installationByYear, years, {
      tone: "outflow",
      tooltip: "35% of machinery purchased in that year",
    }),
    yearRow("Total Fixed Assets", fixedAssetsTotalByYear, years, {
      rowVariant: "total",
      tone: "neutral",
    }),
  ];

  const financingRows = [
    yearRow(
      "Total Salaries",
      yearZeroOnly(years, salariesYearZero),
      years,
      {
        tone: "neutral",
        tooltip: "Year-0 salaries; the amount financed as working capital.",
      },
    ),
    yearRow(
      "Total Services",
      yearZeroOnly(years, servicesYearZero),
      years,
      {
        tone: "neutral",
        tooltip: "Year-0 annual services; the amount financed as working capital.",
      },
    ),
    yearRow("Working Capital", yearZeroOnly(years, workingCapital), years, {
      tone: "neutral",
      tooltip:
        "Year-0 salaries + year-0 services. Capital that must be funded up front so those operating payments can be made; not a third cash drain.",
    }),
    yearRow(
      "Total Fixed Assets",
      yearZeroOnly(years, totalFixedAssets),
      years,
      {
        tone: "neutral",
        tooltip:
          "Sum of all fixed-asset purchases and installation, in any acquisition year.",
      },
    ),
    yearRow("Loan Balance", loanBalanceByYear, years, {
      tone: "neutral",
      tooltip:
        "Year-end remaining principal (Monto) after that year's amortization. Working capital + total fixed assets originated the loan.",
    }),
    yearRow("Amortization", amortizationByYear, years, { tone: "outflow" }),
    yearRow("Interest", interestByYear, years, { tone: "outflow" }),
  ];

  const totalOutflowRows = [
    yearRow("Total Outflows", totalOutflowsByYear, years, {
      rowVariant: "total",
      tone: "outflow",
    }),
  ];

  const result = {
    years,
    servicesCatalog: formatServicesCatalog(cbm),
    rawMaterialRows,
    salaryRows,
    servicesYearRow,
    fixedAssetRows,
    financingRows,
    totalOutflowRows,
    workingCapital,
    loanPrincipal,
  };
  logger.debug("computeOutflows", {
    years,
    salariesYearZero,
    servicesYearZero,
    workingCapital,
    totalFixedAssets,
    loanPrincipal,
  });
  return result;
}
