import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { selectAutocorrelationTable, selectFlatSeries } from "@/store/playground.slice.js";

/** RF4 - barras para ACF, lineas para LIGA/LSGA (bandas de confianza). */
const AutocorrelationChart = () => {
  const rows = useSelector(selectAutocorrelationTable);
  const series = useSelector(selectFlatSeries);

  const options = useMemo(
    () => ({
      chart: { type: "column", style: { fontFamily: "inherit" }, height: 280 },
      title: { text: "Autocorrelation" },
      xAxis: { categories: rows.map((row) => String(row.lag)), title: { text: "Lag" } },
      yAxis: { title: { text: "" }, plotLines: [{ value: 0, width: 1, color: "#ccc" }] },
      tooltip: { shared: true, valueDecimals: 3 },
      series: [
        { name: "ACF", type: "column", color: "#1f6f8b", data: rows.map((row) => row.acf) },
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
    [rows],
  );

  if (series.length < 2) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
};

export default AutocorrelationChart;
