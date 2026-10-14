import React from "react";
import { useSelector } from "react-redux";
import { selectAutocorrelationTable, selectFlatSeries } from "@/store/playground.slice.js";

function formatNumber(value, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

/** RF3 - Tabla de Autocorrelacion: Lag | SE | t | LIGA | LSGA | ACF. */
const AutocorrelationTable = () => {
  const rows = useSelector(selectAutocorrelationTable);
  const series = useSelector(selectFlatSeries);

  if (series.length < 2) {
    return (
      <section className="w-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Autocorrelation</h2>
        <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          Not enough historical demand data to compute autocorrelation.
        </p>
      </section>
    );
  }

  return (
    <section className="w-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Autocorrelation</h2>
      <table className="border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {["Lag", "SE", "t", "LIGA", "LSGA", "ACF"].map((label) => (
              <th key={label} className="px-3 pb-2 text-right font-semibold text-slate-700">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.lag}>
              <td className="px-3 py-1 text-right tabular-nums text-slate-600">{row.lag}</td>
              <td className="px-3 py-1 text-right tabular-nums text-slate-600">{formatNumber(row.se)}</td>
              <td className="px-3 py-1 text-right tabular-nums text-slate-600">{formatNumber(row.t, 2)}</td>
              <td className="px-3 py-1 text-right tabular-nums text-slate-600">{formatNumber(row.liga)}</td>
              <td className="px-3 py-1 text-right tabular-nums text-slate-600">{formatNumber(row.lsga)}</td>
              <td
                className={`px-3 py-1 text-right tabular-nums font-medium ${
                  row.significant ? "text-emerald-600" : "text-slate-800"
                }`}
              >
                {formatNumber(row.acf)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AutocorrelationTable;
