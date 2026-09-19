export const INFLOWS_TOOLTIPS = {
  unitCosts: {
    table:
      "This table breaks down the cost to produce each unit by calculating each aspect of production per the amount of units needed to satisfy purchase orders. Work orders = purchase orders ÷ quality yield.",
    rawMaterials: "BOM price / quality yield",
    directLabor: "Total Annual Direct Labor Salaries / purchase orders",
    indirectLabor: "Total Annual Indirect Labor Salaries / purchase orders",
    engineering: "Total Annual Engineering Salaries / purchase orders",
    administrativeLabor: "Total Annual Administrative Salaries / purchase orders",
    adminExpenses: "Total Annual Administrative Expenses / purchase orders",
    total: "Sum of the unit-cost rows above",
  },
  unitPrice: {
    table:
      "Calculates the price of each unit currently and to account for inflation in the future.",
    competitivePrice:
      "BOM sale price compounded by each year's own national inflation rate",
  },
  sales: {
    table:
      "Sales estimate for the projection horizon. Derived: Customer Orders come from the demand module, the unit price from the pricing module, and only the total income is computed here.",
    customerOrders:
      "Projected customer orders for the year. The first year is a partial ramp-up, so its volume is taken as-is and never scaled.",
    unitPrice: "Unit sale price for that year, from the pricing module",
    sales: "Customer Orders × Unit Price",
  },
  utilityPrice: {
    table:
      "Suggested selling prices at a 10%, 20%, and 30% profit margin on price: unit cost / (1 − margin).",
    10: "Total Unit Cost / (1 − 0.10)",
    20: "Total Unit Cost / (1 − 0.20)",
    30: "Total Unit Cost / (1 − 0.30)",
  },
};
