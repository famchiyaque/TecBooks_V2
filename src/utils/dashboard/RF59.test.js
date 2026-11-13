import { describe, it, expect } from "vitest";
import { computeNetIncome } from "./costCalculations.js";
import { ESTADO_RESULTADOS, YEARS } from "@/test-fixtures/input2Golden.js";

// RF59 - Calcular utilidad del periodo. netIncome = UAI - (ISR + PTU).
describe("RF59 - Calcular utilidad del periodo (computeNetIncome)", () => {
  it("reproduce Utilidad del Periodo real para los 11 anios", () => {
    YEARS.forEach((_year, i) => {
      const result = computeNetIncome(
        ESTADO_RESULTADOS.utilidadAntesImpuestos[i],
        ESTADO_RESULTADOS.impuestos[i],
      );
      expect(result).toBeCloseTo(ESTADO_RESULTADOS.utilidadPeriodo[i], 1);
    });
  });

  it("perdida en anios 0-1, ganancia desde el anio 2", () => {
    expect(ESTADO_RESULTADOS.utilidadPeriodo[0]).toBeLessThan(0);
    expect(ESTADO_RESULTADOS.utilidadPeriodo[1]).toBeLessThan(0);
    for (let i = 2; i < YEARS.length; i += 1) {
      const result = computeNetIncome(
        ESTADO_RESULTADOS.utilidadAntesImpuestos[i],
        ESTADO_RESULTADOS.impuestos[i],
      );
      expect(result).toBeGreaterThan(0);
    }
  });

  it("en anios sin impuesto (0-1), utilidad del periodo = UAI exacto (impuestos=0)", () => {
    const result = computeNetIncome(ESTADO_RESULTADOS.utilidadAntesImpuestos[0], 0);
    expect(result).toBeCloseTo(ESTADO_RESULTADOS.utilidadAntesImpuestos[0], 1);
  });
});
