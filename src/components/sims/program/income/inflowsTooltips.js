export const INFLOWS_TOOLTIPS = {
  unitCosts: {
    table:
      "This table breaks down the cost to produce each unit by calculating each aspect of production per the amount of units needed to satisfy purchase orders. Work orders = purchase orders ÷ quality yield.",
    rawMaterials: "BOM price / work orders",
    directLabor: "Total Annual Direct Labor Salaries / work orders",
    indirectLabor: "Total Annual Indirect Labor Salaries / work orders",
    engineering: "Total Annual Engineering Salaries / work orders",
    administrativeLabor: "Total Annual Administrative Salaries / work orders",
    adminExpenses: "Total Annual Administrative Expenses / work orders",
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
      "Suggested selling prices at a 10%, 20%, and 30% markup over total unit cost.",
    10: "Total Unit Cost × 1.1",
    20: "Total Unit Cost × 1.2",
    30: "Total Unit Cost × 1.3",
  },
};
