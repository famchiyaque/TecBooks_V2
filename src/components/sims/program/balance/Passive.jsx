import React, { useState } from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import { passiveSlice, createPassiveStore } from "@/store/balance.store";
import { Provider } from "react-redux";
import EditableTable from "@/components/global/EditableTable";
import GrandTotalTable from "@/components/global/GrandTotalTable";

export const CURRENT_PASSIVES = [
  { key: "documents", label: "Short-term notes payable" },
  { key: "provider", label: "Product suppliers" },
];

export const LONG_TERM_PASSIVES = [
  { key: "currentCapital", label: "Current Capital" },
  { key: "interestsPayment", label: "Interests Payments" },
];

function Passive({ passives }) {
  const [store] = useState(() => createPassiveStore());

  const columns = Object.keys(passives.currentPassives).map((year) => ({
    key: year,
    label: year,
  }));
  const getCurrentPassiveValue = (rowKey, year) =>
    passives.currentPassives[year]?.[rowKey] ?? 0;

  const getLongTermPassivesValue = (rowKey, year) =>
    passives.longTermPassives[year]?.[rowKey] ?? 0;

  return (
    <CollapsibleSection title="Passives">
      <Provider store={store}>
        <EditableTable
          title="Current Passives"
          slice={passiveSlice}
          columns={columns}
          rows={CURRENT_PASSIVES}
          getValue={getCurrentPassiveValue}
          totalLabel="Total Current Passives"
        />
        <EditableTable
          title="Long term passives"
          slice={passiveSlice}
          columns={columns}
          rows={LONG_TERM_PASSIVES}
          getValue={getLongTermPassivesValue}
          totalLabel="Total Long Term Passives"
        />
        <GrandTotalTable
          title="Total Passives"
          columns={columns}
          sources={[
            {
              slice: passiveSlice,
              rows: CURRENT_PASSIVES,
              getValue: getCurrentPassiveValue,
            },
            {
              slice: passiveSlice,
              rows: LONG_TERM_PASSIVES,
              getValue: getLongTermPassivesValue,
            },
          ]}
        />
      </Provider>
    </CollapsibleSection>
  );
}

export default Passive;
