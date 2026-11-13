import formatCurrency from "@/utils/sims/program/formatCurrency.util";

export function formatRatio(value) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
}

// BUG FIX: Debt to Assets / Equity to Assets showed as % (×100) - the
// reference Template Financiero's own "Razones" sheet shows these as plain
// decimals (-20.63, 1.94), not percentages. Matches that instead.
export function formatDecimal(value) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function safeDivide(numerator, denominator) {
  return denominator ? numerator / denominator : NaN;
}

// RF74 - Razones Financieras. Matches the Template Financiero's "Razones"
// sheet, section by section. 3 of the template's 11 rows (Rotacion de
// inventarios, Rotacion de proveedores, Utilidad de Operacion a ventas) have
// NO formula in the reference template either - confirmed by scanning all
// 12 sheets, nothing ever fills those cells - so they're left out here too
// instead of guessing a formula the source spec never defined.
export const RATIO_DEFINITIONS = [
  {
    key: "currentRatio",
    label: "Current Ratio",
    tooltip: "Current Ratio = Current Actives / Current Passives",
    format: formatRatio,
    compute: (t) => safeDivide(t.currentActivesTotal, t.currentPassivesTotal),
  },
  {
    key: "acidTest",
    label: "Acid Test (Quick Ratio)",
    tooltip: "Acid Test = (Current Actives - Inventory) / Current Passives",
    format: formatRatio,
    compute: (t) =>
      safeDivide(t.currentActivesTotal - t.inventory, t.currentPassivesTotal),
  },
  {
    key: "workingCapital",
    label: "Working Capital",
    tooltip: "Working Capital = Current Actives - Current Passives",
    format: (value, currency) => formatCurrency(value, currency),
    compute: (t) => t.currentActivesTotal - t.currentPassivesTotal,
  },
  {
    key: "debtToAssets",
    label: "Debt to Assets",
    tooltip: "Debt to Assets = Total Passives / Total Actives",
    format: formatDecimal,
    compute: (t) => safeDivide(t.totalPassives, t.totalActives),
  },
  {
    key: "equityToAssets",
    label: "Equity to Assets",
    tooltip: "Equity to Assets = Shareholders' Equity / Total Actives",
    format: formatDecimal,
    compute: (t) =>
      safeDivide(t.totalActives - t.totalPassives, t.totalActives),
  },
  {
    key: "assetTurnover",
    label: "Total Asset Turnover",
    tooltip: "Total Asset Turnover = Net Sales / Total Actives",
    format: formatRatio,
    compute: (t) => safeDivide(t.netSales, t.totalActives),
  },
  {
    key: "netProfitMargin",
    label: "Net Profit Margin",
    tooltip: "Net Profit Margin = Net Income / Net Sales",
    // BUG FIX: showed as % (×100) - Template Financiero's "Rentabilidad
    // sobre las ventas" row shows a plain decimal (-0.35, not -35%). Same
    // fix category as Debt to Assets / Equity to Assets above.
    format: formatDecimal,
    compute: (t) => safeDivide(t.netIncome, t.netSales),
  },
  {
    key: "returnOnAssets",
    label: "Return on Assets (ROA)",
    tooltip: "Return on Assets (ROA) = Net Utility / Total Actives",
    format: formatDecimal,
    compute: (t) => safeDivide(t.netIncome, t.totalActives),
  },
];
