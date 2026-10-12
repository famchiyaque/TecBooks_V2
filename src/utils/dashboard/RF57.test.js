import { describe, it, expect } from "vitest";
import { computeTaxes } from "./costCalculations.js";
import { ESTADO_RESULTADOS, PREMISAS, YEARS } from "@/test-fixtures/input2Golden.js";

const byYear = (series) => Object.fromEntries(YEARS.map((year, i) => [year, series[i]]));

// RF57 - Impuestos (ISR + PTU). taxesByYear[year].total = UAI * (ISR + PTU), 0 si UAI < 0.
describe("RF57 - Calcular impuestos ISR+PTU (computeTaxes)", () => {
  const incomeBeforeTaxesByYear = byYear(ESTADO_RESULTADOS.utilidadAntesImpuestos);
  const isrRateByYear = byYear(PREMISAS.tasaISR);
  const ptuRateByYear = byYear(PREMISAS.tasaPTU);

  it("reproduce los impuestos reales de los 11 anios (Dron Super Sport)", () => {
    const taxesByYear = computeTaxes(incomeBeforeTaxesByYear, isrRateByYear, ptuRateByYear, YEARS);
    YEARS.forEach((year, i) => {
      expect(taxesByYear[year].total).toBeCloseTo(ESTADO_RESULTADOS.impuestos[i], 1);
    });
  });

  it("anios 0-1 no pagan impuesto (UAI negativa, sin reembolso)", () => {
    const taxesByYear = computeTaxes(incomeBeforeTaxesByYear, isrRateByYear, ptuRateByYear, YEARS);
    expect(taxesByYear[2025].total).toBe(0);
    expect(taxesByYear[2026].total).toBe(0);
    expect(taxesByYear[2025].isr).toBe(0);
    expect(taxesByYear[2025].ptu).toBe(0);
  });

  it("tasa combinada es ISR 34% + PTU 10% = 44%", () => {
    const taxesByYear = computeTaxes({ 2027: 1000000 }, { 2027: 0.34 }, { 2027: 0.1 }, [2027]);
    expect(taxesByYear[2027].isr).toBeCloseTo(340000, 2);
    expect(taxesByYear[2027].ptu).toBeCloseTo(100000, 2);
    expect(taxesByYear[2027].total).toBeCloseTo(440000, 2);
  });
});
