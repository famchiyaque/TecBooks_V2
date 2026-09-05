import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

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
    const rawMaterials = { concept: "Raw Materials" };
    const directLabor = { concept: "Direct Labor (MOD)" };
    const indirectLabor = { concept: "Indirect Labor (MOI)" };
    const engineering = { concept: "Engineering" };
    const administrative = { concept: "Administrative Labor" };
    const adminExpenses = { concept: "Administrative Expenses" };
    const total = { concept: "Total Production Cost", rowVariant: "total" };

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
    <TableContainer title="Production Costs" columns={columns} rows={rows} />
  );
}

export default ProductionCostTable;
