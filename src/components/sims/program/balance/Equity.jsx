import React, { useState } from "react";
import { createEquityStore, equitySlice } from "@/store/balance.store";
import { Provider } from "react-redux";
import EditableTable from "@/components/global/EditableTable";
import flipObject from "@/utils/flipObject";

const EQUITY_ROWS = [
  { key: "legacy", label: "Legacy" },
  { key: "periodUtility", label: "Period Utility" },
  { key: "acumUtility", label: "Acum period utility" },
];

function Equity({ equity }) {
  equity = flipObject(equity);
  const [store] = useState(() => createEquityStore());

  const columns = Object.keys(equity).map((year) => ({
    key: year,
    label: year,
  }));
  const getValue = (rowKey, year) => equity[year]?.[rowKey] ?? 0;

  return (
    <Provider store={store}>
      <EditableTable
        title="Shareholder's equity"
        slice={equitySlice}
        columns={columns}
        rows={EQUITY_ROWS}
        getValue={getValue}
        totalLabel="Total Shareholder's equity"
      />
    </Provider>
  );
}

export default Equity;
