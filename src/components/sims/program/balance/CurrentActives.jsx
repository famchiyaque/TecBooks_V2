import React, { useState } from "react";
import EditableTable from "@/components/global/EditableTable";
import {
  currentActivesSlice,
  createCurrentActivesTableStore,
} from "@/store/balance.store";
import { Provider } from "react-redux";
import flipObject from "@/utils/flipObject.js";

export const COST_ROWS = [
  { key: "cashAndBank", label: "Cash and Bank Accounts" },
  { key: "deposits", label: "Inventory" },
  { key: "stocks", label: "Stocks" },
  { key: "inventary", label: "Accounts Receivable" },
];

function CurrentActives({ currentActives }) {
  delete currentActives["total"];
  currentActives = flipObject(currentActives);

  const [store] = useState(() => createCurrentActivesTableStore());

  const columns = Object.keys(currentActives).map((year) => ({
    key: year,
    label: year,
  }));
  const getValue = (rowKey, year) => currentActives[year]?.[rowKey] ?? 0;

  return (
    <Provider store={store}>
      <EditableTable
        title="Current Actives"
        slice={currentActivesSlice}
        columns={columns}
        rows={COST_ROWS}
        getValue={getValue}
        totalLabel="Total Current Actives"
      />
    </Provider>
  );
}

export default CurrentActives;
