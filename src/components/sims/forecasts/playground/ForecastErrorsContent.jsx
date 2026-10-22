import React from "react";
import { useDispatch, useSelector } from "react-redux";
import HistoricalDemand from "./components/HistoricalDemand";
import ForecastChart from "./components/ForecastChart";
import ErrorMetricsTable from "./components/ErrorMetricsTable";
import AutocorrelationTable from "./components/AutocorrelationTable";
import AutocorrelationChart from "./components/AutocorrelationChart";
import {
  INITIAL_DEMAND,
  selectDemand,
  selectErrorBacktestCount,
  selectMaxYears,
  selectMinYears,
  setDemand,
} from "@/store/playground.slice.js";
import MethodButtons from "./components/MethodButtons";

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
  const errorBacktestCount = useSelector(selectErrorBacktestCount);

  return (
    // 89vh = 100vh - GenericHeader (6vh) - GenericSubheader (5vh): intenta
    // llenar la pantalla sin scroll, pero es un minimo, no un tope duro - si
    // el contenido real necesita mas (ej. las graficas con su leyenda), la
    // pagina crece y hace scroll en vez de recortar/ocultar contenido.
    <div className="flex min-h-[89vh] flex-col gap-3 p-4">
      <div className="flex flex-col items-stretch gap-3 lg:flex-row">
        {/* Columna izquierda: el único input (Historical Demand) */}
        <div className="flex w-fit flex-none flex-col items-start gap-3">
          <HistoricalDemand
            value={demand}
            onChange={(next) => dispatch(setDemand(next))}
            setDefault={() => dispatch(setDemand(INITIAL_DEMAND))}
            maxYears={maxYears}
            minYears={minYears}
            testMonths={errorBacktestCount}
            defaultValue={100}
          />
        </div>

        {/* Columna derecha: todo lo que se deriva del demand, en dos
            sub-columnas (graficas | tablas) que llenan el alto disponible -
            cada grafica mide su propio contenedor con ResizeObserver
            (useContainerHeight) y le pasa ese numero real a Highcharts, asi
            que crecer/encoger via flex-1 nunca le recorta la leyenda. */}
        <div className="flex w-full flex-1 flex-col gap-3 2xl:flex-row">
          <div className="flex w-full flex-1 flex-col gap-3">
            <div className="flex-1">
              <MethodButtons />
            </div>
            <div className="min-h-[280px] flex-1">
              <ForecastChart />
            </div>
            <div className="min-h-[240px] flex-1">
              <AutocorrelationChart />
            </div>
          </div>
          <div className="flex w-full flex-none flex-col gap-3 2xl:w-[500px]">
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
