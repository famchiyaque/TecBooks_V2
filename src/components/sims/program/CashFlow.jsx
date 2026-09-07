import React from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import CashTable from "@/sims/project-feasibility/costTable/CashTable.jsx";
import OutflowsTable from "@/sims/project-feasibility/costTable/OutflowsTable.jsx";

function CashFlow({ project }) {
  return (
    <>
      <CollapsibleSection title="Cash Inflows" defaultExpanded>
        <CashTable project={project} />
      </CollapsibleSection>
      <CollapsibleSection title="Cash Outflows">
        <OutflowsTable project={project} />
      </CollapsibleSection>
    </>
  );
}

export default CashFlow;
