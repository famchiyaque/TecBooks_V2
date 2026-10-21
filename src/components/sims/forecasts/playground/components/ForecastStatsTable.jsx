import React from "react";
import { fmt, StatItem } from "@/components/sims/investments/StatItem";

/**
 * Forecast statistics grid (R^2, Std. error, t-value, Adj. lag, MAD, MSE,
 * RMSE, MAPE, MPE) - extracted from investments/Results.jsx, where this
 * exact block had been commented out and referenced a `stats` object that
 * was never wired to any real data in project-evaluation.store.js. Moved
 * here as part of consolidating forecast/error functionality into the
 * Forecasting sim instead. Pure presentational - pass a `stats` object
 * shaped like { r, se, tValue, adjustedLag, mad, mse, rmse, mape, mpe }.
 */
const ForecastStatsTable = ({ stats = {} }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm text-slate-500">Forecast statistics</p>
      <div className="grid grid-cols-3 gap-2">
        <StatItem label="R^2" value={fmt(stats.r, 4)} />
        <StatItem label="Std. error" value={fmt(stats.se)} />
        <StatItem label="t-value" value={fmt(stats.tValue)} />
        <StatItem label="Adj. lag" value={fmt(stats.adjustedLag, 0)} />
        <StatItem label="MAD" value={fmt(stats.mad)} />
        <StatItem label="MSE" value={fmt(stats.mse)} />
        <StatItem label="RMSE" value={fmt(stats.rmse)} />
        <StatItem label="MAPE" value={fmt(stats.mape)} unit="%" />
        <StatItem label="MPE" value={fmt(stats.mpe)} unit="%" />
      </div>
    </section>
  );
};

export default ForecastStatsTable;
