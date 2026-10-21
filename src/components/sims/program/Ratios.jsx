import React from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import ProjectCostSummary from "@/sims/project-feasibility/costTable/ProjectCostSummary.jsx";
import ProfitSummary from "@/sims/project-feasibility/costTable/ProfitSummary.jsx";
import BreakEvenSummary from "@/sims/project-feasibility/costTable/BreakEvenSummary.jsx";

function Ratios({ project, currency }) {
  return (
    <>
      <CollapsibleSection title="Cost Table" defaultExpanded>
        <ProjectCostSummary project={project} currency={currency}/>
      </CollapsibleSection>
      <CollapsibleSection title="Profit Summary" defaultExpanded>
        <ProfitSummary project={project} currency={currency}/>
      </CollapsibleSection>
      <CollapsibleSection title="Break-even Point">
        <BreakEvenSummary project={project} currency={currency}/>
      </CollapsibleSection>
    </>
  );
}

export default Ratios;
