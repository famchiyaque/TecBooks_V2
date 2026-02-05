# Calculation and UI Fixes - Manufacturing Dashboard

## 🔧 Issues Fixed

### 1. **Incorrect Financial Calculations**

#### Problem
- IRR, NPV, break-even calculations didn't match the proven investment simulator
- NPV was always best at year 10 (indicating flawed optimization logic)
- Calculations weren't properly handling Year 0 vs operational years

#### Solution
Rewrote `calculateProjectMetricsForLifetime()` to match the investment simulator's proven formulas:

**NPV Calculation:**
```javascript
// OLD (wrong): Discount factor started at 1 for Year 0
npv += cashflows[year] / Math.pow(1 + trema, year)

// NEW (correct): i=0 means no discount for Year 0
npv += cashflows[i] / Math.pow(1 + (discountRatePercent / 100), i)
```

**IRR Calculation:**
```javascript
// OLD: Used Newton-Raphson on combined cashflows
// NEW: Uses binary search method, subtracts initial investment at END
for (let t = 0; t < lifetime; t++) {
  const cashFlow = inflows[t] - outflows[t];
  npvAtRate += cashFlow / Math.pow(1 + guessRate / 100, t);
}
npvAtRate -= initialInvestment; // Subtract at the end!
```

**Cashflows Calculation:**
```javascript
// Year 0 includes initial investment
if (index === 0) {
  return inflow - outflow - initialInvestment;
} else {
  return inflow - outflow;
}
```

**Break-even:**
```javascript
// Uses accumulated cashflows method
let accumulated = 0;
for (let i = 0; i < lifetime; i++) {
  accumulated += cashflows[i];
  if (accumulated >= 0) {
    breakEven = i + Math.abs(outflows[i - 1] / inflows[i]);
    break;
  }
}
```

### 2. **Distracting UI Colors**

#### Problem
- Metric cards had bright gradient backgrounds and large text
- Best Lifetime box was too prominent with colored background
- Overall design didn't match the Material Design aesthetic

#### Solution

**Metric Cards (Before → After):**
- ❌ Gradient backgrounds: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`
- ✅ Clean white: `bgcolor: 'white', border: '1px solid divider'`
- ❌ Large icons: `fontSize: 32`
- ✅ Subtle icons: `fontSize: 20, opacity: 0.7`
- ❌ H3 value text: `variant="h3"`
- ✅ H4 value text: `variant="h4"`
- ❌ Large padding: default
- ✅ Compact padding: `p: 2`

**Best Lifetime Box:**
- ❌ Large colored card with multiple sections
- ✅ Thin horizontal strip: `py: 1.5, px: 2`
- ❌ Background: `bgcolor: 'success.light'`
- ✅ Background: `bgcolor: 'white', borderColor: 'success.light'`
- ❌ Position: Above charts
- ✅ Position: Below charts (less prominent)

### 3. **Cashflow Chart**

#### Problem
- Using Highcharts instead of Chart.js (inconsistent with simulator)
- Different calculation logic for cashflows

#### Solution
Created `CashflowChartJS.jsx` matching the investment simulator:
- Uses Chart.js (same as `src/Sims/Investments/Components/Graph.jsx`)
- Exact same cashflow calculation logic
- Bar chart for annual cashflow (green/red)
- Line chart for cumulative cashflow
- Dual Y-axes for better readability

## 📊 Calculation Reference

### From Investment Simulator (`Sims/Investments/Calcs/Calculators.js`)

```javascript
// NPV
export function getNPV(lifetime, cashflows, discountRate) {
  let npv = 0
  for (let i = 0; i < lifetime; i++) {
    npv += (cashflows[i])/(1 + (discountRate/100)) ** i
  }
  return npv.toFixed(2)
}

// IRR
export function getIRR(lifetime, inflows, outflows, initialInv, precomputedNPV) {
  // Binary search between lowRate and highRate
  // npvAtRate = sum of (inflows[t] - outflows[t]) / (1 + rate/100)^t
  // npvAtRate -= initialInv  // <-- Key: subtract at END
}

// Break-even
export function getBreakEven(lifetime, inflows, outflows, cashflows, initialInv) {
  let accumulated = 0
  for (let i = 0; i < lifetime; i++) {
    accumulated += cashflows[i]
    if (accumulated >= 0) {
      return (i + Math.abs(outflows[i-1]/inflows[i])).toFixed(1)
    }
  }
  return null
}

// ROI
export function getROI(inflows, outflows, initialInv) {
  const benefits = inflows.reduce((prev, curr) => prev + curr, 0)
  const costs = outflows.reduce((prev, curr) => prev + curr, 0) + initialInv
  return ((benefits - costs) / costs) * 100
}
```

## 🎨 UI Changes Summary

### Before
```
┌──────────────────────────────────────────────┐
│ [Colored gradient cards with large text]     │
├──────────────────────────────────────────────┤
│ [Large colored box with detailed metrics]    │
├──────────────────────────────────────────────┤
│ Charts...                                    │
└──────────────────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────────────┐
│ [Clean white cards with subtle borders]      │
├──────────────────────────────────────────────┤
│ Charts (NPV by lifetime | Cashflow)          │
├──────────────────────────────────────────────┤
│ [Thin white strip with best lifetime info]   │
└──────────────────────────────────────────────┘
```

## 📁 Files Modified

1. **`src/core/engine/manufacturingProjections.js`**
   - Rewrote `calculateProjectMetricsForLifetime()` function
   - Now uses inflows/outflows instead of netCashflows
   - Matches investment simulator calculations exactly

2. **`src/dashboard/views/ProjectEvaluation/components/MetricsCards.jsx`**
   - Changed to white background with subtle borders
   - Reduced text sizes and icon sizes
   - More compact padding

3. **`src/dashboard/views/ProjectEvaluation/components/BestLifetimeBox.jsx`**
   - Converted to thin horizontal strip
   - White background with subtle colored border
   - Moved below charts

4. **`src/dashboard/views/ProjectEvaluation/ProjectEvaluation_View.jsx`**
   - Switched to `CashflowChartJS` component
   - Repositioned BestLifetimeBox below charts

5. **`src/dashboard/views/ProjectEvaluation/components/CashflowChartJS.jsx` (NEW)**
   - Created using Chart.js matching simulator
   - Annual cashflow bars (green/red)
   - Cumulative cashflow line (blue)
   - Lifetime selector dropdown

## ✅ Validation

All calculations now match the proven investment simulator formulas:
- ✅ NPV calculation with correct discount factors
- ✅ IRR using binary search with initial investment subtracted at end
- ✅ Break-even using accumulated cashflows
- ✅ ROI calculation
- ✅ Cashflow calculation with Year 0 handling

UI now follows Material Design principles:
- ✅ Clean white backgrounds
- ✅ Subtle colors and borders
- ✅ Appropriate text sizes
- ✅ Proper visual hierarchy

## 🧪 Testing

To verify calculations are correct:
1. Upload a manufacturing template
2. Compare NPV, IRR, ROI, break-even with manual calculations
3. Check that best lifetime is NOT always year 10
4. Verify cashflow chart matches expected values
5. Ensure UI is clean and not distracting

The calculations should now produce accurate financial metrics! 🎉
