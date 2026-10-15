import React from "react";
import { useDispatch, useSelector } from "react-redux";
import HistoricalDemand from "./components/HistoricalDemand";
import ForecastChart from "./components/ForecastChart";
import ErrorMetricsTable from "./components/ErrorMetricsTable";
import AutocorrelationTable from "./components/AutocorrelationTable";
import AutocorrelationChart from "./components/AutocorrelationChart";
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
    // 89vh = 100vh - GenericHeader (6vh) - GenericSubheader (5vh): llena la
    // pantalla sin scroll de pagina. Las graficas se reparten 50%/50% del
    // alto disponible via flex-1 en vez de una altura fija en px.
    <div className="flex h-[89vh] flex-col gap-3 overflow-hidden p-4">
      <div className="flex min-h-0 flex-1 flex-col items-stretch gap-3 lg:flex-row">
        {/* Columna izquierda: el único input (Historical Demand) */}
        <div className="flex min-h-0 w-fit flex-none flex-col items-start gap-3 overflow-y-auto">
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
            className="flex-none rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Set default values
          </button>
        </div>

        {/* Columna derecha: todo lo que se deriva del demand, en dos
            sub-columnas (graficas | tablas) que llenan el alto disponible -
            cada grafica/tabla toma 50% del alto, pareada con su contraparte
            (Sales Data/Backtesting arriba, Autocorrelation abajo). */}
        <div className="flex min-h-0 w-full flex-1 flex-col gap-3 2xl:flex-row">
          <div className="flex min-h-0 w-full flex-1 flex-col gap-3">
            <div className="min-h-0 flex-1">
              <ForecastChart />
            </div>
            <div className="min-h-0 flex-1">
              <AutocorrelationChart />
            </div>
          </div>
          <div className="flex min-h-0 w-full flex-none flex-col gap-3 2xl:w-[500px]">
            {/* Backtesting and Error: alto natural (1 fila por metodo activo),
                no fuerza 50% si no tiene contenido para llenarlo. */}
            <div className="flex-none overflow-y-auto">
              <ErrorMetricsTable />
            </div>
            {/* Autocorrelation table: se queda con todo el espacio restante -
                hasta 12 filas (1-2 anios de demanda), por eso lo necesita. */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AutocorrelationTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastErrorsContent;
