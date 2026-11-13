import { describe, it, expect } from "vitest";
import { computeCashBalanceByYear, startingMoneyFromCbm } from "./cashFlowCalculations.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS, FLUJO } from "@/test-fixtures/input2Golden.js";

// RF63 - Crear tabla de flujo de efectivo. Corre el pipeline completo
// (buildCostOfSales -> capex -> entradas/salidas) contra un cbm sintetico
// que reproduce Input_2 (Dron Super Sport) - no numeros sueltos.
describe("RF63 - Crear tabla de flujo de efectivo (computeCashBalanceByYear)", () => {
  it("saldo inicial del proyecto = premises.startingMoney ($1,500,000)", () => {
    const cbm = buildInput2Cbm();
    expect(startingMoneyFromCbm(cbm)).toBe(FLUJO.saldoInicial[0]);
  });

  it("reproduce el Flujo Neto real de los 11 anios (saldo acumulado, no el flujo del periodo)", () => {
    const cbm = buildInput2Cbm();
    const { endingBalanceByYear } = computeCashBalanceByYear(cbm);
    YEARS.forEach((year, i) => {
      expect(endingBalanceByYear[year]).toBeCloseTo(FLUJO.flujoNeto[i], 1);
    });
  });

  it("saldo inicial del anio N+1 = saldo final (ending balance) del anio N", () => {
    const cbm = buildInput2Cbm();
    const { saldoInicialByYear, endingBalanceByYear } = computeCashBalanceByYear(cbm);
    for (let i = 0; i < YEARS.length - 1; i += 1) {
      expect(saldoInicialByYear[YEARS[i + 1]]).toBeCloseTo(endingBalanceByYear[YEARS[i]], 1);
    }
  });

  it("anios 0-1 con saldo negativo (el prestamo + ventas no alcanzan las salidas todavia)", () => {
    const cbm = buildInput2Cbm();
    const { endingBalanceByYear } = computeCashBalanceByYear(cbm);
    expect(endingBalanceByYear[2025]).toBeLessThan(0);
    expect(endingBalanceByYear[2026]).toBeLessThan(0);
  });

  it("regresa vacio (sin tirar error) si el cbm no trae datos suficientes", () => {
    const { saldoInicialByYear, endingBalanceByYear, years } = computeCashBalanceByYear({});
    expect(years).toEqual([]);
    expect(saldoInicialByYear).toEqual({});
    expect(endingBalanceByYear).toEqual({});
  });
});
