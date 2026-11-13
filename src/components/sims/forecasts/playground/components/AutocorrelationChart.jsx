import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useContainerHeight from "@/hooks/sims/forecasts/useContainerHeight";
import {
  selectAutocorrelationTable,
  selectFlatSeries,
} from "@/store/playground.slice.js";

const MIN_CHART_HEIGHT = 200;

/** RF4 - barras para ACF, lineas para LIGA/LSGA (bandas de confianza). */
const AutocorrelationChart = () => {
  const rows = useSelector(selectAutocorrelationTable);
  const series = useSelector(selectFlatSeries);
  const [chartBoxRef, measuredHeight] = useContainerHeight();

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        style: { fontFamily: "inherit" },
        height: Math.max(measuredHeight, MIN_CHART_HEIGHT),
        spacingTop: 8,
        spacingBottom: 10,
      },
      title: {
        text: "Autocorrelation",
        margin: 8,
        style: { color: "#0f172a" },
      },
      xAxis: {
        categories: rows.map((row) => String(row.lag)),
        title: { text: "Lag", margin: 4, style: { color: "#334155" } },
        labels: { style: { color: "#334155" } },
        lineColor: "#cbd5e1",
        tickColor: "#cbd5e1",
      },
      yAxis: {
        title: { text: "" },
        labels: { style: { color: "#334155" } },
        plotLines: [{ value: 0, width: 1, color: "#ccc" }],
      },
      tooltip: { shared: true, valueDecimals: 3 },
      legend: {
        itemStyle: { fontSize: "11px", color: "#334155" },
        symbolHeight: 10,
        margin: 6,
      },
      series: [
        {
          name: "ACF",
          type: "column",
          color: "#1f6f8b",
          data: rows.map((row) => row.acf),
        },
        {
          name: "LSGA",
          type: "line",
          color: "#c0392b",
          dashStyle: "Dash",
          marker: { enabled: false },
          data: rows.map((row) => row.lsga),
        },
        {
          name: "LIGA",
          type: "line",
          color: "#c0392b",
          dashStyle: "Dash",
          marker: { enabled: false },
          data: rows.map((row) => row.liga),
        },
      ],
      credits: { enabled: false },
    }),
    [rows, measuredHeight],
  );

  if (series.length < 2) return null;

  return (
    <section className="flex h-full min-h-[340px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div ref={chartBoxRef} className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
    </section>
  );
};

export default AutocorrelationChart;
