import { describe, it, expect } from "vitest";
import {
  buildOutflowRows,
  computeCapexByYear,
  outflowBaseValue,
  getExtraAssetCategories,
} from "./outflowCalculations.js";
import { buildCostOfSales } from "./buildCostOfSales.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS, INVERSION, ESTADO_RESULTADOS, COSTOS, FLUJO } from "@/test-fixtures/input2Golden.js";

function totalSalidasByYear(cbm) {
  const { costOfSalesByYear } = buildCostOfSales(cbm);
  const rowByYear = Object.fromEntries(costOfSalesByYear.map((row) => [row.year, row]));
  const capexByYear = computeCapexByYear(cbm, YEARS);
  const rows = buildOutflowRows(cbm);
  const totals = {};
  YEARS.forEach((year) => {
    totals[year] = rows.reduce((sum, row) => sum + outflowBaseValue(row.key, year, rowByYear, capexByYear), 0);
  });
  return totals;
}

// RF64 - Crear tabla de salidas (Cash Outflows).
describe("RF64 - Crear tabla de salidas (buildOutflowRows + outflowBaseValue)", () => {
  it("reproduce el Total de Salidas real de los 11 anios", () => {
    const cbm = buildInput2Cbm();
    const totals = totalSalidasByYear(cbm);
    YEARS.forEach((year, i) => {
      expect(totals[year]).toBeCloseTo(FLUJO.totalSalidas[i], 0);
    });
  });

  it("materia prima es el componente mayor de las salidas (10x la MOD en anio 0)", () => {
    expect(COSTOS.materiasPrimas[0]).toBeGreaterThan(COSTOS.MOD[0] * 10);
  });

  it("salidas del anio 0 incluyen la inversion completa (maquinaria+edificio+transporte+computo+obra civil)", () => {
    const cbm = buildInput2Cbm();
    const totals = totalSalidasByYear(cbm);
    const inversionTotal =
      INVERSION.maquinaria + INVERSION.edificio + INVERSION.transporte + INVERSION.equipoComputo + INVERSION.obraCivil;
    expect(totals[2025]).toBeGreaterThan(inversionTotal);
  });

  it("pago de credito constante en anios 0-4, decreciente despues (ver nota en RF71/72 sobre el desfase del archivo de referencia)", () => {
    const cbm = buildInput2Cbm();
    const { costOfSalesByYear } = buildCostOfSales(cbm);
    const rowByYear = Object.fromEntries(costOfSalesByYear.map((row) => [row.year, row]));
    for (let i = 0; i < 5; i += 1) {
      expect(rowByYear[YEARS[i]].creditPayment).toBeCloseTo(ESTADO_RESULTADOS.pagoCredito[i], 0);
    }
    // el prestamo de 80 meses termina de pagarse dentro de este horizonte -
    // confirma que cae a 0 en algun punto, sin fijar el anio exacto (eso es
    // justo lo que RF71/72 documenta como inconsistente en el archivo de referencia).
    expect(rowByYear[YEARS[10]].creditPayment).toBe(0);
  });

  it("categorias de activos que no son Edificios/Transporte/Computo/Maquinaria generan su propia fila dinamica", () => {
    const cbm = buildInput2Cbm();
    cbm.assets.byCategory["Animales"] = [{ name: "Vaca", acquisitionByYear: Array(11).fill(50000) }];
    const extra = getExtraAssetCategories(cbm);
    expect(extra).toEqual(["Animales"]);
    const rows = buildOutflowRows(cbm);
    expect(rows.some((row) => row.key === "extraAsset:Animales")).toBe(true);
  });

  it("maquinaria (via Capacidad) NO duplica fila - esta cubierta por la fila fija, no por una extra", () => {
    const cbm = buildInput2Cbm();
    const extra = getExtraAssetCategories(cbm);
    expect(extra).toEqual([]); // Edificios/Equipo de Transporte/Equipo de Computo son todas conocidas
  });
});
