export function getBreakEven(lifetime, inflows, outflows) {
    let accumulated = 0
    let prev = 0
    for (let i = 0; i < lifetime; i++) {
        accumulated += inflows[i] - outflows[i]
        if (accumulated >= 0) {
            const monthlyRate = inflows[i]/12 - outflows[i]/12
            const monthsIn = Math.abs(accumulated/monthlyRate)*0.1
            return (i + monthsIn).toFixed(1)
        }
        prev += inflows[i] - outflows[i]
    }
    return null
}

export function getROI(inflows, outflows) {
    const benefits = inflows.reduce((prev, curr) => prev + curr, 0)
    // const costs = outflows.reduce((prev, curr) => prev + curr, 0) + initialInv
    const costs = outflows.reduce((prev, curr) => prev + curr, 0)
    const roi = ((benefits - costs) / costs) * 100
    const result = parseFloat(roi.toFixed(1))
    return result
}

export function getNPV(lifetime, cashflows, discountRate) {
    let npv = 0
    for (let i = 0; i < lifetime; i++) {
        npv += (cashflows[i])/(1 + (discountRate/100)) ** (i+1)
    }
    return npv.toFixed(2)
} 

export function getIRR(lifetime, inflows, outflows, precomputedNPV) {
    let lowRate = 0;
    let highRate = 100;
    let irr = 0;
    let iterations = 1000;
    const tolerance = 0.01;

    // If the precomputed NPV is close to zero, IRR might be close to 0%
    if (Math.abs(precomputedNPV) < tolerance) {
        return irr.toFixed(1);
    }

    // Use precomputed NPV to adjust initial boundaries
    if (precomputedNPV > 0) {
        lowRate = 0;
        highRate = 200; // Allow for higher rates in extreme cases
    } else {
        lowRate = -100; // Handle negative cash flows
        highRate = 0;
    }

    while (iterations--) {
        let guessRate = (lowRate + highRate) / 2;
        let npv = 0;

        for (let t = 0; t < lifetime; t++) {
            const cashFlow = inflows[t] - outflows[t];
            npv += cashFlow / Math.pow(1 + guessRate / 100, t);
        }
        // npv -= initialInv;

        if (Math.abs(npv) < tolerance) {
            irr = guessRate;
            break;
        }

        if (npv > 0) {
            lowRate = guessRate;
        } else {
            highRate = guessRate;
        }
    }

    // If it fails to converge, return highRate as a fallback
    if (iterations <= 0) {
        irr = highRate;
    }

    return irr.toFixed(1);
}


export function getProj(index, history) {
    for (let i = 0; i < history.length; i++) {
        if (history[i].index == index) {
            return history[i]
        }
    }
}

// export default getResults