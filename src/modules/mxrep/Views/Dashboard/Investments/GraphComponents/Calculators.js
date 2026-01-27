function getBreakEven(lifetime, inflows, outflows, cashflows, initialInv) {
    console.log(inflows)
    console.log(outflows)
    if (cashflows[0] >= 0) {
        return ((outflows[0] + initialInv) / inflows[0]).toFixed(1)
    }

    let accumulated = 0
    for (let i = 0; i < lifetime; i++) {
        accumulated += cashflows[i]
        if (accumulated >= 0) {
            // if (outflows[i - 1] <= 0) {
            //     const avOutflow = outflows.splice(0, i - 1).reduce((prev, curr) => prev + curr, 0)/(i - 1).toFixed(1)
            //     return (i + Math.abs(avOutflow/inflows[i])).toFixed(1)
            // }
            return (i + Math.abs(outflows[i-1]/inflows[i])).toFixed(1)
        }
    }
    return null
}

function getROI(inflows, outflows, initialInv) {
    const benefits = inflows.reduce((prev, curr) => prev + curr, 0)
    const costs = outflows.reduce((prev, curr) => prev + curr, 0) + initialInv
    const roi = ((benefits - costs) / costs) * 100
    const result = parseFloat(roi.toFixed(2))
    return result
}

function getNPV(lifetime, cashflows, discountRate) {
    let npv = 0
    for (let i = 0; i < lifetime; i++) {
        npv += (cashflows[i])/(1 + (discountRate/100)) ** i
    }
    return npv.toFixed(2)
} 

function getIRR(lifetime, inflows, outflows, initialInv, precomputedNPV) {
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
        npv -= initialInv;

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


export function getResults(lifetime, initialInv, inflows, outflows, discountRate)  {
    console.log("lifetime: ", lifetime)
    console.log("initialInv: ", initialInv)
    console.log("inflows: ", inflows)
    console.log("outflows: ", outflows)
    console.log("discountRate: ", discountRate)
    const cashflows = inflows.map((inflow, index) => {
        if (index == 0) return inflow - outflows[index] - initialInv
        else return inflow - outflows[index]
    })
    console.log("cashflows: ", cashflows)
    const breakEven = getBreakEven(lifetime, inflows, outflows, cashflows, initialInv)
    const roi = getROI(inflows, outflows, initialInv)
    const npv = getNPV(lifetime, cashflows, discountRate)
    const irr = getIRR(lifetime, inflows, outflows, initialInv, npv)

    console.log("breakEven: ", breakEven)
    console.log("roi: ", roi)
    console.log("npv: ", npv)
    console.log("irr: ", irr)

    return [breakEven, roi, npv, irr]
}

export function getProj(index, history) {
    for (let i = 0; i < history.length; i++) {
        if (history[i].index == index) {
            return history[i]
        }
    }
}

// export default getResults