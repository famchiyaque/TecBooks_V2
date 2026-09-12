import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";
import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

/**
 * ProductionCostTable component
 *
 * This component renders a table displaying production costs for a given period.
 * It takes a `productionCosts` prop which is an object containing various production cost data.
 *
 * @param {Object} productionCosts - An object containing production cost data.
 * @returns {JSX.Element} The rendered table.
 */
function ProductionCostTable({ productionCosts }) {
  const years = useMemo(
    () =>
      Object.keys(productionCosts?.total ?? {})
        .map(Number)
        .sort((a, b) => a - b),
    [productionCosts],
  );

  const columns = useMemo(
    () => [
      { key: "concept", label: "" },
      ...years.map((year) => ({
        key: String(year),
        label: String(year),
        align: "right",
        type: "currency",
      })),
    ],
    [years],
  );

  const rows = useMemo(() => {
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
  }, [years, productionCosts]);

  return (
    <TableContainer
      title="Unit Costs"
      titleTooltip={INFLOWS_TOOLTIPS.unitCosts.table}
      columns={columns}
      rows={rows}
    />
  );
}

export default ProductionCostTable;
