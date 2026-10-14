import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  selectForecastChartSeries,
  selectForecastYears,
  selectForecastVisible,
  setForecastYears,
  setForecastVisible,
} from "@/store/playground.slice.js";

/** RF9-11 - linea base + una linea por metodo activo, extendida 1-10 anios al futuro. */
const ForecastChart = () => {
  const dispatch = useDispatch();
  const chartSeries = useSelector(selectForecastChartSeries);
  const forecastYears = useSelector(selectForecastYears);
  const forecastVisible = useSelector(selectForecastVisible);

  const options = useMemo(
    () => ({
      chart: { type: "line", style: { fontFamily: "inherit" }, height: 340 },
      title: { text: "Sales Data" },
      xAxis: { title: { text: "Month" } },
      yAxis: { title: { text: "Sales in Dollars" } },
      tooltip: { shared: true },
      series: chartSeries.map((series) => ({ ...series, marker: { enabled: false } })),
      credits: { enabled: false },
    }),
    [chartSeries],
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
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
      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
};

export default ForecastChart;
