/**
 * Forecast Method Tests — run with: node src/Sims/Forecasts/Calcs/__tests__/forecaster.test.mjs
 *
 * DATASET A — Monthly sales 2024, upward trend, 12 points
 *   Jan–Dec 2024: [15000, 18000, 21000, 19500, 23000, 27000, 25000, 28500, 31000, 29000, 34000, 42000]
 *   Pattern: general growth with small dips in Apr and Jul
 *   Interval: monthly
 *
 * DATASET B — Flat/stable sales, 12 points
 *   [20000, 20500, 19800, 20200, 20100, 19900, 20300, 20000, 20100, 19700, 20400, 20000]
 *   Pattern: near-constant. All methods should forecast ~20k.
 *
 * DATASET C — Minimal dataset, 3 points (edge case)
 *   [10000, 12000, 14000]
 *   Pattern: perfect linear growth. Linear methods should extrapolate exactly.
 *
 * EXPECTED BEHAVIOR per method:
 *   Simple Linear      — straight line extending the OLS trend
 *   Double Linear      — quadratic curve (y = b0 + b1x + b2x²), curves upward/downward faster
 *   Simple Moving(m=4) — converges to rolling average, flattens quickly
 *   Double Moving      — linear projection using DMA formula F(h) = a + b*h
 *   Simple Exponential — flat line at last EWM-smoothed value (SES h-step = constant)
 *   Double Exponential — linear trend from Holt's method (level + trend)
 *   Winter's           — level + trend + seasonal component (additive)
 */

// ─── helpers (mirrors dataForecaster.js) ───────────────────────────────────

function getNonNullRange(arr) {
    const first = arr.findIndex(v => v !== null);
    const last  = arr.findLastIndex(v => v !== null);
    if (first === -1) return { x: [], y: [], firstNonNull: -1, lastNonNull: -1 };
    const x = [], y = [];
    for (let i = first; i <= last; i++) {
        if (arr[i] !== null) { x.push(i + 1); y.push(arr[i]); }
    }
    return { x, y, firstNonNull: first, lastNonNull: last };
}

function solveLinearSystem3x3(A, b) {
    const n = 3;
    const aug = A.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < n; col++) {
        let maxRow = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
        }
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
        if (Math.abs(aug[col][col]) < 1e-10) return null;
        for (let row = col + 1; row < n; row++) {
            const f = aug[row][col] / aug[col][col];
            for (let j = col; j <= n; j++) aug[row][j] -= f * aug[col][j];
        }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = aug[i][n];
        for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j];
        x[i] /= aug[i][i];
    }
    return x;
}

function simpleLinear(baseArray) {
    const result = [...baseArray];
    const { x, y, firstNonNull, lastNonNull } = getNonNullRange(baseArray);
    const X = x.reduce((a,b)=>a+b,0)/x.length;
    const Y = y.reduce((a,b)=>a+b,0)/y.length;
    const top = x.map((xi,i)=>(xi-X)*(y[i]-Y)).reduce((a,b)=>a+b,0);
    const bot = x.map(xi=>(xi-X)**2).reduce((a,b)=>a+b,0);
    const b1 = top/bot, b0 = Y - b1*X;
    for (let i = lastNonNull+1; i < baseArray.length; i++) result[i] = Math.round(b0 + b1*(i+1));
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;
    return result;
}

function doubleLinear(baseArray) {
    const result = [...baseArray];
    const { x, y, firstNonNull, lastNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1 || x.length < 3) return result;
    const n = x.length;
    const S1=x.reduce((a,xi)=>a+xi,0), S2=x.reduce((a,xi)=>a+xi**2,0);
    const S3=x.reduce((a,xi)=>a+xi**3,0), S4=x.reduce((a,xi)=>a+xi**4,0);
    const Sy=y.reduce((a,b)=>a+b,0), Sxy=x.reduce((a,xi,i)=>a+xi*y[i],0);
    const Sx2y=x.reduce((a,xi,i)=>a+xi**2*y[i],0);
    const coeffs = solveLinearSystem3x3([[n,S1,S2],[S1,S2,S3],[S2,S3,S4]],[Sy,Sxy,Sx2y]);
    if (!coeffs) return result;
    const [b0,b1,b2] = coeffs;
    for (let i = lastNonNull+1; i < baseArray.length; i++) result[i] = Math.round(b0+b1*(i+1)+b2*(i+1)**2);
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;
    return result;
}

