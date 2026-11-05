import React from "react";
import { useSelector } from "react-redux";
import {
  selectBacktestTable,
  selectComparisonCount,
  selectSelectedMethods,
} from "@/store/playground.slice.js";

function formatNumber(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

/**
 * RF7/8 - Backtesting and Error: one row per active method, lowest MSE first.
 * Every row uses the last m months, where m is the shortest in-sample stretch
 * among the methods that are on.
 */
const ErrorMetricsTable = () => {
  const rows = useSelector(selectBacktestTable);
  const comparedMonths = useSelector(selectComparisonCount);
  const selectedMethods = useSelector(selectSelectedMethods);
  const monthLabel = comparedMonths === 1 ? "month" : "months";
  const summary = selectedMethods.length === 0
    ? "Select at least one model to compare errors."
    : comparedMonths === 0
      ? "These methods have no shared months to compare."
      : `Metrics use the last ${comparedMonths} ${monthLabel}.`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-slate-900">Backtesting and Error</h2>
        <p className="text-sm text-slate-500">{summary}</p>
      </div>

      {rows.length === 0 ? null : (
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              {["Model", "MAD", "MSE", "RMSE", "MAPE", "MPE"].map((label) => (
                <th key={label} className="px-3 pb-2 text-left font-semibold text-slate-700">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.model}>
                <td className="px-3 py-1 text-slate-700">{row.model}</td>
                <td className="px-3 py-1 tabular-nums text-slate-600">{formatNumber(row.mad)}</td>
                <td className="px-3 py-1 tabular-nums text-slate-600">{formatNumber(row.mse)}</td>
                <td className="px-3 py-1 tabular-nums text-slate-600">{formatNumber(row.rmse)}</td>
                <td className="px-3 py-1 tabular-nums text-slate-600">{formatNumber(row.mape)}%</td>
                <td className="px-3 py-1 tabular-nums text-slate-600">{formatNumber(row.mpe)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ErrorMetricsTable;
