import { describe, it, expect } from "vitest";
import { computeBreakEven } from "./computeBreakEven.js";
import { buildCostOfSales } from "./buildCostOfSales.js";
import { cbmToCostTableInputs } from "./cbmToCostTableInputs.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { PUNTO_EQUILIBRIO } from "@/test-fixtures/input2Golden.js";

function breakEvenForCbm(desiredProfit = PUNTO_EQUILIBRIO.beneficioDeseado) {
  const cbm = buildInput2Cbm();
  const { costOfSalesByYear } = buildCostOfSales(cbm);
  const { production } = cbmToCostTableInputs(cbm);
  return computeBreakEven(costOfSalesByYear[0], production, desiredProfit);
}

// RF60 - Punto de Equilibrio (computeBreakEven), primer anio del proyecto.
describe("RF60 - Punto de Equilibrio (computeBreakEven)", () => {
  it("costos fijos reproducen el real (gastos admin + salarios + pago de credito)", () => {
    const result = breakEvenForCbm();
    expect(result.fixedCosts).toBeCloseTo(PUNTO_EQUILIBRIO.costosFijos.total, -1);
  });

  it("precio de venta año 0 = costo de venta del BOM", () => {
    const result = breakEvenForCbm();
    expect(result.salePrice).toBeCloseTo(PUNTO_EQUILIBRIO.precioVenta, 2);
  });

  it("cantidad de equilibrio = costos fijos / margen de contribucion", () => {
    const result = breakEvenForCbm();
    const expected = result.fixedCosts / result.contributionMargin;
    expect(result.breakEvenUnits).toBeCloseTo(expected, 6);
    expect(result.breakEvenUnits).toBeCloseTo(PUNTO_EQUILIBRIO.cantidadEquilibrio, -1);
  });

  it("ingreso de equilibrio = cantidad de equilibrio x precio de venta", () => {
    const result = breakEvenForCbm();
    expect(result.breakEvenRevenue).toBeCloseTo(result.breakEvenUnits * result.salePrice, 4);
  });

  it("cantidad con beneficio deseado = (costos fijos + beneficio) / margen", () => {
    const result = breakEvenForCbm(PUNTO_EQUILIBRIO.beneficioDeseado);
    const expected = (result.fixedCosts + PUNTO_EQUILIBRIO.beneficioDeseado) / result.contributionMargin;
    expect(result.unitsForProfit).toBeCloseTo(expected, 6);
    expect(result.unitsForProfit).toBeCloseTo(PUNTO_EQUILIBRIO.cantidadConBeneficio, -1);
  });

  it("sin punto de equilibrio (margen <= 0) regresa null en vez de Infinity/NaN", () => {
    const row = {
      year: 2025,
      engineeringSalaries: 0,
      administrativeSalary: 0,
      indirectManufacturing: 0,
      creditPayment: 0,
      financialExpenses: 0,
      administrativeExpenses: 1000,
      directLabour: 500,
    };
    const production = {
      purchaseOrders: { 2025: 100 },
      qualityYield: { 2025: 1 },
      materialCostPerUnit: { 2025: 50 },
      salesPricePerUnit: { 2025: 10 }, // precio < costo variable -> sin break-even
    };
    const result = computeBreakEven(row, production, 0);
    expect(result.contributionMargin).toBeLessThanOrEqual(0);
    expect(result.breakEvenUnits).toBeNull();
    expect(result.breakEvenRevenue).toBeNull();
    expect(result.unitsForProfit).toBeNull();
    expect(result.revenueForProfit).toBeNull();
  });
});
