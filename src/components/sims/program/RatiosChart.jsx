import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Ratios mix units (multiples, plain decimals, dollars) that don't share one
// y-axis meaningfully - Current Ratio/Acid Test/Asset Turnover are all "x"
// multiples, so those are the ones shown by default. The rest still render
// as series (click the dimmed legend entry to show), same Highcharts pattern
// NetFlowGraph.jsx uses, just off by default so the initial chart isn't a
// scale mess of -37x next to a $4M Working Capital line.
const CHART_SERIES = [
  { key: "currentRatio", name: "Current Ratio", color: "#1f6f8b", visible: true },
  { key: "acidTest", name: "Acid Test (Quick Ratio)", color: "#c0392b", visible: true },
  { key: "assetTurnover", name: "Total Asset Turnover", color: "#8e44ad", visible: true },
  { key: "workingCapital", name: "Working Capital", color: "#16a085", visible: false },
  { key: "debtToAssets", name: "Debt to Assets", color: "#d35400", visible: false },
  { key: "equityToAssets", name: "Equity to Assets", color: "#2c3e50", visible: false },
  { key: "netProfitMargin", name: "Net Profit Margin", color: "#27ae60", visible: false },
  { key: "returnOnAssets", name: "Return on Assets (ROA)", color: "#e67e22", visible: false },
];

/**
 * How the 8 Financial Ratios KPIs move year over year - same numbers
 * FinancialRatios' table already computed, just plotted instead of read
 * row by row. `valuesByYear[definitionKey][year]` are raw numbers (not the
 * formatted/colored strings the table cells use).
 */
function RatiosChart({ years, valuesByKey }) {
  const options = useMemo(() => {
    const categories = years.map(String);
    return {
      chart: { type: "line", style: { fontFamily: "inherit" }, height: 360 },
      title: { text: "KPI Trend" },
      xAxis: { categories, title: { text: "Year" }, crosshair: true },
      yAxis: {
        title: { text: "" },
        plotLines: [{ value: 0, width: 1, color: "#ccc" }],
      },
      tooltip: { shared: true, valueDecimals: 2 },
      legend: { enabled: true },
      series: CHART_SERIES.map((series) => ({
        name: series.name,
        color: series.color,
        visible: series.visible,
        data: years.map((year) => {
          const value = valuesByKey[series.key]?.[year];
          return Number.isFinite(value) ? value : null;
        }),
        marker: { enabled: true, radius: 3 },
        connectNulls: false,
      })),
      credits: { enabled: false },
    };
  }, [years, valuesByKey]);

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default RatiosChart;
