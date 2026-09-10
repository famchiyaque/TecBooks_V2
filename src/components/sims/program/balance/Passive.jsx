import React, { useState } from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import { passiveSlice, createPassiveStore } from "@/store/balance.store";
import { Provider } from "react-redux";
import EditableTable from "@/components/global/EditableTable";

export const CURRENT_PASSIVES = [
  { key: "documents", label: "Short-term notes payable" },
  { key: "provider", label: "Product suppliers" },
];

function Passive({ passives }) {
  const [store] = useState(() => createPassiveStore());

  const columns = Object.keys(passives.currentPassives).map((year) => ({
    key: year,
    label: year,
  }));
  const getCurrentPassiveValue = (rowKey, year) =>
    passives.currentPassives[year]?.[rowKey] ?? 0;

  return (
    <CollapsibleSection title="Pasivos">
      <Provider store={store}>
        <EditableTable
          title="Current Passives"
          slice={passiveSlice}
          columns={columns}
          rows={CURRENT_PASSIVES}
          getValue={getCurrentPassiveValue}
          totalLabel="Total Current Passives"
        />
        {/* <EditableTable
            title="Long term passives"
            slice={passiveSlice}
            columns={columns}
            rows={COST_ROWS}
            getValue={getValue}
            totalLabel="Total Current Actives"
          /> */}
      </Provider>
    </CollapsibleSection>
  );
}

export default Passive;
