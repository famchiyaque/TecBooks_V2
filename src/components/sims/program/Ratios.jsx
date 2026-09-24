import React from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import ProjectCostSummary from "@/sims/project-feasibility/costTable/ProjectCostSummary.jsx";
import ProfitSummary from "@/sims/project-feasibility/costTable/ProfitSummary.jsx";
import BreakEvenSummary from "@/sims/project-feasibility/costTable/BreakEvenSummary.jsx";

function Ratios({ project }) {
  return (
    <>
      <CollapsibleSection title="Cost Table" defaultExpanded>
        <ProjectCostSummary project={project} />
      </CollapsibleSection>
      <CollapsibleSection title="Profit Summary" defaultExpanded>
        <ProfitSummary project={project} />
      </CollapsibleSection>
      <CollapsibleSection title="Break-even Point">
        <BreakEvenSummary project={project} />
      </CollapsibleSection>
    </>
  );
}

export default Ratios;
