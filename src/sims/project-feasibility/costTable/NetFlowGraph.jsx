import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useCashFlow from "@/hooks/sims/project/useFlow.js";

// Calcula la línea de tendencia (regresión lineal simple) sobre los valores
function calcTrendline(values) {
  const n = values.length;
  const xs = values.map((_, i) => i);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * values[i], 0);
  const sumXX = xs.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return xs.map((x) => intercept + slope * x);
}

function NetFlowGraph({ project }) {
  const { netFlow } = useCashFlow(project);

  const { categories, values, trend } = useMemo(() => {
    const flow = netFlow || {};
    const years = Object.keys(flow).sort((a, b) => a - b);
    if (years.length === 0) return { categories: [], values: [], trend: [] };
    const vals = years.map((y) => flow[y] / 1e6);
    return {
      categories: years,
      values: vals,
      trend: calcTrendline(vals),
    };
  }, [netFlow]);

  const options = {
    chart: {
      type: "column",
      style: { fontFamily: "inherit" },
    },
    title: {
      text: "Net Flow",
    },
    xAxis: {
      categories,
      title: { text: "Year" },
      crosshair: true,
    },
    yAxis: {
      title: { text: "Net Flow (millones de pesos)" },
      labels: {
        formatter: function () {
          return `${this.value.toLocaleString("es-MX", {
            maximumFractionDigits: 0,
          })} M`;
        },
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: "#888",
        },
      ],
    },
    tooltip: {
      shared: true,
      valuePrefix: "$",
      valueSuffix: " M",
      valueDecimals: 2,
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        name: "Net Flow",
        type: "column",
        data: values,
        color: "#1f6f8b",
        negativeColor: "#c0392b",
        borderRadius: 2,
      },
      {
        name: "Tendency",
        type: "line",
        data: trend,
        color: "#1f6f8b",
        dashStyle: "Dot",
        marker: { enabled: false },
        enableMouseTracking: false,
        lineWidth: 1.5,
      },
    ],
    credits: { enabled: false },
  };

  return (
    <div style={{ width: "100%", maxWidth: 700 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default NetFlowGraph;
