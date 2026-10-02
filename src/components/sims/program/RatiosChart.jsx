import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Ratios mix units (multiples, plain decimals, dollars) that don't share one
// y-axis meaningfully, so nothing is plotted by default - the user picks the
// KPIs worth comparing from the selector under the chart. Selection lives in
// React (not Highcharts' legend) because `options` is rebuilt whenever the
// CBM changes, which would otherwise reset legend toggles back to the
// hardcoded defaults on any currency/year edit.
const CHART_SERIES = [
  { key: "currentRatio", name: "Current Ratio", color: "#1f6f8b" },
  { key: "acidTest", name: "Acid Test (Quick Ratio)", color: "#c0392b" },
  { key: "assetTurnover", name: "Total Asset Turnover", color: "#8e44ad" },
  { key: "workingCapital", name: "Working Capital", color: "#16a085" },
  { key: "debtToAssets", name: "Debt to Assets", color: "#d35400" },
  { key: "equityToAssets", name: "Equity to Assets", color: "#2c3e50" },
  { key: "netProfitMargin", name: "Net Profit Margin", color: "#27ae60" },
  { key: "returnOnAssets", name: "Return on Assets (ROA)", color: "#e67e22" },
];

/**
 * How the 8 Financial Ratios KPIs move year over year - same numbers
 * FinancialRatios' table already computed, just plotted instead of read
 * row by row. `valuesByKey[definitionKey][year]` are raw numbers (not the
 * formatted/colored strings the table cells use).
 */
function RatiosChart({ years, valuesByKey }) {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const toggleKey = (key) => {
    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const options = useMemo(() => {
    const categories = years.map(String);
    return {
      chart: { type: "line", style: { fontFamily: "inherit", fontSize: "17.5px" }, height: 420 },
      title: { text: "KPI Trend", style: { fontSize: "19px" } },
      xAxis: {
        categories,
        title: { text: "Year", style: { fontSize: "17.5px" } },
        labels: { style: { fontSize: "17.5px" } },
        crosshair: true,
      },
      yAxis: {
        title: { text: "", style: { fontSize: "17.5px" } },
        labels: { style: { fontSize: "17.5px" } },
        plotLines: [{ value: 0, width: 1, color: "#ccc" }],
      },
      tooltip: { shared: true, valueDecimals: 2, style: { fontSize: "17.5px" } },
      legend: { enabled: false },
      series: CHART_SERIES.filter((series) => selectedKeys.includes(series.key)).map((series) => ({
        name: series.name,
        color: series.color,
        data: years.map((year) => {
          const value = valuesByKey[series.key]?.[year];
          return Number.isFinite(value) ? value : null;
        }),
        marker: { enabled: true, radius: 4 },
        connectNulls: false,
      })),
      credits: { enabled: false },
    };
  }, [years, valuesByKey, selectedKeys]);

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
      <div className="mb-3">
        <h3 className="text-[19px] font-semibold text-slate-900">KPI Trend</h3>
        <p className="text-[17.5px] text-slate-500">
          Select which KPIs you want to see in the chart using the selector below it. Nothing is plotted
          by default, so start by picking the ratios you want to compare.
        </p>
      </div>

      <div className="relative">
        <HighchartsReact highcharts={Highcharts} options={options} />
        {selectedKeys.length === 0 && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-[17.5px] text-slate-400">
            No KPI selected
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
        {CHART_SERIES.map((series) => {
          const active = selectedKeys.includes(series.key);
          return (
            <button
              key={series.key}
              type="button"
              aria-pressed={active}
              onClick={() => toggleKey(series.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[17.5px] transition-colors ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: active ? series.color : "#cbd5e1" }}
              />
              {series.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RatiosChart;