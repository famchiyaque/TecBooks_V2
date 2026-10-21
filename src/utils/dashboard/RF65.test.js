import { describe, it, expect } from "vitest";
import { computeTrema } from "./financialEvaluation.js";
import { TREMA_COMPONENTS, TREMA } from "@/test-fixtures/input2Golden.js";

// RF65 - Calcular el TREMA = tasa lider + inflacion + premio al riesgo.
describe("RF65 - Calcular TREMA (computeTrema)", () => {
  it("reproduce el TREMA real = 0.303 (16% + 4.3% + 10%)", () => {
    const result = computeTrema(
      TREMA_COMPONENTS.tasaLider,
      TREMA_COMPONENTS.inflacion,
      TREMA_COMPONENTS.premioRiesgo,
    );
    expect(result).toBeCloseTo(TREMA, 10);
  });

  it("es suma simple de los 3 componentes, en cualquier orden", () => {
    const a = computeTrema(0.1, 0.02, 0.05);
    const b = computeTrema(0.05, 0.1, 0.02);
    expect(a).toBeCloseTo(0.17, 10);
    expect(b).toBeCloseTo(0.17, 10);
  });

  it("premio al riesgo en 0 no rompe el calculo (manual, sin fuente en InputNovus)", () => {
    expect(computeTrema(0.16, 0.043, 0)).toBeCloseTo(0.203, 10);
  });
});
