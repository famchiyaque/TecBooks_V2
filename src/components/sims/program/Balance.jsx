import React from "react";
import useBalance from "@/hooks/sims/project/useBalance";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import CurrentActives from "./balance/CurrentActives.jsx";
import Active from "./balance/Active.jsx";
import GeneralBalance from "./balance/GeneralBalance.jsx";
import Passive from "./balance/Passive.jsx";
import Utility from "./balance/Utility.jsx";

function Balance({ project }) {
  const balance = useBalance(project);

  return (
    <div className="flex flex-col mt-3 p-3">
      <CollapsibleSection title="CurrentActives" defaultExpanded>
        <CurrentActives
          currentActives={balance.actives.currentActives}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Administrative Expenses">
        <Active balance={balance.actives} />
      </CollapsibleSection>

      <CollapsibleSection title="Investment & Services">
        <GeneralBalance />
      </CollapsibleSection>

      <CollapsibleSection title="Amortization & Interest">
        <Passive />
      </CollapsibleSection>

      <CollapsibleSection title="Amortization & Interest">
        <Utility />
      </CollapsibleSection>
    </div>
  );
}

export default Balance;
