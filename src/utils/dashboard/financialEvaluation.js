/**
 * RF-65: TREMA = best market rate + inflation + risk premium. Risk premium
 * has no source field anywhere in InputNovus - manual input only, same
 * situation as Financial Income (RF-56).
 */
export function computeTrema(marketRate, inflation, riskPremium) {
  return marketRate + inflation + riskPremium;
}

/**
 * RF-66: VNA (NPV) = sum(cashFlow[t] / (1+rate)^t). t=0 (the series' first
 * year) is not discounted, matching how the reference template's own VNA
 * treats the project's first year.
 */
export function computeNPV(cashFlows, rate) {
  return cashFlows.reduce((sum, cashFlow, t) => sum + cashFlow / (1 + rate) ** t, 0);
}

/**
 * RF-66: TIR (IRR) - the rate where NPV = 0. Bisection over a wide range
 * instead of Newton-Raphson: robust regardless of how many sign changes the
 * cash flow series has (a heavy year-0 investment followed by positive
 * years is exactly the shape Newton-Raphson can diverge on). Returns null
 * if NPV doesn't change sign across the range - no real root to find.
 */
export function computeIRR(cashFlows, { low = -0.99, high = 10, tolerance = 1e-6, maxIterations = 200 } = {}) {
  let lowerBound = low;
  let upperBound = high;
  let npvAtLower = computeNPV(cashFlows, lowerBound);
  let npvAtUpper = computeNPV(cashFlows, upperBound);
  if (npvAtLower * npvAtUpper > 0) return null;

  let mid = lowerBound;
  for (let i = 0; i < maxIterations; i += 1) {
    mid = (lowerBound + upperBound) / 2;
    const npvAtMid = computeNPV(cashFlows, mid);
    if (Math.abs(npvAtMid) < tolerance) return mid;
    if (npvAtLower * npvAtMid < 0) {
      upperBound = mid;
      npvAtUpper = npvAtMid;
    } else {
      lowerBound = mid;
      npvAtLower = npvAtMid;
    }
  }
  return mid;
}

/**
 * RF-67 (absorbed into RF-66's own activity diagram, no separate flow):
 * accept the project iff VNA > 0 AND TIR > TREMA.
 */
export function decideProject(npv, irr, trema) {
  if (irr === null) {
    return { accepted: false, reason: "IRR couldn't be computed for this cash flow (no sign change)." };
  }
  return { accepted: npv > 0 && irr > trema, reason: null };
}
