import { describe, it, expect } from "vitest";
import computePassives from "./computePassives.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS } from "@/test-fixtures/input2Golden.js";

// RF71 - Crear tabla del total pasivo circulante (Documentos por pagar/Proveedores).
describe("RF71 - Pasivo Circulante (computePassives)", () => {
  it('currentPassives sale vacio "{}" cada anio - sin fuente en InputNovus, confirmado en el codigo', () => {
    const cbm = buildInput2Cbm();
    const { currentPassives } = computePassives(cbm);
    YEARS.forEach((year) => {
      expect(currentPassives[year]).toEqual({});
    });
  });

  it("totalPassives no suma nada de currentPassives (objeto vacio = 0), solo longTermPassives", () => {
    const cbm = buildInput2Cbm();
    const { totalPassives, longTermPassives } = computePassives(cbm);
    YEARS.forEach((year) => {
      const expectedFromLongTerm =
        (longTermPassives[year].currentCapital || 0) + (longTermPassives[year].interestsPayment || 0);
      expect(totalPassives[year]).toBeCloseTo(expectedFromLongTerm, 1);
    });
  });
});