function simpleMoving(baseArray, compound=4) {
    const result = [...baseArray];
    const { lastNonNull } = getNonNullRange(baseArray);
    for (let i = lastNonNull+1; i < baseArray.length; i++) {
        const w = result.slice(Math.max(0, i-compound), i).filter(v=>v!==null);
        result[i] = w.length ? Math.round(w.reduce((a,b)=>a+b,0)/w.length) : 0;
    }
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;
    return result;
}

function doubleMoving(baseArray) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;
    const n = y.length;
    const m = Math.max(2, Math.floor(n/3));
    const sma = y.map((_,i) => {
        if (i < m-1) return null;
        const w = y.slice(i-m+1, i+1);
        return w.reduce((a,b)=>a+b,0)/m;
    });
    const dma = sma.map((_,i) => {
        if (i < 2*m-2) return null;
        const w = sma.slice(i-m+1, i+1).filter(v=>v!==null);
        return w.length===m ? w.reduce((a,b)=>a+b,0)/m : null;
    });
    const lastSMA = sma[n-1], lastDMA = dma[n-1];
    if (lastSMA===null||lastDMA===null) return result;
    const a = 2*lastSMA-lastDMA;
    const b = m>1 ? (2/(m-1))*(lastSMA-lastDMA) : 0;
    for (let i = lastNonNull+1; i < baseArray.length; i++) result[i] = Math.round(a+b*(i-lastNonNull));
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;
    return result;
}

function simpleExponential(baseArray, alpha=0.5) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;
    let smoothed = y[0];
    for (let i = 1; i < y.length; i++) smoothed = alpha*y[i] + (1-alpha)*smoothed;
    for (let i = lastNonNull+1; i < baseArray.length; i++) result[i] = Math.round(smoothed);
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;
    return result;
}

function doubleExponential(baseArray, alpha=0.5, beta=0.3) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;
    let level=y[0], trend=y.length>1?y[1]-y[0]:0;
    for (let i = lastNonNull+1; i < baseArray.length; i++) {
        const lastVal = result[i-1]??level+trend;
        const newLevel=alpha*lastVal+(1-alpha)*(level+trend);
        const newTrend=beta*(newLevel-level)+(1-beta)*trend;
        result[i]=Math.round(newLevel+newTrend);
        level=newLevel; trend=newTrend;
    }
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;
    return result;
}

function winters(baseArray, seasonLength=12, alpha=0.5, beta=0.3, gamma=0.2) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;
    const n=y.length, sl=Math.min(seasonLength,n);
    let level=y.slice(0,sl).reduce((a,b)=>a+b,0)/sl;
    let trend=n>1?(y[n-1]-y[0])/(n-1):0;
    const season=Array(seasonLength).fill(0);
    for (let i=0;i<sl;i++) season[i]=y[i]-level;
    for (let i=1;i<n;i++) {
        const s=season[(firstNonNull+i)%seasonLength];
        const nl=alpha*(y[i]-s)+(1-alpha)*(level+trend);
        const nt=beta*(nl-level)+(1-beta)*trend;
        season[(firstNonNull+i)%seasonLength]=gamma*(y[i]-nl)+(1-gamma)*s;
        level=nl; trend=nt;
    }
    for (let i=lastNonNull+1;i<baseArray.length;i++) {
        result[i]=Math.round(level+trend+season[i%seasonLength]);
        level=level+trend;
    }
    for (let i=0;i<=lastNonNull;i++) result[i]=null;
    return result;
}

// ─── test runner ───────────────────────────────────────────────────────────

function makeBase(data, forecastPeriods) {
    return [...data, ...Array(forecastPeriods).fill(null)];
}

function future(arr, dataLen) { return arr.slice(dataLen); }

