export function computeAdminExpenses(project) {
  const years = project?.timeline?.years ?? [];
  const inflationRates = project?.premises?.nationalInflation ?? [];
  const services = project?.services ?? [];

  const baseAmount = services.reduce(
    (sum, service) => sum + (service?.monthlyAmount ?? 0),
    0,
  ) * 12;

  const adminExpensesAll = {};
  let running = baseAmount;

  years.forEach((year, idx) => {
    if (idx === 0) {
      adminExpensesAll[year] = baseAmount;
      return;
    }
    const rate = inflationRates[idx] ?? 0;
    running *= 1 + rate;
    adminExpensesAll[year] = running;
  });

  return adminExpensesAll;
}