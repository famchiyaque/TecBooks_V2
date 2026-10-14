import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HistoricalDemand from "./components/HistoricalDemand";
import AutocorrelationTable from "./components/AutocorrelationTable";
import AutocorrelationChart from "./components/AutocorrelationChart";
import MethodsBank from "./components/MethodsBank";
import ErrorMetricsTable from "./components/ErrorMetricsTable";
import ForecastChart from "./components/ForecastChart";
import {
  selectDemand,
  selectMaxYears,
  selectMinYears,
  selectErrorBacktestCount,
  setDemand,
} from "@/store/playground.slice.js";

const TABS = [
  { key: "demand", label: "Demand" },
  { key: "playground", label: "Playground" },
];

/**
 * Vista nueva/aislada (RF1-11), separada del Sales Forecaster de siempre.
 * Historical Demand es el unico input - todo lo demas (autocorrelacion,
 * banco de metodos, backtesting, pronostico) se deriva de el via selectors
 * de playground.slice.js. Datos de ejemplo - la implementacion real contra
 * el backend la hace alguien mas despues.
 */
const PlaygroundPage = () => {
  const [tab, setTab] = useState("demand");
  const dispatch = useDispatch();
  const demand = useSelector(selectDemand);
  const maxYears = useSelector(selectMaxYears);
  const minYears = useSelector(selectMinYears);
  const errorBacktestCount = useSelector(selectErrorBacktestCount);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex gap-1 rounded-full bg-slate-100 p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <HistoricalDemand
        value={demand}
        onChange={(next) => dispatch(setDemand(next))}
        maxYears={maxYears}
        minYears={minYears}
        testMonths={errorBacktestCount}
        defaultValue={100}
      />

      {tab === "playground" && (
        <>
          <div className="flex flex-wrap items-start gap-4">
            <AutocorrelationTable />
            <AutocorrelationChart />
          </div>
          <MethodsBank />
          <div className="flex flex-wrap items-start gap-4">
            <ErrorMetricsTable />
          </div>
          <ForecastChart />
        </>
      )}
    </div>
  );
};

export default PlaygroundPage;
