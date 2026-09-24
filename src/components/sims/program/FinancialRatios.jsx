import React from "react";
import TableContainer from "@/components/global/TableContainer";
import useEffectiveBalanceTotals from "@/sims/project-feasibility/balance/useEffectiveBalanceTotals.js";

function formatRatio(value) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toLocaleString("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
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
    tooltip: "Razon de Liquidez = Activo Circulante / Pasivo Circulante",
    format: formatRatio,
    compute: (t) => safeDivide(t.currentActivesTotal, t.currentPassivesTotal),
  },
  {
    key: "acidTest",
    label: "Acid Test (Quick Ratio)",
    tooltip: "Prueba del Acido = (Activo Circulante - Inventario) / Pasivo Circulante",
    format: formatRatio,
    compute: (t) => safeDivide(t.currentActivesTotal - t.inventory, t.currentPassivesTotal),
  },
  {
    key: "workingCapital",
    label: "Working Capital",
    tooltip: "Capital de Trabajo = Activo Circulante - Pasivo Circulante",
    format: (value) => `$${(value || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    compute: (t) => t.currentActivesTotal - t.currentPassivesTotal,
  },
  {
    key: "debtToAssets",
    label: "Debt to Assets",
    tooltip: "Indice de endeudamiento = Pasivo total / Activo total",
    format: formatPercent,
    compute: (t) => safeDivide(t.totalPassives, t.totalActives),
  },
  {
    key: "equityToAssets",
    label: "Equity to Assets",
    tooltip: "Indice de endeudamiento = Capital contable / Activo total",
    format: formatPercent,
    compute: (t) => safeDivide(t.totalActives - t.totalPassives, t.totalActives),
  },
  {
    key: "assetTurnover",
    label: "Total Asset Turnover",
    tooltip: "Rotacion del activo total = Ventas netas / Activo total",
    format: formatRatio,
    compute: (t) => safeDivide(t.netSales, t.totalActives),
  },
  {
    key: "netProfitMargin",
    label: "Net Profit Margin",
    tooltip: "Rentabilidad sobre las ventas = Utilidad neta / Ventas netas",
    format: formatPercent,
    compute: (t) => safeDivide(t.netIncome, t.netSales),
  },
  {
    key: "returnOnAssets",
    label: "Return on Assets (ROA)",
    tooltip: "Rendimiento sobre la inversion = Utilidad Neta / Activo total",
    format: formatPercent,
    compute: (t) => safeDivide(t.netIncome, t.totalActives),
  },
];

function FinancialRatios({ project }) {
  const cbm = project.cbm;
  const years = cbm.timeline.years;
  const totalsByYear = useEffectiveBalanceTotals(cbm);

  const columns = [
    { key: "concept", label: "Ratio" },
    ...years.map((year) => ({ key: String(year), label: String(year), align: "right" })),
  ];

  const rows = RATIO_DEFINITIONS.map((definition) => {
    const row = { concept: definition.label, tooltip: definition.tooltip };
    years.forEach((year) => {
      const value = definition.compute(totalsByYear[year]);
      row[String(year)] = definition.format(value);
    });
    return row;
  });

  return (
    <TableContainer
      title="Financial Ratios"
      subtitle="Liquidity, leverage, efficiency and profitability - computed from the live Balance Sheet and Income Statement."
      columns={columns}
      rows={rows}
    />
  );
}

export default FinancialRatios;
