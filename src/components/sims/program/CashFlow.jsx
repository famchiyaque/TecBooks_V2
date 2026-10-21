import React from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import CashTable from "@/sims/project-feasibility/costTable/CashTable.jsx";
import OutflowsTable from "@/sims/project-feasibility/costTable/OutflowsTable.jsx";
import ProjectEvaluationSummary from "@/sims/project-feasibility/costTable/ProjectEvaluationSummary.jsx";
import NetFlowGraph from "@/sims/project-feasibility/costTable/NetFlowGraph.jsx";

function CashFlow({ project, currency }) {
  return (
    <>
      <CollapsibleSection title="Cash Inflows" defaultExpanded>
        <CashTable project={project} currency={currency}/>
      </CollapsibleSection>
      <CollapsibleSection title="Cash Outflows">
        <OutflowsTable project={project} currency={currency}/>
      </CollapsibleSection>
      <CollapsibleSection title="Net Flow Graph">
        <NetFlowGraph project={project} currency={currency}/>
      </CollapsibleSection>
      <CollapsibleSection title="TREMA / TIR / VNA">
        <ProjectEvaluationSummary project={project} currency={currency}/>
      </CollapsibleSection>
    </>
  );
}

export default CashFlow;
