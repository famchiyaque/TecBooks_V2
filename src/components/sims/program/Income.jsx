import React from "react";
import useIncome from "@/hooks/sims/project/useIncome";
import ProductionCostTable from "./income/ProductionCostTable";
import CollapsibleSection from "@/components/global/CollapsibleSection";

function Income({ project }) {
  const income = useIncome(project);

  return (
    <div className="flex flex-col mt-3 p-3">
      <CollapsibleSection title="ProductionCost" defaultExpanded>
        <ProductionCostTable productionCosts={income.productionCosts} />
      </CollapsibleSection>
    </div>
  );
}

export default Income;
