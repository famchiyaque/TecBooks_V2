import React from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import CashTable from "@/sims/project-feasibility/costTable/CashTable.jsx";
import OutflowsTable from "@/sims/project-feasibility/costTable/OutflowsTable.jsx";
import ProjectEvaluationSummary from "@/sims/project-feasibility/costTable/ProjectEvaluationSummary.jsx";
import NetFlowGraph from "@/sims/project-feasibility/costTable/NetFlowGraph.jsx";
import { buildCostOfSales } from "@/sims/project-feasibility/costTable/buildCostOfSales.js"

function CashFlow({ project }) {
  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])

  return (
    <>
      <CollapsibleSection title="Cash Inflows" defaultExpanded>
        <CashTable project={project} result={result} />
      </CollapsibleSection>
      <CollapsibleSection title="Cash Outflows">
        <OutflowsTable project={project} result={result}/>
      </CollapsibleSection>
      <CollapsibleSection title="Net Flow Graph">
        <NetFlowGraph project={project} result={result} />
      </CollapsibleSection>
      <CollapsibleSection title="TREMA / TIR / VNA">
        <ProjectEvaluationSummary project={project} result={result}/>
      </CollapsibleSection>
    </>
  );
}

export default CashFlow;
