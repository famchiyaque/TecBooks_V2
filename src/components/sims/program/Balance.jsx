import React from "react";
import useBalance from "@/hooks/sims/project/useBalance";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import FixedAssetsTable from "@/components/dashboard/FixedAssetsTable";
import CurrentActives from "./balance/CurrentActives.jsx";
import Passive from "./balance/Passive.jsx";
import Equity from "./balance/Equity.jsx";

function Balance({ project }) {
  const balance = useBalance(project);

  return (
    <div className="flex flex-col mt-3 p-3">
      <CollapsibleSection title="CurrentActives" defaultExpanded>
        <CurrentActives currentActives={balance.actives.currentActives} />
      </CollapsibleSection>

      <CollapsibleSection title="Fixed Assets" defaultExpanded>
        <FixedAssetsTable
          byCategory={balance.actives?.fixedAssetsByCategory}
          total={balance.actives?.fixedAssets}
        />
      </CollapsibleSection>

      <Passive passives={balance.passives} />

      <CollapsibleSection title="Shareholder's equity">
        <Equity equity={balance.equity} />
      </CollapsibleSection>
    </div>
  );
}

export default Balance;
