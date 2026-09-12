import React from "react";
import useBalance from "@/hooks/sims/project/useBalance";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import FixedAssetsTable from "@/components/dashboard/FixedAssetsTable";
import CurrentActives from "./balance/CurrentActives.jsx";
import DeferedActives from "./balance/DeferedActives.jsx";
import Passive from "./balance/Passive.jsx";
import Utility from "./balance/Utility.jsx";

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

      <CollapsibleSection title="Defered Actives">
        <DeferedActives deferedActives={balance.actives?.deferedActives} />
      </CollapsibleSection>

      <Passive passives={balance.passives} />

      <CollapsibleSection title="Amortization & Interest">
        <Utility />
      </CollapsibleSection>
    </div>
  );
}

export default Balance;
