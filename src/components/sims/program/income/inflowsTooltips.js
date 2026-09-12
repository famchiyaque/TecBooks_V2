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
    competitivePrice: "salePrice × (1 + inflation[year])^yearIndex",
  },
  sales: {
    table:
      "Revenue from selling that year's projected purchase orders at that year's unit price.",
    sales: "Unit Price × projected purchase orders",
  },
  utilityPrice: {
    table:
      "Suggested selling prices at a 10%, 20%, and 30% markup over total unit cost.",
    10: "Total Unit Cost × 1.1",
    20: "Total Unit Cost × 1.2",
    30: "Total Unit Cost × 1.3",
  },
};
