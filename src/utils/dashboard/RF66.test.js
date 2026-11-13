import { describe, it, expect } from "vitest";
import { computeNPV, computeIRR } from "./financialEvaluation.js";
import { FLUJO, TREMA, TEMPLATE_TIR, TEMPLATE_VPN } from "@/test-fixtures/input2Golden.js";

// RF66 - Calcular TIR y VPN sobre el Flujo Neto real (Dron Super Sport).
describe("RF66 - Calcular VPN y TIR (computeNPV / computeIRR)", () => {
  it("VPN(flujoNeto, TREMA) = $158,952,317.65 real", () => {
    const npv = computeNPV(FLUJO.flujoNeto, TREMA);
    expect(npv).toBeCloseTo(TEMPLATE_VPN, 0);
  });

  it("TIR(flujoNeto) = 97.60% real", () => {
    const irr = computeIRR(FLUJO.flujoNeto);
    expect(irr).toBeCloseTo(TEMPLATE_TIR, 3);
  });

  it("VPN evaluado en la propia TIR es ~0 (definicion de TIR)", () => {
    const irr = computeIRR(FLUJO.flujoNeto);
    const npvAtIrr = computeNPV(FLUJO.flujoNeto, irr);
    expect(Math.abs(npvAtIrr)).toBeLessThan(1);
  });

  it("TIR regresa null si el flujo nunca cambia de signo (sin raiz real)", () => {
    const irr = computeIRR([100, 100, 100, 100]);
    expect(irr).toBeNull();
  });

  it("el primer anio de la serie SI se descuenta (exponente t+1, no t)", () => {
    // mismo tratamiento que la referencia del Excel: computeNPV descuenta
    // t=0 por (1+rate)^1, no por (1+rate)^0.
    const npv = computeNPV([1000], 0.1);
    expect(npv).toBeCloseTo(1000 / 1.1, 6);
  });
});
