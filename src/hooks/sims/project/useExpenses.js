import { useEffect, useState } from "react";

export default function useExpenses(data) {
  const [adminExpenses, setAdminExpenses] = useState(null);
  const [investment, setInvestment] = useState([]);
  const [services, setServices] = useState([]);
  const [finances, setFinances] = useState([]);

  useEffect(() => {
    if (!data) return;

    const adminExpensesAll = calculateAdminExpenses(data);
    setAdminExpenses(adminExpensesAll);

    const investmentFormatted = formatExpenses(data);
    setInvestment(investmentFormatted);

    const servicesFormatted = formatServices(data);
    setServices(servicesFormatted);

    const financesFormatted = formatFinancialExpenses(data);
    setFinances(financesFormatted);
  }, [data]);

  return {
    adminExpenses,
    investment,
    services,
    finances,
  };
}

// Administrative expenses table
function calculateAdminExpenses(data) {
  const adminExpensesFirst = data.serviceExpenses.reduce((acc, curr) => {
    return (acc += curr.default_cost);
  }, 0);

  const adminExpensesAll = data.years.reduce((acc, curr, idx) => {
    acc[curr] = adminExpensesFirst * Math.pow(1 - data.inflation, idx);
    return acc;
  }, {});

  return adminExpensesAll;
}

// Invetment Table
function formatExpenses(data) {
  const pairName = {
    buildings: "Building",
    computer: "Computer Equipment",
    machine: "Machinery and Equipment",
    transport: "Transportation",
    workCapital: "Working Capital",
  };
  const investments = [];

  data.investments.assetExpenses.forEach((asset) =>
    investments.push({
      concept: pairName[asset.category],
      amount: asset.assetExpense,
    }),
  );

  const machineExpense = data.investments.assetExpenses.filter(
    (a) => a.category == "machine",
  )[0].assetExpense;

  investments.push({
    concept: pairName.workCapital,
    amount: data.investments.workforceCapital,
  });

  investments.push({
    concept: "Civil Works - Machinery and Equipment",
    amount: machineExpense * 0.35,
  });

  return investments;
}

// Services Table
function formatServices(data) {
  const items = data.serviceExpenses;
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    category: item.category,
    subcategory: item.subcategory,
    description: item.description,
    monthlyRange: item.default_cost,
    notes: item.notes,
  }));
}

function formatFinancialExpenses(data) {
  if (!data || !data.expenses || !Array.isArray(data.years)) {
    return [];
  }

  const { amortization, interests = [] } = data.expenses;
  const years = data.years;

  const annualAmortization = (amortization || 0) * 12;

  const amortizationValues = {};
  const interestValues = {};

  let loanFinished = false;

  years.forEach((year, idx) => {
    if (loanFinished) {
      interestValues[year] = NaN;
      amortizationValues[year] = NaN;
      return;
    }

    const startIndex = idx * 12;
    const yearInterests = interests.slice(startIndex, startIndex + 12);
    const sumInterests = yearInterests.reduce((sum, curr) => sum + curr, 0);

    interestValues[year] = sumInterests;
    amortizationValues[year] = annualAmortization;

    if (sumInterests === 0) {
      loanFinished = true;
    }
  });

  return [
    {
      concept: "Loan Amortization",
      values: amortizationValues,
    },
    {
      concept: "Accrued Interest",
      values: interestValues,
    },
  ];
}
