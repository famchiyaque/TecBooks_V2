import { useEffect, useState } from "react";

export default function useExpenses(data) {
  const [adminExpenses, setAdminExpenses] = useState(null);
  const [investment, setInvestment] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!data) return;

    const adminExpensesAll = calculateAdminExpenses(data);
    setAdminExpenses(adminExpensesAll);

    const investmentFormatted = formatExpenses(data);
    setInvestment(investmentFormatted);

    const servicesFormatted = formatServices(data);
    setServices(servicesFormatted);
  }, [data]);

  return {
    adminExpenses,
    investment,
    services,
  };
}

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

function formatExpenses(data) {
  const pairName = {
    buildings: "Edificio",
    computer: "Equipo de Cómputo",
    machine: "Maquinaria y Equipo",
    transport: "Transporte",
    workCapital: "Capital de Trabajo",
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
    concept: "Obra civil Maquinaria y Equipo",
    amount: machineExpense * 0.35,
  });

  return investments;
}

function formatServices(data) {
  const items = data.serviceExpenses;
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    categoria: item.category,
    subcategoria: item.subcategory,
    descripcion: item.description,
    rangoMensual: item.default_cost,
    notas: item.notes,
  }));
}
