import React from "react";
import EditableTable from "@/components/global/EditableTable";
import { currentActivesSlice } from "@/store/balance.store";
import flipObject from "@/utils/flipObject.js";

export const COST_ROWS = [
  { key: "cashAndBank", label: "Cash and Bank Accounts" },
  { key: "deposits", label: "Inventory" },
  { key: "stocks", label: "Stocks" },
  { key: "inventary", label: "Accounts Receivable" },
];

// No own store/Provider - relies on the shared editsStore ProjectDashboard
// mounts (same store as Cost Table/Opex/Taxes/etc.), so its overrides/custom
// rows are readable from anywhere else in the tab, e.g. Shareholder's Equity
// recomputing Total Assets live off this table's effective total.
function CurrentActives({ currentActives }) {
  delete currentActives["total"];
  currentActives = flipObject(currentActives);

  const columns = Object.keys(currentActives).map((year) => ({
    key: year,
    label: year,
  }));
  const getValue = (rowKey, year) => currentActives[year]?.[rowKey] ?? 0;

  return (
    <EditableTable
      title="Current Actives"
      slice={currentActivesSlice}
      columns={columns}
      rows={COST_ROWS}
      getValue={getValue}
      totalLabel="Total Current Actives"
    />
  );
}

export default CurrentActives;
