import { describe, it, expect } from "vitest";
import { COST_ROWS } from "./CostOfSalesTable.jsx";
import { costTableEditsSlice } from "@/store/costTable.store.js";
import { computeGrossProfit } from "@/utils/dashboard/costCalculations";

// RF50-54, todos sobre el mismo "Estados de Resultados" real (screenshot):
//   RF50 Crear tabla de costos        -> COST_ROWS + costTableEditsSlice.effectiveTotal (consolidación)
//   RF51/52/53 Añadir/Eliminar/Modificar costo -> reducers de EditableTableSlice (costTableEditsSlice)
//   RF54 Calcular utilidad bruta      -> computeGrossProfit(netSales, totalCostOfSales)

// costOfSalesByYear real para 2025/2026 (Dron Sport Life). 2025 da utilidad
// bruta NEGATIVA (año de ramp-up) a propósito - caso real, no inventado.
const costOfSalesByYear = [
  {
    year: 2025,
    rawMaterial: 126328800.0,
    directLabour: 5359707.63,
    indirectManufacturing: 1742780.75,
    engineeringSalaries: 2005511.51,
    indirectMaterials: 6569097.6,
  },
  {
    year: 2026,
    rawMaterial: 652205528.15,
    directLabour: 5541937.69,
    indirectManufacturing: 1802035.29,
    engineeringSalaries: 2073698.91,
    indirectMaterials: 36034355.43,
  },
];
const ventasNetas = { 2025: 131381952.0, 2026: 720687108.6 };
const totalCostosReal = { 2025: 142005897.49, 2026: 697657555.46 };
const utilidadBrutaReal = { 2025: -10623945.49, 2026: 23029553.14 };

// Mismo patrón que CostOfSalesTable.jsx: getValue(rowKey, year) lee del array.
const getValue = (rowKey, year) =>
  costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0;

describe("RF50 - Crear tabla de costos (consolidación MP+MOD+MOI+Ingeniería+Admin)", () => {
  it("tiene las 5 filas fijas en el orden del Estados de Resultados (MP, MOD, MOI, Ingeniería, Materiales Indirectos)", () => {
    expect(COST_ROWS.map((row) => row.key)).toEqual([
      "rawMaterial",
      "directLabour",
      "indirectManufacturing",
      "engineeringSalaries",
      "indirectMaterials",
    ]);
  });

  it("Total de Costos = suma de las 5 filas, sin overrides ni filas custom", () => {
    const state = { overrides: {}, customRows: [] };
    const total2025 = costTableEditsSlice.effectiveTotal(state, COST_ROWS, getValue, 2025);
    const total2026 = costTableEditsSlice.effectiveTotal(state, COST_ROWS, getValue, 2026);
    expect(total2025).toBeCloseTo(totalCostosReal[2025], 1);
    expect(total2026).toBeCloseTo(totalCostosReal[2026], 1);
  });
});

describe("RF51/52 - Añadir/Eliminar costo", () => {
  it("Añadir costo: una fila nueva (ej. Costos Indirectos Producto 2) se suma al Total de Costos", () => {
    const store = costTableEditsSlice.createStore();
    const baseline = costTableEditsSlice.effectiveTotal(
      store.getState().costTableEdits,
      COST_ROWS,
      getValue,
      2025,
    );

    store.dispatch(
      costTableEditsSlice.actions.addCustomRow({
        label: "Costos Indirectos Producto 2",
        values: { 2025: 50000 },
      }),
    );

    const state = store.getState().costTableEdits;
    expect(state.customRows).toHaveLength(1);
    expect(state.customRows[0].label).toBe("Costos Indirectos Producto 2");

    const withNewCost = costTableEditsSlice.effectiveTotal(state, COST_ROWS, getValue, 2025);
    expect(withNewCost).toBeCloseTo(baseline + 50000, 1);
  });

  it("Eliminar costo: quitar la fila regresa el Total de Costos al valor base", () => {
    const store = costTableEditsSlice.createStore();
    const baseline = costTableEditsSlice.effectiveTotal(
      store.getState().costTableEdits,
      COST_ROWS,
      getValue,
      2025,
    );

    store.dispatch(
      costTableEditsSlice.actions.addCustomRow({
        id: "producto-2",
        label: "Costos Indirectos Producto 2",
        values: { 2025: 50000 },
      }),
    );
    store.dispatch(costTableEditsSlice.actions.removeCustomRow("producto-2"));

    const state = store.getState().costTableEdits;
    expect(state.customRows).toHaveLength(0);
    const afterRemove = costTableEditsSlice.effectiveTotal(state, COST_ROWS, getValue, 2025);
    expect(afterRemove).toBeCloseTo(baseline, 1);
  });

  it("no añade dos veces la misma fila custom si se repite el mismo id", () => {
    const store = costTableEditsSlice.createStore();
    store.dispatch(costTableEditsSlice.actions.addCustomRow({ id: "dup", label: "A", values: {} }));
    store.dispatch(costTableEditsSlice.actions.addCustomRow({ id: "dup", label: "B", values: {} }));
    expect(store.getState().costTableEdits.customRows).toHaveLength(1);
  });
});

