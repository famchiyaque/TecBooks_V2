import { describe, it, expect } from "vitest";
import { decideProject } from "./financialEvaluation.js";
import { TREMA, TEMPLATE_TIR, TEMPLATE_VPN } from "@/test-fixtures/input2Golden.js";

// RF67 - Definir decision: se acepta si VPN > 0 Y TIR > TREMA.
describe("RF67 - Decision del proyecto (decideProject)", () => {
  it("Dron Super Sport se acepta: VPN=$158.9M > 0 y TIR=97.6% > TREMA=30.3%", () => {
    const decision = decideProject(TEMPLATE_VPN, TEMPLATE_TIR, TREMA);
    expect(decision.accepted).toBe(true);
    expect(decision.reason).toBeNull();
  });

  it("se rechaza si VPN < 0, aunque la TIR sea buena", () => {
    const decision = decideProject(-1000000, 0.5, TREMA);
    expect(decision.accepted).toBe(false);
  });

  it("se rechaza si TIR < TREMA, aunque el VPN sea positivo", () => {
    const decision = decideProject(1000000, 0.2, TREMA);
    expect(decision.accepted).toBe(false);
  });

  it("se rechaza con motivo explicito si TIR es null (sin cambio de signo en el flujo)", () => {
    const decision = decideProject(1000000, null, TREMA);
    expect(decision.accepted).toBe(false);
    expect(decision.reason).toMatch(/IRR/i);
  });
});
