import { describe, it, expect } from "vitest";
import { computeIncomeBeforeTaxes } from "./costCalculations.js";
import { ESTADO_RESULTADOS, YEARS } from "@/test-fixtures/input2Golden.js";

// RF56 - Calcular utilidad antes de impuestos.
// UAI = utilidadOperacion - gastosFinancieros - pagoCredito + ingresoFinanciero (0, sin fuente en InputNovus).
describe("RF56 - Calcular utilidad antes de impuestos (computeIncomeBeforeTaxes)", () => {
  it("reproduce UAI real para los 11 anios (Dron Super Sport)", () => {
    YEARS.forEach((_year, i) => {
      const result = computeIncomeBeforeTaxes(
        ESTADO_RESULTADOS.utilidadOperacion[i],
        ESTADO_RESULTADOS.gastosFinancieros[i],
        ESTADO_RESULTADOS.pagoCredito[i],
        0,
      );
      expect(result).toBeCloseTo(ESTADO_RESULTADOS.utilidadAntesImpuestos[i], 1);
    });
  });

  it("anios 0-1 son negativos (perdida antes de impuestos)", () => {
    [0, 1].forEach((i) => {
      const result = computeIncomeBeforeTaxes(
        ESTADO_RESULTADOS.utilidadOperacion[i],
        ESTADO_RESULTADOS.gastosFinancieros[i],
        ESTADO_RESULTADOS.pagoCredito[i],
        0,
      );
      expect(result).toBeLessThan(0);
    });
  });

  it("anio 2+ es positivo, una vez que el credito deja de pesar tanto", () => {
    for (let i = 2; i < YEARS.length; i += 1) {
      const result = computeIncomeBeforeTaxes(
        ESTADO_RESULTADOS.utilidadOperacion[i],
        ESTADO_RESULTADOS.gastosFinancieros[i],
        ESTADO_RESULTADOS.pagoCredito[i],
        0,
      );
      expect(result).toBeGreaterThan(0);
    }
  });

  it("ingreso financiero positivo SI suma (no hay fuente real, pero la formula lo soporta)", () => {
    const sinIngreso = computeIncomeBeforeTaxes(100, 10, 10, 0);
    const conIngreso = computeIncomeBeforeTaxes(100, 10, 10, 50);
    expect(conIngreso).toBe(sinIngreso + 50);
  });
});
