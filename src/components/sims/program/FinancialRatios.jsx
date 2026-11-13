import React from "react";
import TableContainer from "@/components/global/TableContainer";
import useEffectiveBalanceTotals from "@/sims/project-feasibility/balance/useEffectiveBalanceTotals.js";
import { RATIO_DEFINITIONS } from "@/sims/project-feasibility/balance/ratioDefinitions.js";
import RatiosChart from "./RatiosChart.jsx";

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
