import React, { useMemo } from "react";
import useIncome from "@/hooks/sims/project/useIncome";
import TableContainer from "@/components/global/TableContainer";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import { buildProductionCostRows } from "./income/ProductionCostTable";
import { buildUtilityCostRows } from "./income/UtilityCostTable";
import { buildCompetitivePriceRows } from "./income/CompetitivePriceTable";
import { buildSalesRows } from "./income/SalesTable";
import { INFLOWS_TOOLTIPS } from "./income/inflowsTooltips";

function Income({ project, currency }) {
  const income = useIncome(project);

  const years = useMemo(
    () =>
      Object.keys(income?.productionCosts?.total ?? {})
        .map(Number)
        .sort((a, b) => a - b),
    [income],
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

  const costSections = useMemo(
    () => [
      {
        id: "unit-costs",
        title: "Unit Costs",
        titleTooltip: INFLOWS_TOOLTIPS.unitCosts.table,
        defaultExpanded: true,
        rows: buildProductionCostRows(income.productionCosts, years),
      },
      {
        id: "unit-price",
        title: "Unit Price",
        titleTooltip: INFLOWS_TOOLTIPS.unitPrice.table,
        defaultExpanded: true,
        rows: buildCompetitivePriceRows(income.competitivaPrice, years),
      },
    ],
    [income, years],
  );

  const salesSections = useMemo(
    () => [
      {
        id: "sales",
        title: "Sales",
        titleTooltip: INFLOWS_TOOLTIPS.sales.table,
        defaultExpanded: true,
        rows: buildSalesRows({
          customerOrders: income.customerOrders,
          unitPrice: income.competitivaPrice,
          sales: income.sales,
          years,
        }),
      },
      {
        id: "unit-profit-margen",
        title: "Unit Profit Margen",
        titleTooltip: INFLOWS_TOOLTIPS.utilityPrice.table,
        defaultExpanded: true,
        rows: buildUtilityCostRows(income.utilityCost, years),
      },
    ],
    [income, years],
  );

  return (
    <div className="flex flex-col mt-3 p-3">
      <p className="mb-3 text-[17.5px] text-slate-500">
        This tab describes inflows by unit: the numbers break down sales
        and how they relate to the unit price of each BOM.
      </p>

      <CollapsibleSection title="Sales & Unit Profit Margen" defaultExpanded>
        <TableContainer columns={columns} sections={salesSections} layout="fixed" currency={currency} />
      </CollapsibleSection>

      <CollapsibleSection title="Unit Costs & Unit Price" defaultExpanded>
        <TableContainer columns={columns} sections={costSections} layout="fixed" currency={currency} />
      </CollapsibleSection>
    </div>
  );
}

export default Income;
