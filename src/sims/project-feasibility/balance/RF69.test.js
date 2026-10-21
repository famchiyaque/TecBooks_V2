import { describe, it, expect } from "vitest";
import computeActives from "./computeActives.js";
import { computeCashBalanceByYear } from "@/sims/project-feasibility/costTable/cashFlowCalculations.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS, BALANCE } from "@/test-fixtures/input2Golden.js";

// RF69 - Crear tabla de Balance General (computeActives).
// Nota: NO se prueba aqui la ecuacion contable completa (Activo = Pasivo +
// Capital) porque ese "cierre" vive en Equity.jsx como la formula del plug
// (legacy), que no esta exportada como funcion - fuera de alcance mientras
// eso no se exponga (ver RF73).
describe("RF69 - Crear tabla de Balance General (computeActives)", () => {
  it("total activo (circulante + fijo neto + diferido) reproduce el Total Activo real de los 11 anios", () => {
    const cbm = buildInput2Cbm();
    const actives = computeActives(cbm);
    YEARS.forEach((year, i) => {
      const currentActivesTotal = actives.currentActives.total[year];
      const fixedNet = actives.fixedAssets.find((row) => row.year === year).netValue;
      const deferedTotal = actives.deferedActives.total[year];
      const totalActivo = currentActivesTotal + fixedNet + deferedTotal;
      expect(totalActivo).toBeCloseTo(BALANCE.totalActivo[i], 1);
    });
  });

  it("caja y bancos (Current Actives) = flujo neto acumulado (computeCashBalanceByYear)", () => {
    const cbm = buildInput2Cbm();
    const actives = computeActives(cbm);
    const { endingBalanceByYear } = computeCashBalanceByYear(cbm);
    YEARS.forEach((year, i) => {
      expect(actives.currentActives.cashAndBank[year]).toBeCloseTo(endingBalanceByYear[year], 1);
      expect(actives.currentActives.cashAndBank[year]).toBeCloseTo(BALANCE.cajaYBancos[i], 1);
    });
  });

  it("activo fijo neto reproduce el real de los 11 anios (edificios+transporte+computo+maquinaria, depreciados)", () => {
    const cbm = buildInput2Cbm();
    const actives = computeActives(cbm);
    YEARS.forEach((year, i) => {
      const fixedNet = actives.fixedAssets.find((row) => row.year === year).netValue;
      expect(fixedNet).toBeCloseTo(BALANCE.totalActivoFijo[i], 1);
    });
  });

  it("activo circulante del anio 0 incluye las acciones ($2,000,000) ademas de caja y bancos", () => {
    const cbm = buildInput2Cbm();
    const actives = computeActives(cbm);
    const diff = actives.currentActives.total[2025] - actives.currentActives.cashAndBank[2025];
    expect(diff).toBeCloseTo(BALANCE.acciones, 1);
  });
});
