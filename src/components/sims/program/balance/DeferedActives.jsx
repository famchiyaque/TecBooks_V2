import React, { useState } from "react";
import EditableTable from "@/components/global/EditableTable";
import {
  deferedActivesSlice,
  createDeferedActivesTableStore,
} from "@/store/balance.store";
import { Provider } from "react-redux";

export const DEFERED_ACTIVES_ROWS = [
  { key: "seguros", label: "Seguros" },
  { key: "pagoSeguros", label: "Pago de Seguros" },
];

function DeferedActives({ deferedActives }) {
  deferedActives = { ...deferedActives };
  delete deferedActives["total"];
  deferedActives = flipObject(deferedActives);

  const [store] = useState(() => createDeferedActivesTableStore());

  const columns = Object.keys(deferedActives).map((year) => ({
    key: year,
    label: year,
  }));
  const getValue = (rowKey, year) => deferedActives[year]?.[rowKey] ?? 0;

  return (
    <Provider store={store}>
      <EditableTable
        title="Defered Actives"
        slice={deferedActivesSlice}
        columns={columns}
        rows={DEFERED_ACTIVES_ROWS}
        getValue={getValue}
        totalLabel="Total Defered Actives"
      />
    </Provider>
  );
}

function flipObject(obj) {
  const result = {};

  Object.entries(obj).forEach(([key, values]) => {
    Object.entries(values).forEach(([innerKey, value]) => {
      if (!result[innerKey]) {
        result[innerKey] = {};
      }

      result[innerKey][key] = value;
    });
  });

  return result;
}

export default DeferedActives;
