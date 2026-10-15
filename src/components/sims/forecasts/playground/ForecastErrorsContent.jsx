import React from "react";
import { useDispatch, useSelector } from "react-redux";
import HistoricalDemand from "./components/HistoricalDemand";
import ForecastChart from "./components/ForecastChart";
import ErrorMetricsTable from "./components/ErrorMetricsTable";
import {
  selectDemand,
  selectMaxYears,
  selectMinYears,
  setDemand,
} from "@/store/playground.slice.js";

// Same default demand playground.slice.js already seeds its initial state
// with - reused here only so "Set default values" has something to reset
// back to after the user edits cells.
const INITIAL_DEMAND = {
  2024: [81, 84, 92, 90, 88, 96, 105, 102, 109, 111, 115, 114],
  2025: [123, 130, 125, 138, 145, 142, 141, 146, 147, 157, 150, 160],
};

/**
 * RF1-11 "Demand / Playground": Historical Demand is the one input - the
 * Forecast chart and the Backtesting/Error table both derive from it live,
 * via playground.slice.js's cascading selectors (selectForecastChartSeries,
 * selectBacktestTable). Edit a cell here and both update in the same render.
 */
const ForecastErrorsContent = () => {
  const dispatch = useDispatch();
  const demand = useSelector(selectDemand);
  const maxYears = useSelector(selectMaxYears);
  const minYears = useSelector(selectMinYears);

  return (
    <div className="flex flex-col items-start gap-4 p-6 lg:flex-row">
      {/* Columna izquierda: el único input (Historical Demand) */}
      <div className="flex w-fit flex-none flex-col items-start gap-4">
        <HistoricalDemand
          value={demand}
          onChange={(next) => dispatch(setDemand(next))}
          maxYears={maxYears}
          minYears={minYears}
          testMonths={3}
          defaultValue={100}
        />

        <button
          type="button"
          onClick={() => dispatch(setDemand(INITIAL_DEMAND))}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Set default values
        </button>
      </div>

      {/* Columna derecha: lo que se deriva del demand - usa todo el espacio sobrante */}
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-4 2xl:flex-row">
        <div className="min-w-0 w-full flex-1">
          <ForecastChart />
        </div>
        <div className="w-full flex-none 2xl:w-[380px]">
          <ErrorMetricsTable />
        </div>
      </div>
    </div>
  );
};

export default ForecastErrorsContent;
