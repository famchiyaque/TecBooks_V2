import { useMemo } from "react";
import { useSelector } from "react-redux";

import { cashFlowEditsSlice, outflowEditsSlice } from "@/store/costTable.store";

import {
  ENTRADA_ROWS,
  baseEntradaValue,
  startingMoneyFromCbm,
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
    if (result?.error || !result?.costOfSalesByYear) return {};
    return Object.fromEntries(
      result.costOfSalesByYear.map((row) => [row.year, row]),
    );
  }, [result]);

  const capexByYear = useMemo(
    () => (result?.error ? {} : computeCapexByYear(project.cbm, years)),
    [project, result, years],
  );

  const outflowRows = useMemo(() => buildOutflowRows(project.cbm), [project]);

  const openingCash = useMemo(
    () => startingMoneyFromCbm(project.cbm),
    [project],
  );

  const {
    netFlow,
    saldoInicialByYear,
    totalInflowsByYear,
    totalOutflowsByYear,
  } = useMemo(() => {
    const netFlow = {};
    const saldoInicialByYear = {};
    const totalInflowsByYear = {};
    const totalOutflowsByYear = {};

    years.forEach((year, index) => {
      // Saldo Inicial[year] = previous year's net flow (opening cash for the first year)
      saldoInicialByYear[year] =
        index === 0 ? openingCash : netFlow[years[index - 1]];

      const entradaValue = (rowKey) =>
        rowKey === "saldoInicial"
          ? saldoInicialByYear[year]
          : baseEntradaValue(rowKey, year, rowByYear);

      const outflowValue = (rowKey) =>
        outflowBaseValue(rowKey, year, rowByYear, capexByYear);

      const totalCashInflows = cashFlowEditsSlice.effectiveTotal(
        { overrides, customRows },
        ENTRADA_ROWS,
        entradaValue,
        year,
      );

      const totalCashOutflows = outflowEditsSlice.effectiveTotal(
        { overrides: outflowOverrides, customRows: outflowCustomRows },
        outflowRows,
        outflowValue,
        year,
      );

      totalInflowsByYear[year] = totalCashInflows;
      totalOutflowsByYear[year] = totalCashOutflows;
      netFlow[year] = totalCashInflows - totalCashOutflows;
    });

    return {
      netFlow,
      saldoInicialByYear,
      totalInflowsByYear,
      totalOutflowsByYear,
    };
  }, [
    years,
    openingCash,
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
    saldoInicialByYear,
    totalInflowsByYear,
    totalOutflowsByYear,
  };
}

export default useCashFlow;
