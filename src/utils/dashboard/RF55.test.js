import { describe, it, expect } from "vitest";
import { computeOperatingProfit } from "./costCalculations.js";
import { ESTADO_RESULTADOS, YEARS } from "@/test-fixtures/input2Golden.js";

// RF55 - Calcular utilidad de operacion. operatingProfit = grossProfit - operatingExpenses.
describe("RF55 - Calcular utilidad de operacion (computeOperatingProfit)", () => {
  it("reproduce Utilidad de Operacion real para los 11 anios (Dron Super Sport)", () => {
    YEARS.forEach((_year, i) => {
      const result = computeOperatingProfit(
        ESTADO_RESULTADOS.utilidadBruta[i],
        ESTADO_RESULTADOS.gastosOperacion[i],
      );
      expect(result).toBeCloseTo(ESTADO_RESULTADOS.utilidadOperacion[i], 1);
    });
  });

  it("anio 0 es perdida de operacion (gastos de operacion superan una utilidad bruta ya negativa)", () => {
    const result = computeOperatingProfit(
      ESTADO_RESULTADOS.utilidadBruta[0],
      ESTADO_RESULTADOS.gastosOperacion[0],
    );
    expect(result).toBeLessThan(0);
  });

  it("formula es resta simple, no division ni porcentaje", () => {
    expect(computeOperatingProfit(100, 30)).toBe(70);
    expect(computeOperatingProfit(30, 100)).toBe(-70);
  });
});
