import { describe, it, expect } from "vitest";
import { RATIO_DEFINITIONS, safeDivide } from "./ratioDefinitions.js";
import computeActives from "./computeActives.js";
import computePassives from "./computePassives.js";
import { buildCostOfSales } from "@/sims/project-feasibility/costTable/buildCostOfSales.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS, VENTAS_NETAS, BALANCE } from "@/test-fixtures/input2Golden.js";

function buildTotalsByYear(cbm) {
  const actives = computeActives(cbm);
  const passives = computePassives(cbm);
  const { costOfSalesByYear } = buildCostOfSales(cbm);
  const netIncomeByYear = Object.fromEntries(costOfSalesByYear.map((row) => [row.year, row.netIncome]));
  const netSalesByYear = Object.fromEntries(costOfSalesByYear.map((row) => [row.year, row.netSales]));

  const totalsByYear = {};
  YEARS.forEach((year) => {
    const fixedNet = actives.fixedAssets.find((row) => row.year === year).netValue;
    totalsByYear[year] = {
      currentActivesTotal: actives.currentActives.total[year],
      currentPassivesTotal: 0, // RF71: Current Passives tiene fuente real = 0 (sin default UI aqui)
      totalActives: actives.currentActives.total[year] + fixedNet + actives.deferedActives.total[year],
      totalPassives: passives.totalPassives[year],
      inventory: 0,
      netSales: netSalesByYear[year],
      netIncome: netIncomeByYear[year],
    };
  });
  return totalsByYear;
}

// RF74 - Crear tabla de razones (8 RATIO_DEFINITIONS, cada una (totals) => numero).
describe("RF74 - Razones Financieras (RATIO_DEFINITIONS)", () => {
  it("son exactamente 8 razones, en el orden del Template Financiero", () => {
    expect(RATIO_DEFINITIONS.map((def) => def.key)).toEqual([
      "currentRatio",
      "acidTest",
      "workingCapital",
      "debtToAssets",
      "equityToAssets",
      "assetTurnover",
      "netProfitMargin",
      "returnOnAssets",
    ]);
  });

  it("Total Asset Turnover = Ventas Netas / Activo Total, reproduce el real", () => {
    const cbm = buildInput2Cbm();
    const totalsByYear = buildTotalsByYear(cbm);
    const assetTurnover = RATIO_DEFINITIONS.find((def) => def.key === "assetTurnover");
    YEARS.forEach((year, i) => {
      const value = assetTurnover.compute(totalsByYear[year]);
      expect(value).toBeCloseTo(safeDivide(VENTAS_NETAS[i], totalsByYear[year].totalActives), 4);
    });
  });

  it("Debt to Assets = Pasivo Total / Activo Total, reproduce el real", () => {
    const cbm = buildInput2Cbm();
    const totalsByYear = buildTotalsByYear(cbm);
    const debtToAssets = RATIO_DEFINITIONS.find((def) => def.key === "debtToAssets");
    YEARS.forEach((year, i) => {
      const value = debtToAssets.compute(totalsByYear[year]);
      expect(value).toBeCloseTo(totalsByYear[year].totalPassives / BALANCE.totalActivo[i], 2);
    });
  });

  it("Return on Assets = Utilidad Neta / Activo Total", () => {
    const cbm = buildInput2Cbm();
    const totalsByYear = buildTotalsByYear(cbm);
    const roa = RATIO_DEFINITIONS.find((def) => def.key === "returnOnAssets");
    const value2026 = roa.compute(totalsByYear[2026]);
    expect(value2026).toBeCloseTo(BALANCE.utilidadPeriodo[1] / totalsByYear[2026].totalActives, 2);
  });

  it("safeDivide regresa NaN con denominador 0 (no Infinity, no error)", () => {
    expect(safeDivide(100, 0)).toBeNaN();
    expect(safeDivide(0, 0)).toBeNaN();
    expect(safeDivide(100, 5)).toBe(20);
  });

  it("Working Capital = Activo Circulante - Pasivo Circulante (no es division, es resta)", () => {
    const workingCapital = RATIO_DEFINITIONS.find((def) => def.key === "workingCapital");
    expect(workingCapital.compute({ currentActivesTotal: 100, currentPassivesTotal: 30 })).toBe(70);
  });
});
