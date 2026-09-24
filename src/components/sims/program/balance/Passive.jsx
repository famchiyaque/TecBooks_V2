import React from "react";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import { currentPassiveSlice, longTermPassiveSlice } from "@/store/balance.store";
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

// No own store/Provider - relies on the shared editsStore ProjectDashboard
// mounts, so both tables' overrides/custom rows are readable from anywhere
// else in the tab, e.g. Shareholder's Equity recomputing Total Liabilities
// live. Current Passives and Long term passives each get their OWN slice
// (currentPassiveSlice / longTermPassiveSlice) - they used to share one
// "passives" slice, which meant a custom row added to either table leaked
// into both totals (they read the same underlying customRows array).
function Passive({ passives }) {
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
      <EditableTable
        title="Current Passives"
        slice={currentPassiveSlice}
        columns={columns}
        rows={CURRENT_PASSIVES}
        getValue={getCurrentPassiveValue}
        totalLabel="Total Current Passives"
      />
      <EditableTable
        title="Long term passives"
        slice={longTermPassiveSlice}
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
            slice: currentPassiveSlice,
            rows: CURRENT_PASSIVES,
            getValue: getCurrentPassiveValue,
          },
          {
            slice: longTermPassiveSlice,
            rows: LONG_TERM_PASSIVES,
            getValue: getLongTermPassivesValue,
          },
        ]}
      />
    </CollapsibleSection>
  );
}

export default Passive;
