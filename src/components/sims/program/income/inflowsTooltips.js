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
    competitivePrice: "salePrice × (1 + inflation[year])^yearIndex",
  },
  sales: {
    table:
      "Revenue from selling that year's projected purchase orders at that year's unit price.",
    sales: "Unit Price × projected purchase orders",
  },
  utilityPrice: {
    table:
      "Suggested selling prices at a 10%, 20%, and 30% profit margin on price: unit cost / (1 − margin).",
    10: "Total Unit Cost / (1 − 0.10)",
    20: "Total Unit Cost / (1 − 0.20)",
    30: "Total Unit Cost / (1 − 0.30)",
  },
};
