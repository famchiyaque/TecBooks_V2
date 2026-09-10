import React from "react";
import useBalance from "@/hooks/sims/project/useBalance";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import FixedAssetsTable from "@/components/dashboard/FixedAssetsTable";

function Balance({ project }) {
  const balance = useBalance(project);

  return (
    <CollapsibleSection title="Fixed Assets" defaultExpanded>
      <FixedAssetsTable
        byCategory={balance.actives?.fixedAssetsByCategory}
        total={balance.actives?.fixedAssets}
      />
    </CollapsibleSection>
  );
}

export default Balance;
