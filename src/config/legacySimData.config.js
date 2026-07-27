/**
 * Static data for legacy dashboard sections
 * Copied from MxRep/utils/contexts/example.data.js
 */

export const simToken = {
    userName: "Demo User",
    teamName: "Demo Team",
    product: "Manufacturing Product",
    placement: "1",
    startDate: "2024-01-01",
    currentDate: "2025-01-21",
    leaderboard: 1,
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
      {"date": "2024-12-01", "hoursRunning": 8, "unitsProduced": 10 , "minutesDown": 55},
      {"date": "2024-12-02", "hoursRunning": 8, "unitsProduced": 14 , "minutesDown": 45},
      {"date": "2024-12-25", "hoursRunning": 8, "unitsProduced": 17 , "minutesDown": 80}
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
      { "name": "axis", "count": 130 }
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
      axis: 2
    },

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
        month: "Oct",
        returnOnSales: 9.1,
        returnOnAssets: 11.9,
        returnOnCapitalEmployed: 19.3,
      },
    ],

    // Income Statement
    netSales: 1000000,
    totalCosts: 500000,
    administrativeExpenses: 100000,
    sellingExpenses: 100000,
    operatingExpenses: 200000,
    depreciation: 100000,
    otherIncome: 50000,
    otherExpenses: 25000,
    fixedAssetsSale: 100000,
    taxExpense: 50000,

    // Balance Sheet
    cashAndBanks: 100000,
    customers: 50000,
    accountsReceivable: 50000,
    rawMaterials: 50000,
    goodsInProcess: 50000,
    finishedGoods: 100000,
    buildings: 100000,
    transportation: 50000,
    machinery: 50000,
    equipment: 100000,
    netAccumulatedDepreciation: 50000,
    others: 50000,
    suppliers: 50000,
    accountsPayable: 50000,
    longtermAccountsPayable: 50000,
    capital: 100000,
    periodEarnings: 50000,
    retainedEarnings: 50000,

    ordersData: [
      { "date": "2024-08-11", "products": "truck", "quantity": 4, "revenue": 112000 },
      { "date": "2024-04-23", "product": "f1", "quantity": 1, "revenue": 83000 },
      { "date": "2024-05-16", "product": "buggy", "quantity": 2, "revenue": 65000 },
      { "date": "2024-12-22", "product": "f1", "quantity": 3, "revenue": 670000 },
    ]
}
