import React, { useState } from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import { passiveSlice, createPassiveStore } from "@/store/balance.store";
import { Provider } from "react-redux";
import EditableTable from "@/components/global/EditableTable";
import GrandTotalTable from "@/components/global/GrandTotalTable";

// No fixed rows - Current Passives (Documentos por pagar / Proveedores) has
// no source field anywhere in InputNovus (confirmed - only two orphaned
// policy premises exist, never wired into any formula, not even in the
// reference Template Financiero). Rather than show rows seeded with made-up
// numbers, leave it empty and let the user add their own rows for whatever
// short-term debt their business actually has.
export const CURRENT_PASSIVES = [];

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
