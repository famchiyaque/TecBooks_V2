import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

/**
 * Unit-cost rows for the Inflows joined table.
 * `years` is the shared horizon so every section uses the same column keys.
 */
export function buildProductionCostRows(productionCosts, years) {
  const rawMaterials = {
    concept: "Raw Materials",
    tooltip: INFLOWS_TOOLTIPS.unitCosts.rawMaterials,
  };
  const directLabor = {
    concept: "Direct Labor (MOD)",
    tooltip: INFLOWS_TOOLTIPS.unitCosts.directLabor,
  };
  const indirectLabor = {
    concept: "Indirect Labor (MOI)",
    tooltip: INFLOWS_TOOLTIPS.unitCosts.indirectLabor,
  };
  const engineering = {
    concept: "Engineering",
    tooltip: INFLOWS_TOOLTIPS.unitCosts.engineering,
  };
  const administrative = {
    concept: "Administrative Labor",
    tooltip: INFLOWS_TOOLTIPS.unitCosts.administrativeLabor,
  };
  const adminExpenses = {
    concept: "Administrative Expenses",
    tooltip: INFLOWS_TOOLTIPS.unitCosts.adminExpenses,
  };
  const total = {
    concept: "Total Production Cost",
    rowVariant: "total",
    tooltip: INFLOWS_TOOLTIPS.unitCosts.total,
  };

  years.forEach((year) => {
    const key = String(year);
    const wf = productionCosts?.workForce?.[key] ?? {};

    rawMaterials[key] = productionCosts?.costRawMaterials?.[key];
    directLabor[key] = wf.MOD;
    indirectLabor[key] = wf.MOIndirecta;
    engineering[key] = wf.Ingenieria;
    administrative[key] = wf.Administrative;
    adminExpenses[key] = productionCosts?.adminExpenses?.[key];
    total[key] = productionCosts?.total?.[key];
  });

  return [
    rawMaterials,
    directLabor,
    indirectLabor,
    engineering,
    administrative,
    adminExpenses,
    total,
  ];
}
