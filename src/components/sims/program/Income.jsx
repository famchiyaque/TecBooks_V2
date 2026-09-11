import React, { useMemo } from "react";
import useIncome from "@/hooks/sims/project/useIncome";
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
      <CollapsibleSection title="Utility Cost" defaultExpanded>
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
