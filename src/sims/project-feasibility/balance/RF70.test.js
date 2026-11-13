import { describe, it, expect } from "vitest";
import computeDeferedActives from "./computeDeferedActives.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS, BALANCE } from "@/test-fixtures/input2Golden.js";

// RF70 - Crear tabla del activo diferido (Seguros + Pago de Seguros).
// Ninguno tiene fuente en InputNovus - siempre 0, no es una simplificacion,
// coincide con el Excel de referencia.
describe("RF70 - Activo Diferido (computeDeferedActives)", () => {
  it("activo diferido = 0 en los 11 anios, igual que el Excel de referencia", () => {
    const cbm = buildInput2Cbm();
    const { total } = computeDeferedActives(cbm);
    YEARS.forEach((year, i) => {
      expect(total[year]).toBe(0);
      expect(BALANCE.totalActivoDiferido[i]).toBe(0);
    });
  });

  it("Seguros y Pago de Seguros son ambos 0 por separado (no solo la suma)", () => {
    const cbm = buildInput2Cbm();
    const { seguros, pagoSeguros } = computeDeferedActives(cbm);
    YEARS.forEach((year) => {
      expect(seguros[year]).toBe(0);
      expect(pagoSeguros[year]).toBe(0);
    });
  });
});
