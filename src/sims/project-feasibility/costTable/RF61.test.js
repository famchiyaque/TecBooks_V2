import { describe, it, expect } from "vitest";
import { buildBreakEvenSeries, computeBreakEven } from "./computeBreakEven.js";
import { buildCostOfSales } from "./buildCostOfSales.js";
import { cbmToCostTableInputs } from "./cbmToCostTableInputs.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { PUNTO_EQUILIBRIO } from "@/test-fixtures/input2Golden.js";

// RF61 - Tabla de unidades vendidas (la serie de datos detras del grafico de
// Punto de Equilibrio - nunca se muestra como tabla propia en la UI, pero la
// funcion que arma esos puntos si es real).
describe("RF61 - Tabla de Unidades Vendidas (buildBreakEvenSeries)", () => {
  it("a 0 unidades: costo = solo costos fijos, ventas = 0", () => {
    const series = buildBreakEvenSeries({
      fixedCosts: PUNTO_EQUILIBRIO.costosFijos.total,
      variableCostPerUnit: PUNTO_EQUILIBRIO.costosVariablesUnit.total,
      salePrice: PUNTO_EQUILIBRIO.precioVenta,
      breakEvenUnits: PUNTO_EQUILIBRIO.cantidadEquilibrio,
    });
    expect(series[0].units).toBe(0);
    expect(series[0].Cost).toBeCloseTo(PUNTO_EQUILIBRIO.costosFijos.total, 0);
    expect(series[0].Sales).toBe(0);
  });

  it("en cualquier punto: costo = fijos + variable*unidades, ventas = precio*unidades", () => {
    const series = buildBreakEvenSeries({
      fixedCosts: PUNTO_EQUILIBRIO.costosFijos.total,
      variableCostPerUnit: PUNTO_EQUILIBRIO.costosVariablesUnit.total,
      salePrice: PUNTO_EQUILIBRIO.precioVenta,
      breakEvenUnits: PUNTO_EQUILIBRIO.cantidadEquilibrio,
    });
    series.forEach(({ units, Cost, Sales }) => {
      expect(Cost).toBeCloseTo(
        PUNTO_EQUILIBRIO.costosFijos.total + PUNTO_EQUILIBRIO.costosVariablesUnit.total * units,
        4,
      );
      expect(Sales).toBeCloseTo(PUNTO_EQUILIBRIO.precioVenta * units, 4);
    });
  });

  it("llega hasta 2x la cantidad de equilibrio (el cruce queda a la mitad del rango)", () => {
    const series = buildBreakEvenSeries({
      fixedCosts: 1000,
      variableCostPerUnit: 5,
      salePrice: 10,
      breakEvenUnits: 200,
    });
    const lastUnits = series[series.length - 1].units;
    expect(lastUnits).toBeCloseTo(400, 0);
  });

  it("31 puntos (0 a 2x break-even en 30 pasos) - misma serie que alimenta el grafico real", () => {
    const cbm = buildInput2Cbm();
    const { costOfSalesByYear } = buildCostOfSales(cbm);
    const { production } = cbmToCostTableInputs(cbm);
    const breakEven = computeBreakEven(costOfSalesByYear[0], production, PUNTO_EQUILIBRIO.beneficioDeseado);
    const series = buildBreakEvenSeries(breakEven);
    expect(series).toHaveLength(31);
  });
});
