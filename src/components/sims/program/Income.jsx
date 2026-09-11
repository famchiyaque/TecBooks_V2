import React, { useMemo } from "react";
import useIncome from "@/hooks/sims/project/useIncome";
import ProductionCostTable from "./income/ProductionCostTable";
import UtilityCostTable from "./income/UtilityCostTable";
import CompetitivePriceTable from "./income/CompetitivePriceTable";
import SalesTable from "./income/SalesTable";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import { INFLOWS_TOOLTIPS } from "./income/inflowsTooltips";

function Income({ project }) {
  const income = useIncome(project);

  const baseYear = useMemo(() => {
    const years = Object.keys(income?.productionCosts?.total ?? {})
      .map(Number)
      .sort((a, b) => a - b);
    return years[0];
  }, [income]);

  return (
    <div className="flex flex-col mt-3 p-3">
      <p className="mb-3 text-sm text-slate-500">
        This tab describes inflows by unit: the numbers break down sales
        and how they relate to the unit price of each BOM.
      </p>

      <CollapsibleSection
        title="Unit Costs"
        tooltip={INFLOWS_TOOLTIPS.unitCosts.table}
        defaultExpanded
      >
        <ProductionCostTable productionCosts={income.productionCosts} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Unit Price"
        tooltip={INFLOWS_TOOLTIPS.unitPrice.table}
      >
        <CompetitivePriceTable
          competitivaPrice={income.competitivaPrice}
          baseYear={baseYear}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Sales" tooltip={INFLOWS_TOOLTIPS.sales.table}>
        <SalesTable sales={income.sales} baseYear={baseYear} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Utility Price"
        tooltip={INFLOWS_TOOLTIPS.utilityPrice.table}
      >
        <UtilityCostTable
          utilityCost={income.utilityCost}
          baseYear={baseYear}
        />
      </CollapsibleSection>
    </div>
  );
}

export default Income;
