import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapsibleSection from "@/components/global/CollapsibleSection";
import { currentPassiveSlice, longTermPassiveSlice } from "@/store/balance.store";
import EditableTable from "@/components/global/EditableTable";
import GrandTotalTable from "@/components/global/GrandTotalTable";
import useTableRowsSync from "@/hooks/sims/project/useTableRowsSync.js";
import useTableRows from "@/hooks/sims/project/useTableRows.js";

// No fixed rows - Current Passives (Documentos por pagar / Proveedores) has
// no source field anywhere in InputNovus (confirmed - only two orphaned
// policy premises exist, never wired into any formula, not even in the
// reference Template Financiero). No fixed row here (those can't be
// deleted) - instead a default CUSTOM row gets seeded once per session (see
// Passive()'s effect below), pre-filled with the reference Template's own
// placeholder numbers, that the user is free to edit or delete like any
// other custom row.
export const CURRENT_PASSIVES = [];

const DEFAULT_CURRENT_PASSIVE_LABEL = "Documentos por pagar corto plazo";
const DEFAULT_YEAR_ZERO_VALUE = 450000;
const DEFAULT_LATER_YEAR_VALUE = 45000;

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
function Passive({ passives, gameId }) {
  useTableRowsSync(gameId, currentPassiveSlice, "currentPassives");
  useTableRowsSync(gameId, longTermPassiveSlice, "longTermPassives");
  const dispatch = useDispatch();
  const { data: tableRowsData } = useTableRows(gameId);
  const currentPassiveCustomRows = useSelector(currentPassiveSlice.selectCustomRows);
  const columns = Object.keys(passives.currentPassives).map((year) => ({
    key: year,
    label: year,
  }));
  const getCurrentPassiveValue = (rowKey, year) =>
    passives.currentPassives[year]?.[rowKey] ?? 0;

  // Seed the default "Documentos por pagar corto plazo" row exactly once,
  // and only once we KNOW from the server that this game truly has none
  // saved yet for "currentPassives" (row_table) - useTableRowsSync's own
  // hydrate effect (registered above, so it runs first) already replaced
  // customRows with whatever the server has by the time this checks. Gating
  // on `tableRowsData` (not just customRows.length) avoids seeding a row
  // that's about to get wiped out the instant the server's real - and empty,
  // if the user deleted it in an earlier session - set arrives.
  const seededDefaultRow = React.useRef(false);
  React.useEffect(() => {
    if (seededDefaultRow.current || !tableRowsData) return;
    seededDefaultRow.current = true;
    const hasSavedRows = (tableRowsData.currentPassives ?? []).length > 0;
    if (hasSavedRows || currentPassiveCustomRows.length > 0) return;
    const years = Object.keys(passives.currentPassives);
    if (years.length === 0) return;
    const values = {};
    years.forEach((year, index) => {
      values[year] = index === 0 ? DEFAULT_YEAR_ZERO_VALUE : DEFAULT_LATER_YEAR_VALUE;
    });
    dispatch(currentPassiveSlice.actions.addCustomRow({ label: DEFAULT_CURRENT_PASSIVE_LABEL, values }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRowsData]);

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
