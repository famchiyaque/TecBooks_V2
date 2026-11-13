import { describe, it, expect } from "vitest";
import computePassives from "./computePassives.js";
import { buildInput2Cbm } from "@/test-fixtures/input2GoldenCbm.js";
import { YEARS, BALANCE } from "@/test-fixtures/input2Golden.js";

// RF72 - Crear tabla de pasivo a largo plazo (computePassives -> computeFinancing).
// Nota: BALANCE.capitalVigente/pagoIntereses (archivo de referencia descargado)
// se desalinea un anio justo donde el prestamo termina de pagarse (idx 5-6)
// respecto a su PROPIO ESTADO_RESULTADOS.gastosFinancieros/pagoCredito - el
// codigo real (computeFinancing.js) alimenta ambos con la misma funcion, asi
// que no pueden desalinearse entre si; coincide exacto con ESTADO_RESULTADOS
// (ver RF56/RF64). Por eso el match exacto contra BALANCE solo se exige en
// los anios 0-4, donde ambos arreglos del archivo de referencia coinciden.
describe("RF72 - Pasivo a Largo Plazo (computePassives)", () => {
  it("capital vigente decrece anio tras anio mientras se paga el prestamo (anios 0-4)", () => {
    const cbm = buildInput2Cbm();
    const { longTermPassives } = computePassives(cbm);
    for (let i = 1; i < 5; i += 1) {
      expect(longTermPassives[YEARS[i]].currentCapital).toBeLessThan(
        longTermPassives[YEARS[i - 1]].currentCapital,
      );
    }
  });

  it("reproduce capital vigente + intereses reales en los anios 0-4", () => {
    const cbm = buildInput2Cbm();
    const { longTermPassives } = computePassives(cbm);
    for (let i = 0; i < 5; i += 1) {
      expect(longTermPassives[YEARS[i]].currentCapital).toBeCloseTo(BALANCE.capitalVigente[i], 1);
      expect(longTermPassives[YEARS[i]].interestsPayment).toBeCloseTo(BALANCE.pagoIntereses[i], 1);
    }
  });

  it("el prestamo (80 meses = 6 años 8 meses) termina de pagarse dentro del horizonte de 11 anios", () => {
    const cbm = buildInput2Cbm();
    const { longTermPassives } = computePassives(cbm);
    const lastYear = YEARS[YEARS.length - 1];
    expect(longTermPassives[lastYear].currentCapital).toBe(0);
    expect(longTermPassives[lastYear].interestsPayment).toBe(0);
  });

  it("pasivo LP = capital vigente + intereses por pagar (mismos 2 componentes, nunca otra cosa)", () => {
    const cbm = buildInput2Cbm();
    const { longTermPassives, totalPassives } = computePassives(cbm);
    YEARS.forEach((year) => {
      const expected = (longTermPassives[year].currentCapital || 0) + (longTermPassives[year].interestsPayment || 0);
      expect(totalPassives[year]).toBeCloseTo(expected, 1);
    });
  });
});
