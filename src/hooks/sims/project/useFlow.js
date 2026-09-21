import { useMemo } from "react";
import { useSelector } from "react-redux";

import { cashFlowEditsSlice, outflowEditsSlice } from "@/store/costTable.store";

import {
  ENTRADA_ROWS,
  baseEntradaValue,
} from "@/sims/project-feasibility/costTable/cashFlowCalculations.js";

import {
  buildOutflowRows,
  computeCapexByYear,
  outflowBaseValue,
} from "@/sims/project-feasibility/costTable/outflowCalculations.js";

function useCashFlow(project, result) {
  const overrides = useSelector(cashFlowEditsSlice.selectOverrides);
  const customRows = useSelector(cashFlowEditsSlice.selectCustomRows);

  const outflowOverrides = useSelector(outflowEditsSlice.selectOverrides);
  const outflowCustomRows = useSelector(outflowEditsSlice.selectCustomRows);

  const years = useMemo(
    () =>
      result?.error
        ? []
        : (result?.costOfSalesByYear?.map((row) => row.year) ?? []),
    [result],
  );

  const rowByYear = useMemo(() => {
    if (result?.error) return {};

    return Object.fromEntries(
      result.costOfSalesByYear.map((row) => [row.year, row]),
    );
  }, [result]);

  const capexByYear = useMemo(
    () => (result?.error ? {} : computeCapexByYear(project.cbm, years)),
    [project, result, years],
  );

  const outflowRows = useMemo(() => buildOutflowRows(project.cbm), [project]);

  const netFlow = useMemo(() => {
    const flow = {};

    years.forEach((year) => {
      const entradaValue = (rowKey) =>
        baseEntradaValue(rowKey, year, rowByYear);

      const outflowValue = (rowKey) =>
        outflowBaseValue(rowKey, year, rowByYear, capexByYear);

      const totalCashInflows = cashFlowEditsSlice.effectiveTotal(
        {
          overrides,
          customRows,
        },
        ENTRADA_ROWS,
        entradaValue,
        year,
      );

      const totalCashOutflows = outflowEditsSlice.effectiveTotal(
        {
          overrides: outflowOverrides,
          customRows: outflowCustomRows,
        },
        outflowRows,
        outflowValue,
        year,
      );

      flow[year] = totalCashInflows - totalCashOutflows;
    });

    return flow;
  }, [
    years,
    rowByYear,
    capexByYear,
    outflowRows,
    overrides,
    customRows,
    outflowOverrides,
    outflowCustomRows,
  ]);

  return {
    netFlow,
  };
}

export default useCashFlow;
