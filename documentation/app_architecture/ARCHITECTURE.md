# TecBooks V2 Architecture

## Overview

TecBooks V2 follows a clean architecture pattern with clear separation between input adapters, core business logic, calculation engines, and output layers (dashboard).

```
Input Sources → Adapters → Canonical Model → Engine → Dashboard
```

## Directory Structure

```
src/
├── core/                           # Core business logic (domain layer)
│   ├── adapters/                   # Input adapters
│   │   ├── ExcelAdapter.js         # Transforms Excel data
│   │   ├── SurveyAdapter.js        # Transforms survey data
│   │   ├── MxRepAdapter.js         # Transforms MxRep simulator data
│   │   └── index.js
│   │
│   ├── models/                     # Canonical Business Model
│   │   ├── BusinessModel.js        # Main model structure
│   │   ├── schemas.js              # Validation schemas
│   │   └── index.js
│   │
│   ├── engine/                     # Financial Calculation Engine
│   │   ├── projectMetrics.js       # IRR, NPV, ROI, Break-even
│   │   ├── statements.js           # Financial statements
│   │   ├── cashflow.js             # Cashflow calculations
│   │   ├── forecasts.js            # Forecasting algorithms
│   │   └── index.js
│   │
│   └── store/                      # State management
│       ├── DashboardContext.jsx    # Context for dashboard data
│       └── index.js
│
├── dashboard/                      # Unified Dashboard (output layer)
│   ├── components/                 # Shared dashboard components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SubHeader.jsx
│   │   ├── Period.jsx
│   │   └── Loader.jsx
│   │
│   ├── views/                      # Dashboard views
│   │   ├── ProjectEvaluation/     # PRIMARY - IRR, NPV, ROI, Break-even
│   │   ├── Overview/               # Business performance summary
│   │   ├── FinancialStatements/   # Income, Balance, Cashflow statements
│   │   └── Forecasts/              # Statistical forecasting
│   │
│   ├── MainLayout.jsx
│   ├── Router.jsx
│   └── index.jsx
│
├── modules/                        # Feature modules (input methods)
│   ├── excel-templates/            # Excel template management
│   │   ├── TemplateSelector.jsx   # Browse/download templates
│   │   ├── TemplateUpload.jsx     # Upload filled templates
│   │   ├── templates/              # Template files
│   │   └── index.jsx
│   │
│   └── [future modules]/
│
├── MxRep/                          # MxRep educational module
├── TECBooks/                       # Legacy TECBooks (reference)
├── Sims/                           # Independent simulators
└── HomePage/                       # Landing pages
```

## Data Flow

### 1. Input → Adapter → Canonical Model

```javascript
// Example: Excel Upload
const excelData = readExcelFile(file)
const businessModel = adaptExcelToBusinessModel(excelData)
```

All adapters transform their specific input format into the **Canonical Business Model**:

```javascript
{
  metadata: { name, type, country, startDate, source },
  timeline: { months, totalMonths },
  revenue: { productsAndServices, totals },
  costs: { salaries, fixedCosts, variableCosts, totals },
  expenses: { salaries, expenses, totals },
  project: { initialInvestment, discountRate, projectLifetime },
  assets: { property, machinery, depreciation },
  accounts: { receivables, payables },
  additionalData: { /* module-specific data */ }
}
```

### 2. Canonical Model → Engine → Computed Metrics

```javascript
// In DashboardContext
const projectMetrics = calculateAllProjectMetrics(businessModel)
const statements = calculateAllStatements(businessModel)
const cashflowData = prepareCashflowChartData(businessModel)
```

The engine layer computes:
- **Project Metrics**: IRR, NPV, ROI, Break-even, Payback Period, Profitability Index
- **Financial Statements**: Income Statement, Balance Sheet, Cash Flow Statement
- **Cashflow Analysis**: Net cashflow, cumulative cashflow, statistics
- **Forecasts**: Statistical projections using various methods

### 3. Computed Metrics → Dashboard Views

```javascript
// In any dashboard view
const { projectMetrics, statements, cashflowData, businessModel } = useDashboard()
```

Views consume the computed data from the DashboardContext and render visualizations.

## Key Principles

### 1. Single Source of Truth
The **Canonical Business Model** is the single source of truth. All data must be transformed into this format.

### 2. Separation of Concerns
- **Adapters**: Transform input → canonical model
- **Engine**: Canonical model → computed metrics
- **Dashboard**: Computed metrics → visualizations

### 3. Extensibility
- New input sources? Add an adapter
- New calculations? Add to engine
- New visualizations? Add a dashboard view

### 4. No Direct Dependencies
Dashboard views never directly access raw input data. They only consume the canonical model and computed metrics.

## Adding New Features

### Adding a New Input Source

1. Create adapter in `src/core/adapters/NewAdapter.js`
2. Transform input data to canonical model
3. Export from `src/core/adapters/index.js`
4. Create UI module in `src/modules/new-source/`
5. Add route in `App.jsx`

### Adding a New Dashboard View

1. Create view in `src/dashboard/views/NewView/`
2. Use `useDashboard()` hook to access data
3. Add route in `src/dashboard/Router.jsx`
4. Add sidebar entry in `src/dashboard/components/Sidebar.jsx`

### Adding New Calculations

1. Add function to appropriate engine file
2. Export from `src/core/engine/index.js`
3. Compute in `DashboardContext.jsx` (memoized)
4. Access in views via `useDashboard()`

## State Management

We use **Context API** for dashboard state management:

```javascript
<DashboardProvider businessModel={initialModel}>
  <DashboardRouter />
</DashboardProvider>
```

The DashboardContext:
- Holds the canonical business model
- Computes metrics (memoized for performance)
- Provides data to all dashboard views
- Handles loading and error states

## Testing Strategy

1. **Adapters**: Test transformation logic with sample inputs
2. **Engine**: Test calculations with known inputs/outputs
3. **Views**: Test rendering with mock data from context

## Future Enhancements

- [ ] Complete Overview view with charts and KPIs
- [ ] Implement full Balance Sheet and Cash Flow Statement
- [ ] Add forecasting UI with method selection
- [ ] Implement real-time data fetching for templates
- [ ] Add export functionality (PDF, Excel)
- [ ] Implement scenario analysis
- [ ] Add comparison between multiple projects
- [ ] Integrate MxRep database for production data
