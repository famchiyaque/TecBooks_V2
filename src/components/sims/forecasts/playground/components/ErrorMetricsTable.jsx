import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBacktestTable,
  selectErrorBacktestCount,
  setErrorBacktestCount,
} from "@/store/playground.slice.js";

function formatNumber(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

/**
 * RF7/8 - Backtesting and Error: una fila por metodo activo, de menor a
 * mayor error (MSE). "Errors N" controla cuantos meses finales se separan
 * como prueba - el mismo numero que colorea verde/naranja en Historical
 * Demand (son el mismo dial, no dos independientes).
 */
const ErrorMetricsTable = () => {
  const dispatch = useDispatch();
  const rows = useSelector(selectBacktestTable);
  const errorCount = useSelector(selectErrorBacktestCount);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Backtesting and Error</h2>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Errors
          <input
            type="number"
            min={0}
            value={errorCount}
            onChange={(event) => dispatch(setErrorBacktestCount(event.target.value))}
            className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm tabular-nums"
          />
        </label>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">
          Select at least one model and set Errors &gt; 0 to backtest.
        </p>
      ) : (
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