describe("RF53 - Modificar costo", () => {
  it("override de una fila fija (ej. corregir MP de 2025) cambia el Total de Costos, no el dato fuente", () => {
    const store = costTableEditsSlice.createStore();
    store.dispatch(
      costTableEditsSlice.actions.setOverride({
        rowKey: "rawMaterial",
        columnKey: 2025,
        value: 130000000,
      }),
    );

    const state = store.getState().costTableEdits;
    const total2025 = costTableEditsSlice.effectiveTotal(state, COST_ROWS, getValue, 2025);
    const expected = 130000000 + 5359707.63 + 1742780.75 + 2005511.51 + 6569097.6;
    expect(total2025).toBeCloseTo(expected, 1);
    // el dato fuente (costOfSalesByYear) no se tocó - el override vive aparte.
    expect(getValue("rawMaterial", 2025)).toBe(126328800.0);
  });

  it("modificar el monto de una fila custom ya existente (setCustomRowValue)", () => {
    const store = costTableEditsSlice.createStore();
    store.dispatch(
      costTableEditsSlice.actions.addCustomRow({ id: "producto-2", label: "Producto 2", values: { 2025: 50000 } }),
    );
    store.dispatch(
      costTableEditsSlice.actions.setCustomRowValue({ id: "producto-2", columnKey: 2025, value: 75000 }),
    );

    const row = store.getState().costTableEdits.customRows[0];
    expect(row.values[2025]).toBe(75000);
  });

  it("renombrar una fila custom (setCustomRowLabel) no cambia su monto", () => {
    const store = costTableEditsSlice.createStore();
    store.dispatch(
      costTableEditsSlice.actions.addCustomRow({ id: "producto-2", label: "Producto 2", values: { 2025: 50000 } }),
    );
    store.dispatch(costTableEditsSlice.actions.setCustomRowLabel({ id: "producto-2", label: "Producto 2 (ajustado)" }));

    const row = store.getState().costTableEdits.customRows[0];
    expect(row.label).toBe("Producto 2 (ajustado)");
    expect(row.values[2025]).toBe(50000);
  });
});

describe("RF54 - Calcular utilidad bruta (Ventas Netas - Total de Costos)", () => {
  it("2025: utilidad bruta negativa (año de ramp-up) - caso real, no hipotético", () => {
    const state = { overrides: {}, customRows: [] };
    const totalCostos2025 = costTableEditsSlice.effectiveTotal(state, COST_ROWS, getValue, 2025);
    const utilidadBruta = computeGrossProfit(ventasNetas[2025], totalCostos2025);
    expect(utilidadBruta).toBeCloseTo(utilidadBrutaReal[2025], 1);
    expect(utilidadBruta).toBeLessThan(0);
  });

  it("2026: utilidad bruta positiva, mismo cálculo", () => {
    const state = { overrides: {}, customRows: [] };
    const totalCostos2026 = costTableEditsSlice.effectiveTotal(state, COST_ROWS, getValue, 2026);
    const utilidadBruta = computeGrossProfit(ventasNetas[2026], totalCostos2026);
    expect(utilidadBruta).toBeCloseTo(utilidadBrutaReal[2026], 1);
    expect(utilidadBruta).toBeGreaterThan(0);
  });

  it("formula es exactamente Ventas - Costos, no Costos - Ventas ni ninguna otra variante", () => {
    expect(computeGrossProfit(100, 40)).toBe(60);
    expect(computeGrossProfit(40, 100)).toBe(-60);
  });
});
