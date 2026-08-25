# TecBooks V2 Migration Guide

## What Changed?

TecBooks V2 has been restructured to support a more scalable, maintainable architecture that can handle multiple input sources and generate a unified financial dashboard.

## New Architecture

### Before (Legacy)
```
src/
├── TECBooks/          # Survey + Dashboard (tightly coupled)
├── MxRep/             # Production simulator + Dashboard
└── Sims/              # Independent simulators
```

### After (New)
```
src/
├── core/              # Domain logic (adapters, models, engine)
├── dashboard/         # Unified dashboard (single source of truth)
├── modules/           # Input methods (excel-templates, etc.)
├── TECBooks/          # Legacy (still functional, for reference)
└── MxRep/             # Still functional (educational module)
```

## Key Improvements

### 1. Separation of Concerns
- **Input adapters** transform data from any source
- **Canonical business model** is the single source of truth
- **Financial engine** performs all calculations
- **Dashboard** only handles visualization

### 2. New Primary Feature: Project Evaluation
The dashboard now leads with **Project Evaluation** metrics:
- IRR (Internal Rate of Return)
- NPV (Net Present Value)
- ROI (Return on Investment)
- Break-even Analysis
- Cashflow Projections

### 3. Multiple Input Sources
Users can now generate dashboards from:
- Excel templates (Manufacturing Mexico, more coming)
- In-app questionnaire (existing survey)
- MxRep production simulator
- Future: Direct API integration

### 4. Template System
Excel templates can be:
- Customized per business type and country
- Enhanced with real-time data (inflation, PTU, etc.)
- Downloaded, filled offline, and uploaded

## Using the New System

### For Users

#### Option 1: Excel Template (Recommended)
1. Go to `/templates`
2. Download a template for your business type
3. Fill it out with your data
4. Upload at `/templates/upload`
5. View your dashboard at `/dashboard`

#### Option 2: In-App Questionnaire
1. Go to `/tecbooks/survey` (legacy route still works)
2. Complete the questionnaire
3. Generate Excel and upload
4. View dashboard

#### Option 3: MxRep (For Students)
1. Complete MxRep production simulation
2. Access dashboard from MxRep panel
3. View production + financial metrics

### For Developers

#### Adding a New Input Source

```javascript
// 1. Create adapter
// src/core/adapters/MyAdapter.js
export function adaptMyDataToBusinessModel(myData) {
  const model = createEmptyBusinessModel()
  // Transform myData into canonical model
  model.metadata.name = myData.businessName
  // ... more transformations
  return model
}

// 2. Create UI module
// src/modules/my-source/MyInput.jsx
import { adaptMyDataToBusinessModel } from '@/core/adapters/MyAdapter'

function MyInput() {
  const handleSubmit = (data) => {
    const businessModel = adaptMyDataToBusinessModel(data)
    navigate('/dashboard', { state: { businessModel } })
  }
  // ... UI code
}

// 3. Add route
// src/App.jsx
<Route path="/my-source/*" element={<MyInput />} />
```

#### Adding New Calculations

```javascript
// 1. Add to engine
// src/core/engine/myCalculations.js
export function calculateMyMetric(businessModel) {
  // Perform calculations
  return result
}

// 2. Compute in context
// src/core/store/DashboardContext.jsx
const myMetric = useMemo(() => {
  return calculateMyMetric(model)
}, [model])

// 3. Use in views
// src/dashboard/views/MyView/MyView.jsx
const { myMetric } = useDashboard()
```

#### Adding Dashboard Views

```javascript
// 1. Create view
// src/dashboard/views/MyView/MyView.jsx
import { useDashboard } from '@/core/store'

function MyView() {
  const { businessModel, projectMetrics } = useDashboard()
  return <div>...</div>
}

// 2. Add route
// src/dashboard/Router.jsx
<Route path="my-view" element={<MyView />} />

// 3. Add to sidebar
// src/dashboard/components/Sidebar.jsx
<div onClick={() => navigate('my-view')}>
  <Icon />
  <span>My View</span>
</div>
```

## Canonical Business Model

All data must be transformed into this structure:

```javascript
{
  metadata: {
    name: string,
    type: string,           // 'manufacturing', 'services', etc.
    country: string,        // 'mexico', 'usa', etc.
    startDate: Date,
    currency: string,
    source: string,         // 'excel', 'survey', 'mxrep'
  },
  timeline: {
    months: string[],       // ['January 2024', 'February 2024', ...]
    totalMonths: number,
  },
  revenue: {
    productsAndServices: {}, // { 'product1': [values...] }
    totals: number[],        // Total per month
  },
  costs: {
    salaries: {},
    fixedCosts: {},
    variableCosts: {},
    totals: number[],
  },
  expenses: {
    salaries: {},
    expenses: {},
    totals: number[],
  },
  project: {
    initialInvestment: number,
    discountRate: number,
    projectLifetime: number,
  },
  assets: {
    depreciation: number[],
    // ... asset details
  },
  accounts: {
    receivables: {},
    payables: {},
  },
  additionalData: {
    // Module-specific data (e.g., MxRep production metrics)
  }
}
```

## Migration Checklist

- [x] Core domain logic (models, adapters, engine)
- [x] Unified dashboard with routing
- [x] Project Evaluation view (IRR, NPV, ROI, Break-even)
- [x] Basic Overview, Statements, Forecasts views
- [x] Excel template system
- [x] Template selector and upload UI
- [x] Homepage updates
- [x] App routing updates
- [x] Documentation

## What's Next?

### Immediate
- [ ] Add your manufacturing Excel template to `public/templates/`
- [ ] Test the full flow: template download → fill → upload → dashboard
- [ ] Implement real-time data fetching for Mexico template

### Short-term
- [ ] Complete Overview view with charts
- [ ] Full Balance Sheet and Cash Flow Statement
- [ ] Forecasting UI
- [ ] Survey adapter integration

### Long-term
- [ ] More templates (Services, Retail, other countries)
- [ ] MxRep database integration
- [ ] Export functionality (PDF, Excel)
- [ ] Scenario analysis
- [ ] Multi-project comparison

## Notes

- **Legacy code preserved**: TECBooks and MxRep folders remain functional
- **No breaking changes**: All existing routes still work
- **Gradual migration**: Can migrate features incrementally
- **Team-ready**: Clear structure for multiple developers

## Questions?

See `ARCHITECTURE.md` for detailed architecture documentation.
