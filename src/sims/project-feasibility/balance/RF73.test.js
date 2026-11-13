import { describe, it, expect } from "vitest";
import { computeEquity } from "./computeEquity.js";
import computeActives from "./computeActives.js";
import computePassives from "./computePassives.js";
import { buildCostOfSales } from "@/sims/project-feasibility/costTable/buildCostOfSales.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS, BALANCE } from "@/test-fixtures/input2Golden.js";

function buildTotalsByYear(cbm) {
  const actives = computeActives(cbm);
  const passives = computePassives(cbm);
  const { costOfSalesByYear } = buildCostOfSales(cbm);
  const netIncomeByYear = Object.fromEntries(costOfSalesByYear.map((row) => [row.year, row.netIncome]));

  const totalsByYear = {};
  YEARS.forEach((year) => {
    const fixedNet = actives.fixedAssets.find((row) => row.year === year).netValue;
    totalsByYear[year] = {
      totalActives: actives.currentActives.total[year] + fixedNet + actives.deferedActives.total[year],
      totalPassives: passives.totalPassives[year],
      netIncome: netIncomeByYear[year],
    };
  });
  return totalsByYear;
}

// RF73 - Crear tabla de capital contable (computeEquity).
describe("RF73 - Capital Contable (computeEquity)", () => {
  it("periodUtility = utilidad neta del anio (netIncome), tal cual, sin transformar", () => {
    const cbm = buildInput2Cbm();
    const totalsByYear = buildTotalsByYear(cbm);
    const { periodUtility } = computeEquity(totalsByYear, YEARS);
    YEARS.forEach((year) => {
      expect(periodUtility[year]).toBe(totalsByYear[year].netIncome);
    });
  });

  it("legacy (el plug) hace que Activo = Pasivo + legacy + periodUtility + acumUtility, siempre", () => {
    const cbm = buildInput2Cbm();
    const totalsByYear = buildTotalsByYear(cbm);
    const { legacy, periodUtility, acumUtility } = computeEquity(totalsByYear, YEARS);
    YEARS.forEach((year) => {
      const { totalActives, totalPassives } = totalsByYear[year];
      const sum = totalPassives + legacy[year] + periodUtility[year] + acumUtility[year];
      expect(sum).toBeCloseTo(totalActives, 6);
    });
  });

  it("acumUtility del primer anio es 0 (no hay anio previo que acumular)", () => {
    const cbm = buildInput2Cbm();
    const totalsByYear = buildTotalsByYear(cbm);
    const { acumUtility } = computeEquity(totalsByYear, YEARS);
    expect(acumUtility[YEARS[0]]).toBe(0);
  });

  it("utilidad del periodo real: perdida en 2025-2026, ganancia desde 2027 (coincide con el Excel)", () => {
    const cbm = buildInput2Cbm();
    const totalsByYear = buildTotalsByYear(cbm);
    const { periodUtility } = computeEquity(totalsByYear, YEARS);
    expect(periodUtility[2025]).toBeLessThan(0);
    expect(periodUtility[2026]).toBeLessThan(0);
    for (let i = 2; i < YEARS.length; i += 1) {
      expect(periodUtility[YEARS[i]]).toBeGreaterThan(0);
    }
    expect(periodUtility[2025]).toBeCloseTo(BALANCE.utilidadPeriodo[0], 1);
  });
});
