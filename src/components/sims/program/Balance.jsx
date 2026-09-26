import React from "react";
import useBalance from "@/hooks/sims/project/useBalance";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import FixedAssetsTable from "@/components/dashboard/FixedAssetsTable";
import CurrentActives from "./balance/CurrentActives.jsx";
import DeferedActives from "./balance/DeferedActives.jsx";
import Passive from "./balance/Passive.jsx";
import Equity from "./balance/Equity.jsx";

function Balance({ project, currency }) {
  const balance = useBalance(project);

  return (
    <div className="flex flex-col mt-3 p-3">
      <CollapsibleSection title="CurrentActives" defaultExpanded>
        <CurrentActives currentActives={balance.actives.currentActives} currency={currency}/>
      </CollapsibleSection>

      <CollapsibleSection title="Fixed Assets" defaultExpanded>
        <FixedAssetsTable
          byCategory={balance.actives?.fixedAssetsByCategory}
          total={balance.actives?.fixedAssets}
          currency={currency}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Defered Actives">
        <DeferedActives deferedActives={balance.actives?.deferedActives} currency={currency}/>
      </CollapsibleSection>

      <Passive passives={balance.passives} currency={currency} />

      <CollapsibleSection title="Shareholder's equity">
        <Equity project={project} currency={currency}/>
      </CollapsibleSection>
    </div>
  );
}

export default Balance;