function check(label, values, condition, hint) {
    const ok = condition(values);
    console.log(`  ${ok ? '✅' : '❌'} ${label}${ok ? '' : ' — ' + hint}`);
    return ok;
}

let passed = 0, failed = 0;
function run(label, fn) {
    console.log(`\n── ${label}`);
    const result = fn();
    if (result !== false) passed++; else failed++;
}

// ─── DATASET A: monthly upward trend 2024 ──────────────────────────────────
const A = [15000,18000,21000,19500,23000,27000,25000,28500,31000,29000,34000,42000];
const baseA = makeBase(A, 12);

run('Dataset A — Simple Linear: values increase each month', () => {
    const f = future(simpleLinear(baseA), 12);
    return check('strictly increasing', f, v => v.every((x,i)=>i===0||x>v[i-1]), 'not monotone');
});

run('Dataset A — Double Linear: quadratic, differs from simple linear', () => {
    const sl = future(simpleLinear(baseA), 12);
    const dl = future(doubleLinear(baseA), 12);
    return check('different from simple linear', dl, v => v.some((x,i)=>x!==sl[i]), 'identical to simple linear');
});

run('Dataset A — Simple Moving (m=4): all forecast values are positive', () => {
    const f = future(simpleMoving(baseA, 4), 12);
    return check('all positive', f, v => v.every(x=>x>0), 'some zero or negative');
});

run('Dataset A — Double Moving: no nulls (fixed compound)', () => {
    const f = future(doubleMoving(baseA), 12);
    return check('no nulls', f, v => v.every(x=>x!==null), 'still has nulls');
});

run('Dataset A — Simple Exponential: flat line (SES property)', () => {
    const f = future(simpleExponential(baseA), 12);
    return check('all same value', f, v => v.every(x=>x===v[0]), 'not flat — SES must be constant');
});

run('Dataset A — Simple Exponential: warm-up correct (~36k, not 28.5k)', () => {
    const f = future(simpleExponential(baseA), 12);
    return check('forecast ~36000-38000', f, v => v[0] > 34000 && v[0] < 40000,
        `got ${f[0]}, expected 34000-40000 (warm-up bug if 28500)`);
});

run('Dataset A — Double Exponential: increasing trend', () => {
    const f = future(doubleExponential(baseA), 12);
    return check('increasing', f, v => v[v.length-1] > v[0], 'flat or decreasing');
});

run("Dataset A — Winter's: seasonal components active (not all same value)", () => {
    const f = future(winters(baseA), 12);
    return check('variation present', f, v => new Set(v).size > 1, 'flat — seasonal not working');
});

// ─── DATASET B: stable/flat ─────────────────────────────────────────────────
const B = [20000,20500,19800,20200,20100,19900,20300,20000,20100,19700,20400,20000];
const baseB = makeBase(B, 12);

run('Dataset B — Simple Linear: forecast near 20000 (±2000)', () => {
    const f = future(simpleLinear(baseB), 12);
    return check('near 20000', f, v => v.every(x=>Math.abs(x-20000)<2000), `got ${f[0]}`);
});

run('Dataset B — Simple Exponential: flat near 20000 (±1500)', () => {
    const f = future(simpleExponential(baseB), 12);
    return check('near 20000', f, v => Math.abs(v[0]-20000)<1500, `got ${f[0]}`);
});

// ─── DATASET C: perfect linear, 3 points ───────────────────────────────────
const C = [10000, 12000, 14000];
const baseC = makeBase(C, 6);

run('Dataset C — Simple Linear: perfect +2000/period extrapolation', () => {
    const f = future(simpleLinear(baseC), C.length); // slice from index 3
    return check('first forecast ~16000', f, v => Math.abs(v[0]-16000)<100, `got ${f[0]}`);
});

run('Dataset C — Double Moving: handles small dataset (3 pts, m=1)', () => {
    const f = future(doubleMoving(baseC), C.length);
    return check('no nulls', f, v => v.every(x=>x!==null&&!isNaN(x)), 'nulls or NaN present');
});

// ─── summary ───────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
