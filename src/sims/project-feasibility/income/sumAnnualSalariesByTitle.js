const TITLE_TO_KEY = {
  direct: "MOD",
  indirect: "MOIndirecta",
  engineering: "Ingenieria",
  administrative: "Administrative",
};

/**
 * Labor bucket from the employee title. There is no category column on
 * employees — see technical-debt.md.
 */
export function classifyLaborCategory(name) {
  const upper = String(name ?? "").toUpperCase();
  if (upper.includes("MOID")) return "indirect";
  if (upper.startsWith("MOD ")) return "direct";
  if (
    upper.startsWith("IM ") ||
    upper.includes("INGENIERO") ||
    upper === "GERENTE DE OPERACIONES"
  ) {
    return "engineering";
  }
  return "administrative";
}

/**
 * Year-0 annual salary by labor bucket: 12 × monthly salary × headcount.
 * Not tied to purchase orders or work orders.
 */
export function sumAnnualSalariesByTitle(employees) {
  const totals = {
    MOD: 0,
    MOIndirecta: 0,
    Ingenieria: 0,
    Administrative: 0,
  };

  for (const employee of employees ?? []) {
    const key = TITLE_TO_KEY[classifyLaborCategory(employee.name)];
    const quantity = Number(employee.quantity) || 0;
    const monthlySalary = Number(employee.monthlySalary) || 0;
    totals[key] += quantity * monthlySalary * 12;
  }

  return totals;
}
