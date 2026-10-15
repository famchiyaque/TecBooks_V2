import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useContainerHeight from "@/hooks/sims/forecasts/useContainerHeight";
import {
  selectForecastChartSeries,
  selectForecastYears,
  selectForecastVisible,
  setForecastYears,
  setForecastVisible,
} from "@/store/playground.slice.js";

const MIN_CHART_HEIGHT = 220;

/** RF9-11 - linea base + una linea por metodo activo, extendida 1-10 anios al futuro. */
const ForecastChart = () => {
  const dispatch = useDispatch();
  const chartSeries = useSelector(selectForecastChartSeries);
  const forecastYears = useSelector(selectForecastYears);
  const forecastVisible = useSelector(selectForecastVisible);
  const [chartBoxRef, measuredHeight] = useContainerHeight();

  const options = useMemo(
    () => ({
      chart: {
        type: "line",
        style: { fontFamily: "inherit" },
        height: Math.max(measuredHeight, MIN_CHART_HEIGHT),
        spacingTop: 8,
        spacingBottom: 10,
      },
      title: { text: "Sales Data", margin: 8, style: { color: "#0f172a" } },
      xAxis: {
        title: { text: "Month", style: { color: "#334155" } },
        labels: { style: { color: "#334155" } },
        lineColor: "#cbd5e1",
        tickColor: "#cbd5e1",
      },
      yAxis: {
        title: { text: "Sales in Dollars", style: { color: "#334155" }, margin: 16 },
        labels: { style: { color: "#334155" } },
      },
      tooltip: { shared: true },
      legend: {
        itemStyle: { fontSize: "11px", color: "#334155" },
        symbolHeight: 10,
        margin: 6,
      },
      series: chartSeries.map((series) => ({ ...series, marker: { enabled: false } })),
      credits: { enabled: false },
    }),
    [chartSeries, measuredHeight],
  );

  return (
    <section className="flex h-full min-h-[280px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-none flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={forecastVisible}
            onChange={(event) => dispatch(setForecastVisible(event.target.checked))}
          />
          Show forecast
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Forecast years
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={forecastYears}
            disabled={!forecastVisible}
            onChange={(event) => dispatch(setForecastYears(event.target.value))}
          />
          <span className="tabular-nums">{forecastYears}</span>
        </label>
      </div>
      {/* flex-1 + min-h-0: se mide con ResizeObserver (useContainerHeight) y
          ese numero real en px se le pasa a chart.height arriba - asi
          Highcharts siempre sabe su alto exacto, sin adivinar via CSS %. */}
      <div ref={chartBoxRef} className="min-h-0 flex-1">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </section>
  );
};

export default ForecastChart;
