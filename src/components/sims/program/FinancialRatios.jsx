import React from "react";
import TableContainer from "@/components/global/TableContainer";
import useEffectiveBalanceTotals from "@/sims/project-feasibility/balance/useEffectiveBalanceTotals.js";
import RatiosChart from "./RatiosChart.jsx";
import formatCurrency from "@/utils/sims/program/formatCurrency.util";

function formatRatio(value) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
}

// BUG FIX: Debt to Assets / Equity to Assets showed as % (×100) - the
// reference Template Financiero's own "Razones" sheet shows these as plain
// decimals (-20.63, 1.94), not percentages. Matches that instead.
function formatDecimal(value) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function safeDivide(numerator, denominator) {
  return denominator ? numerator / denominator : NaN;
}

// Matches the Template Financiero's "Razones" sheet, section by section.
// 3 of the template's 11 rows (Rotacion de inventarios, Rotacion de
// proveedores, Utilidad de Operacion a ventas) have NO formula in the
// reference template either - confirmed by scanning all 12 sheets, nothing
// ever fills those cells - so they're left out here too instead of guessing
// a formula the source spec never defined.
const RATIO_DEFINITIONS = [
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

function FinancialRatios({ project, currency }) {
  const cbm = project.cbm;
  const years = cbm.timeline.years;
  const totalsByYear = useEffectiveBalanceTotals(cbm, project.gameId);

  const columns = [
    { key: "concept", label: "Ratio" },
    ...years.map((year) => ({
      key: String(year),
      label: String(year),
      align: "right",
    })),
  ];

  const valuesByKey = {};
  const rows = RATIO_DEFINITIONS.map((definition) => {
    const row = { concept: definition.label, tooltip: definition.tooltip };
    valuesByKey[definition.key] = {};
    years.forEach((year) => {
      const value = definition.compute(totalsByYear[year]);
      valuesByKey[definition.key][year] = value;
      const colorClass = !Number.isFinite(value)
        ? "text-slate-300"
        : value < 0
          ? "text-rose-600"
          : "text-slate-900";
      row[String(year)] = (
        <span className={`tabular-nums ${colorClass}`}>
          {definition.format(value, currency)}
        </span>
      );
    });
    return row;
  });

  return (
    <>
      <TableContainer
        title="Financial Ratios"
        subtitle="Liquidity, leverage, efficiency and profitability - computed from the live Balance Sheet and Income Statement."
        columns={columns}
        rows={rows}
      />
      <RatiosChart years={years} valuesByKey={valuesByKey} />
    </>
  );
}

export default FinancialRatios;
