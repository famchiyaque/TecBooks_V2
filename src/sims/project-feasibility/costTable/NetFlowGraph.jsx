import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useCashFlow from "@/hooks/sims/project/useFlow.js";
import formatCurrency from "@/utils/sims/program/formatCurrency.util";

const tempFlow = {
  2025: -18257128.24,
  2026: -44015447.96,
  2027: -33841189.55,
  2028: -19828651.55,
  2029: -1749965.85,
  2030: 26060244.96,
  2031: 58027648.86,
  2032: 94637345.57,
  2033: 136658735.14,
  2034: 182108183.39,
  2035: 233071642.93,
};

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

function NetFlowGraph({ project, currency }) {
  const { netFlow } = useCashFlow(project);

  const { categories, values, trend } = useMemo(() => {
    const flow = netFlow || {};
    const years = Object.keys(flow).sort((a, b) => a - b);
    const vals = years.map((y) => flow[y]);
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
      title: { text: "Net Flow" },
      labels: {
        formatter: function () {
          return formatCurrency(this.value, currency, 0);
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
        negativeColor: "#1f6f8b", // mismo color para negativos, como en la imagen
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
