import React from "react";
import "./../../styles/kpi.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useSimData } from "../SimDataContext";
import Gauge from "../Novus Components/Gauge";

const getKPIBoxColor = (value) => {
  if (value < 0) {
    return "boxRed";
  } else if (value < 5) {
    return "boxYellow";
  }
  return "boxGreen";
};

const getKPICircleColor = (value) => {
  if (value < 50000) {
    return "circleRed";
  } else if (value < 100000) {
    return "circleYellow";
  }
  return "circleGreen";
};

const FinancialDashboard = () => {
  const { simData, isLoading, error } = useSimData();
  // if (isLoading) {
  //   return <div>Loading simulation data...</div>;
  // }

  // if (error) {
  //   return <div>Error loading simulation data</div>;
  // }

  const marginsData = {
    netSales: "100",
    grossProfit: "80",
    operatingProfit: "60",
  };

  const profitabilityData = {
    returnOnSales: "7.3",
    returnOnAssets: "10.1",
    returnOnCapitalEmployed: "17.5",
  };

  const liquidityData = {
    currentRatio: "1.4",
    quickRatio: "1.1",
    workingCapital: "-31889",
  };

  const leverageData = {
    debtRatio: "43",
  };

  const efficiencyData = {
    totalAssetTurnover: "8.8",
    inventoryTurnoverRatio: "6.3",
  };

  const balanceData = {
    totalAssets: "100000",
    totalPassive: "50000",
    totalCapital: "50000",
  };

  return (
    <div className="financeKPI">
      <h1>Financial KPIs</h1>

      <div className="first-row-container">
        {/* Left Column */}
        <div>
          <div className="sectionTitle">Margins</div>
          <div className="first-row-content">
            <div className="kpi-title-row-1">Net Sales</div>
            <div className={`kpiBox ${getKPIBoxColor(marginsData.netSales)}`}>
              ${marginsData.netSales}
            </div>
            <div className="kpi-title-row-1">Gross Profit</div>
            <div
              className={`kpiBox ${getKPIBoxColor(marginsData.grossProfit)}`}
            >
              ${marginsData.grossProfit}
            </div>
            <div className="kpi-title-row-1">Operating Profit</div>
            <div
              className={`kpiBox ${getKPIBoxColor(
                marginsData.operatingProfit
              )}`}
            >
              ${marginsData.operatingProfit}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="charts">
          <div className="sectionTitle">Gross Profit vs Operating Profit</div>
          <div className="first-row-content">
            <LineChart
              width={300}
              height={200}
              data={simData.monthlyMarginsData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line type="monotone" dataKey="grossProfit" stroke="#8884d8" />
              <Line
                type="monotone"
                dataKey="operatingProfit"
                stroke="#82ca9d"
              />
            </LineChart>
          </div>
          <div className="sectionTitle">Profitability Indicators</div>
          <div className="first-row-content">
            <LineChart
              width={300}
              height={200}
              data={simData.monthlyProfitabilityData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line type="monotone" dataKey="returnOnSales" stroke="#8884d8" />
              <Line type="monotone" dataKey="returnOnAssets" stroke="#82ca9d" />
              <Line
                type="monotone"
                dataKey="returnOnCapitalEmployed"
                stroke="#FF5733"
              />
            </LineChart>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="sectionTitle">Profitability</div>
          <div className="first-row-content">
            <div className="kpi-title-row-1">Return on Sales (ROS)</div>
            <div><Gauge percentage={profitabilityData.returnOnSales} /></div>
            {/* <div>{kpiCircle(profitabilityData.returnOnSales)}</div> */}

            <div className="kpi-title-row-1">Return on Assets</div>
             <div><Gauge percentage={profitabilityData.returnOnAssets} /></div>
            {/* <div>{kpiCircle(profitabilityData.returnOnAssets)}</div> */}

            <div className="kpi-title-row-1">Return on Capital Employed</div>
            <div><Gauge percentage={profitabilityData.returnOnCapitalEmployed} /></div>
            {/* <div>{kpiCircle(profitabilityData.returnOnCapitalEmployed)}</div> */}
          </div>
        </div>
      </div>

      {/* Second ROW */}
      <div className="second-row-container">
        {/* Titles */}
        <div className="sectionTitle">Liquidity</div>
        <div className="sectionTitle">Leverage</div>

        {/* Liquidity Section */}
        <div className="liquidity">
          <div className="kpi-title-row-2">Current Ratio</div>
          <div className="kpi-title-row-2">Quick Ratio</div>
          <div className="kpi-title-row-2">Working Capital</div>

          <div
            className={`kpiBox ${getKPIBoxColor(liquidityData.currentRatio)}`}
          >
            {liquidityData.currentRatio}
          </div>
          <div className={`kpiBox ${getKPIBoxColor(liquidityData.quickRatio)}`}>
            {liquidityData.quickRatio}
          </div>
          <div
            className={`kpiBox ${getKPIBoxColor(liquidityData.workingCapital)}`}
          >
            ${liquidityData.workingCapital}
          </div>
        </div>

        {/* Leverage Section */}
        <div className="leverage">
          <div className="kpi-title-row-2">Debt Ratio</div>
          <div><Gauge percentage={leverageData.debtRatio} /></div>
          {/* <div>{kpiCircle(leverageData.debtRatio)}</div> */}
        </div>
      </div>

      {/* Third ROW */}
      <div className="third-row-container">
        {/* Titles */}
        <div className="sectionTitle">Efficiency</div>
        <div className="sectionTitle">Balance General</div>

        {/* Efficiency Section */}
        <div className="efficiency">
          <div className="kpi-title-row-3">Total Asset Turnover</div>
          <div className="kpi-title-row-3">Inventory Turnover Ratio</div>
          <div
            className={`kpiCircle ${getKPICircleColor(
              efficiencyData.totalAssetTurnover
            )}`}
          >
            {efficiencyData.totalAssetTurnover}
          </div>
          <div
            className={`kpiCircle ${getKPICircleColor(
              efficiencyData.inventoryTurnoverRatio
            )}`}
          >
            {efficiencyData.inventoryTurnoverRatio}
          </div>
        </div>
        {/* Efficiency Section */}

        {/* Balance General Section */}

        <div className="balance">
          <div className="kpi-title-row-3">Total Assets</div>
          <div className="kpi-title-row-3">Total Passive</div>
          <div className="kpi-title-row-3">Total Capital</div>

          <div className={`kpiBox ${getKPIBoxColor(balanceData.totalAssets)}`}>
            {balanceData.totalAssets}
          </div>
          <div className={`kpiBox ${getKPIBoxColor(balanceData.totalPassive)}`}>
            {balanceData.totalPassive}
          </div>
          <div className={`kpiBox ${getKPIBoxColor(balanceData.totalCapital)}`}>
            {balanceData.totalCapital}
          </div>
        </div>
        {/* Balance General Section */}
      </div>
      {/* Third ROW */}
    </div>
  );
};

export default FinancialDashboard;
