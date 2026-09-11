import React, { useMemo } from "react";
import useIncome from "@/hooks/sims/project/useIncome";
import ProductionCostTable from "./income/ProductionCostTable";
import UtilityCostTable from "./income/UtilityCostTable";
import CompetitivePriceTable from "./income/CompetitivePriceTable";
import CollapsibleSection from "@/components/global/CollapsibleSection";

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

      <CollapsibleSection title="ProductionCost" defaultExpanded>
        <ProductionCostTable productionCosts={income.productionCosts} />
      </CollapsibleSection>

      <CollapsibleSection title="Utility Cost">
        <UtilityCostTable
          utilityCost={income.utilityCost}
          baseYear={baseYear}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Competitive Price">
        <CompetitivePriceTable
          competitivaPrice={income.competitivaPrice}
          baseYear={baseYear}
        />
      </CollapsibleSection>
    </div>
  );
}

export default Income;
