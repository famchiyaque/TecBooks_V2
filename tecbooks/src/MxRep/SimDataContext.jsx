import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LeaderBoard from "./OverView/Small/LeaderBoard"

const SimDataContext = createContext()

export const useSimData = () => useContext(SimDataContext)

export const SimDataProvider = ({ children }) => {
  const [simData, setSimData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const simToken = {
    userName: "Susana",
    teamName: "Rockin Rollers",
    product: "f1 car",
    placement: "2",
    startDate: "2024-01-01",
    currentDate: "2025-01-21",
    leaderboard: 3,
    lifetimeSales: 1812390,
    teamCurrentMoney: 212628,
    salesThisMonth: 19560,
    costsThisMonth: 8893,
    expensesThisMonth: 3583,
    sales: 243899,
    profit: 45899,
    costs: 140000,
    expenses: 58000,
    activoTotal: 212937,

    // all the following needs be calculated through data, can't just past number because user needs to
    // be able to change month/year and see data
    availability: 89,
    downtime: 34,
    runningtime: 250,
    performance: 93,
    idealOutput: 3,
    quality: 94,
    totalParts: 2819,
    goodParts: 2643,
    productivity: 88,
    workers: 8,
    hoursWorked: 70,
    capacity: 99,
    cutting: 75,
    body: 88,
    assembly: 76,
    interior: 94,
    exterior: 90,
    paint: 99,

    actualOutputData: [
      {"date": "2024-01-01", "hoursRunning": 8, "unitsProduced": 12, "minutesDown": 235},
      {"date": "2024-01-02", "hoursRunning": 8, "unitsProduced": 14, "minutesDown": 112},
      {"date": "2024-01-03", "hoursRunning": 8, "unitsProduced": 10, "minutesDown":89},
      {"date": "2024-01-05", "hoursRunning": 8, "unitsProduced": 9, "minutesDown": 75},
      {"date": "2024-01-07", "hoursRunning": 8, "unitsProduced": 6, "minutesDown": 0},
      {"date": "2024-01-09", "hoursRunning": 8, "unitsProduced": 5, "minutesDown": 0},
      {"date": "2024-01-10", "hoursRunning": 8, "unitsProduced": 14, "minutesDown": 0},
      {"date": "2024-01-11", "hoursRunning": 8, "unitsProduced": 16, "minutesDown": 0},
      {"date": "2024-01-13", "hoursRunning": 8, "unitsProduced": 5, "minutesDown": 0},
      {"date": "2024-01-14", "hoursRunning": 8, "unitsProduced": 17, "minutesDown": 0},
      {"date": "2024-01-16", "hoursRunning": 8, "unitsProduced": 19, "minutesDown": 0},
      {"date": "2024-01-17", "hoursRunning": 8, "unitsProduced": 13, "minutesDown": 0},
      {"date": "2024-01-25", "hoursRunning": 8, "unitsProduced": 13, "minutesDown": 0},
      {"date": "2024-01-29", "hoursRunning": 8, "unitsProduced": 14, "minutesDown": 0},
      {"date": "2024-02-02", "hoursRunning": 8, "unitsProduced": 10, "minutesDown": 0},
      {"date": "2024-02-04", "hoursRunning": 8, "unitsProduced": 8, "minutesDown": 0},
      {"date": "2024-02-05", "hoursRunning": 8, "unitsProduced": 16, "minutesDown": 0},
      {"date": "2024-02-06", "hoursRunning": 8, "unitsProduced": 20, "minutesDown": 0},
      {"date": "2024-02-12", "hoursRunning": 8, "unitsProduced": 17, "minutesDown": 0},
      {"date": "2024-02-17", "hoursRunning": 8, "unitsProduced": 14, "minutesDown": 0},
      {"date": "2024-02-18", "hoursRunning": 8, "unitsProduced": 15, "minutesDown": 0},
      {"date": "2024-02-19", "hoursRunning": 8, "unitsProduced": 13, "minutesDown": 0},
      {"date": "2024-02-24", "hoursRunning": 8, "unitsProduced": 10, "minutesDown": 0},
      {"date": "2024-02-25", "hoursRunning": 8, "unitsProduced": 12, "minutesDown": 0},
      {"date": "2024-02-26", "hoursRunning": 8, "unitsProduced": 15, "minutesDown": 0},
      { "date": "2024-03-01", "hoursRunning": 8, "unitsProduced": 13 , "minutesDown": 0},
      { "date": "2024-03-02", "hoursRunning": 8, "unitsProduced": 11 , "minutesDown": 0},
      { "date": "2024-03-03", "hoursRunning": 8, "unitsProduced": 15 , "minutesDown": 0},
      { "date": "2024-03-05", "hoursRunning": 8, "unitsProduced": 12 , "minutesDown": 0},
      { "date": "2024-03-07", "hoursRunning": 8, "unitsProduced": 10 , "minutesDown": 0},
      { "date": "2024-03-09", "hoursRunning": 8, "unitsProduced": 16 , "minutesDown": 0},
      { "date": "2024-03-11", "hoursRunning": 8, "unitsProduced": 14 , "minutesDown": 0},
      { "date": "2024-03-13", "hoursRunning": 8, "unitsProduced": 18 , "minutesDown": 0},
      { "date": "2024-03-15", "hoursRunning": 8, "unitsProduced": 9 , "minutesDown": 0},
      { "date": "2024-03-17", "hoursRunning": 8, "unitsProduced": 6 , "minutesDown": 0},
      { "date": "2024-03-20", "hoursRunning": 8, "unitsProduced": 17 , "minutesDown": 0},
      { "date": "2024-04-01", "hoursRunning": 8, "unitsProduced": 12 , "minutesDown": 0},
      { "date": "2024-04-02", "hoursRunning": 8, "unitsProduced": 14, "minutesDown": 0 },
      { "date": "2024-04-03", "hoursRunning": 8, "unitsProduced": 11 , "minutesDown": 0},
      { "date": "2024-04-05", "hoursRunning": 8, "unitsProduced": 8 , "minutesDown": 0},
      { "date": "2024-04-07", "hoursRunning": 8, "unitsProduced": 16 , "minutesDown": 0},
      { "date": "2024-04-09", "hoursRunning": 8, "unitsProduced": 13 , "minutesDown": 0},
      { "date": "2024-04-11", "hoursRunning": 8, "unitsProduced": 15 , "minutesDown": 0},
      { "date": "2024-04-13", "hoursRunning": 8, "unitsProduced": 18 , "minutesDown": 0},
      { "date": "2024-04-16", "hoursRunning": 8, "unitsProduced": 17 , "minutesDown": 0},
      { "date": "2024-04-19", "hoursRunning": 8, "unitsProduced": 9 , "minutesDown": 0},
      { "date": "2024-04-22", "hoursRunning": 8, "unitsProduced": 6 , "minutesDown": 0},
      { "date": "2024-05-01", "hoursRunning": 8, "unitsProduced": 14 , "minutesDown": 0},
      { "date": "2024-05-03", "hoursRunning": 8, "unitsProduced": 13 , "minutesDown": 0},
      { "date": "2024-05-05", "hoursRunning": 8, "unitsProduced": 15 , "minutesDown": 0},
      { "date": "2024-05-07", "hoursRunning": 8, "unitsProduced": 12 , "minutesDown": 0},
      { "date": "2024-05-10", "hoursRunning": 8, "unitsProduced": 16 , "minutesDown": 0},
      { "date": "2024-05-12", "hoursRunning": 8, "unitsProduced": 17 , "minutesDown": 0},
      { "date": "2024-05-15", "hoursRunning": 8, "unitsProduced": 18 , "minutesDown": 0},
      { "date": "2024-05-17", "hoursRunning": 8, "unitsProduced": 9 , "minutesDown": 0},
      { "date": "2024-05-20", "hoursRunning": 8, "unitsProduced": 11 , "minutesDown": 0},
      { "date": "2024-05-22", "hoursRunning": 8, "unitsProduced": 13 , "minutesDown": 0},
      { "date": "2024-12-01", "hoursRunning": 8, "unitsProduced": 10 , "minutesDown": 55},
      { "date": "2024-12-02", "hoursRunning": 8, "unitsProduced": 14 , "minutesDown": 45},
      { "date": "2024-12-04", "hoursRunning": 8, "unitsProduced": 15 , "minutesDown":67},
      { "date": "2024-12-06", "hoursRunning": 8, "unitsProduced": 16 , "minutesDown": 90},
      { "date": "2024-12-09", "hoursRunning": 8, "unitsProduced": 9 , "minutesDown": 34},
      { "date": "2024-12-12", "hoursRunning": 8, "unitsProduced": 12 , "minutesDown": 340},
      { "date": "2024-12-14", "hoursRunning": 8, "unitsProduced": 18 , "minutesDown": 212},
      { "date": "2024-12-17", "hoursRunning": 8, "unitsProduced": 11 , "minutesDown": 100},
      { "date": "2024-12-20", "hoursRunning": 8, "unitsProduced": 14 , "minutesDown":70},
      { "date": "2024-12-25", "hoursRunning": 8, "unitsProduced": 17 , "minutesDown": 80}
    ],

    inventory: [
      { "name": "bolts", "count": 423 },
      { "name": "nuts", "count": 812 },
      { "name": "chassis", "count": 14 },
      { "name": "tire", "count": 68 },
      { "name": "steering wheel", "count": 29 },
      { "name": "chair", "count": 202 },
      { "name": "windshield", "count": 93 },
      { "name": "radio", "count": 87 },
      { "name": "engine", "count": 56 },
      { "name": "axis", "count": 130 },
      { "name": "speaker", "count": 48 },
      { "name": "gear", "count": 38 },
      { "name": "pedal", "count": 28 }
    ],

    bom : {
      bolts: 32,
      nuts: 48,
      chassis: 1,
      tire: 4,
      steeringWheel : 1,
      chair: 5,
      windshield: 1,
      radio: 1,
      engine: 1,
      axis: 2,
      speaker: 2,
      gear: 16,
      pedal: 3
    },

    // bom: [
    //   { "name": "nuts", "needed": 48 },
    //   { "name": "chassis", "needed": 1 },
    //   { "name": "tire", "needed": 4 },
    //   { "name": "steering wheel", "needed": 1 },
    //   { "name": "chair", "needed": 5 },
    //   { "name": "windshield", "needed": 1 },
    //   { "name": "radio", "needed": 1 },
    //   { "name": "engine", "needed": 1 },
    //   { "name": "axis", "needed": 2 },
    //   { "name": "speaker", "needed": 2 },
    //   { "name": "gear", "needed": 16 },
    //   { "name": "pedal", "needed": 3 }
    // ],

    monthlyMarginsData: [
      { month: "Jan", grossProfit: 200, operatingProfit: 150 },
      { month: "Feb", grossProfit: 250, operatingProfit: 180 },
      { month: "Mar", grossProfit: 300, operatingProfit: 220 },
      { month: "Apr", grossProfit: 350, operatingProfit: 260 },
      { month: "May", grossProfit: 400, operatingProfit: 300 },
      { month: "Jun", grossProfit: 450, operatingProfit: 340 },
      { month: "Jul", grossProfit: 500, operatingProfit: 380 },
      { month: "Aug", grossProfit: 550, operatingProfit: 420 },
      { month: "Sep", grossProfit: 600, operatingProfit: 460 },
      { month: "Oct", grossProfit: 650, operatingProfit: 500 },
    ],

    monthlyProfitabilityData: [
      {
        month: "Jan",
        returnOnSales: 7.3,
        returnOnAssets: 10.1,
        returnOnCapitalEmployed: 17.5,
      },
      {
        month: "Feb",
        returnOnSales: 7.5,
        returnOnAssets: 10.3,
        returnOnCapitalEmployed: 17.7,
      },
      {
        month: "Mar",
        returnOnSales: 7.7,
        returnOnAssets: 10.5,
        returnOnCapitalEmployed: 17.9,
      },
      {
        month: "Apr",
        returnOnSales: 7.9,
        returnOnAssets: 10.7,
        returnOnCapitalEmployed: 18.1,
      },
      {
        month: "May",
        returnOnSales: 8.1,
        returnOnAssets: 10.9,
        returnOnCapitalEmployed: 18.3,
      },
      {
        month: "Jun",
        returnOnSales: 8.3,
        returnOnAssets: 11.1,
        returnOnCapitalEmployed: 18.5,
      },
      {
        month: "Jul",
        returnOnSales: 8.5,
        returnOnAssets: 11.3,
        returnOnCapitalEmployed: 18.7,
      },
      {
        month: "Aug",
        returnOnSales: 8.7,
        returnOnAssets: 11.5,
        returnOnCapitalEmployed: 18.9,
      },
      {
        month: "Sep",
        returnOnSales: 8.9,
        returnOnAssets: 11.7,
        returnOnCapitalEmployed: 19.1,
      },
      {
        month: "Oct",
        returnOnSales: 9.1,
        returnOnAssets: 11.9,
        returnOnCapitalEmployed: 19.3,
      },
    ],

    // --- INCOME STATEMENT ---
    netSales: 1000000, // (REVENUE)
    totalCosts: 500000, // COGS
    //grossProfit: netSales - totalCosts,

    administrativeExpenses: 100000,
    sellingExpenses: 100000, // CAN BE MERGED
    operatingExpenses: 200000, // CAN BE MERGED
    //sellingAndOperatingExpenses: sellingExpenses + operatingExpenses, // MERGE
    //totalOperatingExpenses: administrativeExpenses + sellingExpenses + operatingExpenses,
    //operatingProfit: grossProfit - totalExpenses, // EBITAD

    depreciation: 100000,
    otherIncome: 50000, // CAN BE MERGED
    otherExpenses: 25000, // CAN BE MERGED
    //otherIncomeAndExpenses: otherIncome - otherExpenses, // MERGE
    fixedAssetsSale: 100000, // GAIN/LOSS ON SALE OF ASSETS
    //incomeBeforeTax: operatingProfit + otherIncome -otherExpenses -depreciation +fixedAssetsSale,

    taxExpense: 50000,
    //netIncome: incomeBeforeTax - taxExpense,

    // --- BALANCE SHEET ---
    // ASSETS
    // CURRENT ASSETS
    cashAndBanks: 100000,
    customers: 50000,
    accountsReceivable: 50000,
    // INVENTORY
    //inventory: rawMaterials + goodsInProcess + finishedGoods,
    rawMaterials: 50000,
    goodsInProcess: 50000,
    finishedGoods: 100000,
    //totalCurrentAssets: cashAndBanks + customers + accountsReceivable + inventory,

    // FIXED ASSETS
    buildings: 100000,
    transportation: 50000,
    machinery: 50000,
    equipment: 100000,
    netAccumulatedDepreciation: 50000,
    others: 50000,
    //totalFixedAssets: buildings +transportation +machinery +equipment +others -netAccumulatedDepreciation,

    // TOTAL ASSETS
    //totalAssets: totalCurrentAssets + totalFixedAssets,

    // LIABILITIES
    // CURRENT LIABILITIES
    //currentLiabilities: suppliers+accountsPayable,
    suppliers: 50000,
    accountsPayable: 50000,
    //totalCurrentLiabilities: suppliers + accountsPayable,

    // LONG TERM LIABILITIES
    longtermAccountsPayable: 50000,
    //totalLongTermLiabilities: longtermAccountsPayable,

    // TOTAL LIABILITIES
    //totalLiabilities: totalCurrentLiabilities + totalLongTermLiabilities,

    // EQUITY
    capital: 100000,
    periodEarnings: 50000,
    retainedEarnings: 50000,

    // TOTAL EQUITY
    //totalEquity: capital + retainedEarnings + periodEarnings,

    // TOTAL LIABILITIES AND EQUITY
    //totalLiabilitiesAndEquity: totalLiabilities + totalEquity,

    // ordersData : [{
    //   date: "2024-08-11",
    //   products: "truck",
    //   quantity: 4,
    //   revenue: 112000
    // }, {
    //   date: "2024-04-23",
    //   product:"f1",
    //   quantity: 1,
    //   revenue: 83000 
    // }, {
    //   date: "2024-05-16",
    //   product: "buggy",
    //   quantity: 2,
    //   revenue: 65000
    // }, {
    //   date: "2024-02-24",
    //   product: "aston martin",
    //   quantity: 4,
    //   revenue: 104000
    // }], 

    ordersData: [
      { "date": "2024-08-11", "products": "truck", "quantity": 4, "revenue": 112000 },
    { "date": "2024-04-23", "product": "f1", "quantity": 1, "revenue": 83000 },
    { "date": "2024-05-16", "product": "buggy", "quantity": 2, "revenue": 65000 },
    { "date": "2024-02-24", "product": "aston martin", "quantity": 4, "revenue": 104000 },
    { "date": "2024-03-10", "product": "sedan", "quantity": 3, "revenue": 54000 },
    { "date": "2024-01-15", "product": "suv", "quantity": 5, "revenue": 150000 },
    { "date": "2024-07-08", "product": "coupe", "quantity": 2, "revenue": 64000 },
    { "date": "2024-09-18", "product": "convertible", "quantity": 1, "revenue": 72000 },
    { "date": "2024-06-22", "product": "hatchback", "quantity": 4, "revenue": 80000 },
    { "date": "2024-12-14", "product": "pickup", "quantity": 6, "revenue": 180000 },
    { "date": "2024-11-29", "product": "van", "quantity": 3, "revenue": 66000 },
    { "date": "2024-10-05", "product": "minivan", "quantity": 4, "revenue": 72000 },
    { "date": "2024-05-20", "product": "crossover", "quantity": 2, "revenue": 59000 },
    { "date": "2024-04-01", "product": "limousine", "quantity": 1, "revenue": 120000 },
    { "date": "2024-07-13", "product": "sport", "quantity": 2, "revenue": 150000 },
    { "date": "2024-03-08", "product": "luxury sedan", "quantity": 1, "revenue": 94000 },
    { "date": "2024-01-22", "product": "roadster", "quantity": 3, "revenue": 126000 },
    { "date": "2024-02-05", "product": "hybrid", "quantity": 2, "revenue": 46000 },
    { "date": "2024-09-01", "product": "electric", "quantity": 3, "revenue": 180000 },
    { "date": "2024-08-25", "product": "compact", "quantity": 5, "revenue": 75000 },
    { "date": "2024-06-14", "product": "wagon", "quantity": 2, "revenue": 48000 },
    { "date": "2024-07-19", "product": "luxury suv", "quantity": 4, "revenue": 260000 },
    { "date": "2024-12-01", "product": "performance", "quantity": 3, "revenue": 195000 },
    { "date": "2024-10-25", "product": "off-road", "quantity": 6, "revenue": 144000 },
    { "date": "2024-11-15", "product": "touring", "quantity": 2, "revenue": 90000 },
    { "date": "2024-02-13", "product": "supercar", "quantity": 1, "revenue": 300000 },
    { "date": "2024-03-26", "product": "micro", "quantity": 8, "revenue": 96000 },
    { "date": "2024-06-10", "product": "hypercar", "quantity": 1, "revenue": 1500000 },
    { "date": "2024-01-30", "product": "classic", "quantity": 3, "revenue": 54000 },
    { "date": "2024-09-07", "product": "vintage", "quantity": 1, "revenue": 250000 },
    {"date": "2024-06-12", "product": "supercar", "quantity": 8, "revenue": 2400000},
    {"date": "2024-08-09", "product": "off-road", "quantity": 6, "revenue": 144000},
    {"date": "2024-07-18", "product": "touring", "quantity": 9, "revenue": 405000},
    {"date": "2024-07-17", "product": "off-road", "quantity": 10, "revenue": 240000},
    {"date": "2024-12-18", "product": "touring", "quantity": 6, "revenue": 270000},
    {"date": "2024-05-06", "product": "touring", "quantity": 5, "revenue": 225000},
    {"date": "2024-03-25", "product": "touring", "quantity": 8, "revenue": 360000},
    {"date": "2024-07-21", "product": "off-road", "quantity": 7, "revenue": 168000},
    {"date": "2024-06-21", "product": "supercar", "quantity": 1, "revenue": 300000},
    {"date": "2024-05-06", "product": "supercar", "quantity": 2, "revenue": 600000},
    {"date": "2024-10-04", "product": "off-road", "quantity": 3, "revenue": 72000},
    {"date": "2024-07-16", "product": "touring", "quantity": 6, "revenue": 270000},
    {"date": "2024-09-20", "product": "supercar", "quantity": 6, "revenue": 180000},
    {"date": "2024-05-10", "product": "off-road", "quantity": 10, "revenue": 240000},
    {"date": "2024-12-27", "product": "touring", "quantity": 1, "revenue": 45000},
    {"date": "2024-10-10", "product": "off-road", "quantity": 4, "revenue": 96000},
    {"date": "2024-11-21", "product": "off-road", "quantity": 9, "revenue": 216000},
    {"date": "2024-04-17", "product": "off-road", "quantity": 7, "revenue": 168000},
    {"date": "2024-05-10", "product": "touring", "quantity": 8, "revenue": 360000},
    {"date": "2024-03-14", "product": "supercar", "quantity": 3, "revenue": 900000},
    {"date": "2024-01-27", "product": "off-road", "quantity": 8, "revenue": 192000},
    {"date": "2024-03-25", "product": "touring", "quantity": 8, "revenue": 360000},
    {"date": "2024-08-30", "product": "supercar", "quantity": 1, "revenue": 300000},
    {"date": "2024-05-10", "product": "off-road", "quantity": 7, "revenue": 168000},
    {"date": "2024-09-10", "product": "off-road", "quantity": 4, "revenue": 96000},
    {"date": "2024-11-06", "product": "supercar", "quantity": 9, "revenue": 270000},
    {"date": "2024-12-14", "product": "touring", "quantity": 7, "revenue": 315000},
    {"date": "2024-02-26", "product": "supercar", "quantity": 6, "revenue": 1800000},
    {"date": "2024-03-26", "product": "off-road", "quantity": 2, "revenue": 48000},
    {"date": "2024-09-20", "product": "touring", "quantity": 5, "revenue": 225000},
    {"date": "2024-10-24", "product": "supercar", "quantity": 9, "revenue": 270000},
    {"date": "2024-01-25", "product": "off-road", "quantity": 4, "revenue": 96000},
    {"date": "2024-01-16", "product": "supercar", "quantity": 10, "revenue": 3000000},
    {"date": "2024-08-18", "product": "off-road", "quantity": 3, "revenue": 72000},
    {"date": "2024-11-04", "product": "supercar", "quantity": 6, "revenue": 180000},
    {"date": "2024-01-23", "product": "supercar", "quantity": 5, "revenue": 1500000},
    {"date": "2024-03-28", "product": "touring", "quantity": 8, "revenue": 360000},
    {"date": "2024-11-27", "product": "touring", "quantity": 4, "revenue": 180000},
    {"date": "2024-07-04", "product": "touring", "quantity": 3, "revenue": 135000},
    {"date": "2024-04-24", "product": "touring", "quantity": 3, "revenue": 135000},
    {"date": "2024-12-22", "product": "f1", "quantity": 3, "revenue": 670000},
    {"date": "2024-12-08", "product": "buggy", "quantity": 4, "revenue": 230000},
    {"date": "2024-12-12", "product": "aston", "quantity": 1, "revenue": 115000},
    {"date": "2024-12-15", "product": "tractor", "quantity": 1, "revenue": 370000},
    {"date": "2024-12-19", "product": "buggy", "quantity": 4, "revenue": 340000},
    {"date": "2024-12-24", "product": "buggy", "quantity": 4, "revenue": 212000},
    {"date": "2024-12-26", "product": "buggy", "quantity": 4, "revenue": 230000},
    {"date": "2024-01-27", "product": "buggy", "quantity": 4, "revenue": 330000},
    {"date": "2025-01-01", "product": "buggy", "quantity": 4, "revenue": 230000},
    {"date": "2025-01-04", "product": "buggy", "quantity": 4, "revenue": 188000},
    {"date": "2025-01-08", "product": "buggy", "quantity": 4, "revenue": 90000},
    {"date": "2025-01-11", "product": "buggy", "quantity": 4, "revenue": 175000},
    {"date": "2025-01-15", "product": "buggy", "quantity": 4, "revenue": 175000},
    ]
    

  };

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      console.log("inside fetch data func")
      try {
        console.log("inside try for fetch data")
        const response = await fetch("/get-sim-info")

        const decoded = await response.json()
        console.log("decoded token: ", decoded)
        // setSim(JSON.parse(decoded))
        setSimData(decoded)
        setIsLoading(false)
        // console.log("commented out deciphering of sim token")
        // console.log("setting sim token with practice object: ")
        // console.log(simToken)
      } catch (e) {
        console.error("jwt validation failed ", e)
        setError(true)
        setIsLoading(false)
      }
    }

    // fetchData()
    setTimeout(() => {
      setError(false)
      setIsLoading(false)
      setSimData(simToken)

      if (error) {
        console.log("was error")
        navigate('/error')
      }
      // if (simData == null) {
      //   console.log("simData was null")
      //   navigate('/error')
      // }

    }, 4000)
  }, [])

  return (
    <SimDataContext.Provider value={{ simData, isLoading, error }}>
      {children}
    </SimDataContext.Provider>
  );
};
