# TecBooks V2 Folder Structure

```text
TecBooks_V2/
├── .github/
│   └── workflows/                         # CI/CD workflows
├── documentation/
│   ├── app_architecture/                  # Architecture and API guides
│   ├── business_logic/                    # Calculation and migration notes
│   ├── developers/                        # Developer setup guides
│   └── legacy/                            # Legacy route documentation
├── public/
│   ├── imgs/                              # Public image assets
│   ├── templates/                         # Downloadable templates
│   └── test-forecast*.csv                 # Forecast test data
├── src/
│   ├── api/                               # External data access
│   │   ├── mxrep/                         # MxRep API clients and services
│   │   └── templates/
│   │       ├── dataFetchers/              # Template data requests
│   │       └── template-builders/         # Excel template generation
│   ├── assets/                            # Bundled static assets
│   ├── components/                        # Reusable visual components
│   │   ├── custom-excel/
│   │   │   └── AssetInputs/               # Custom Excel asset fields
│   │   ├── faq/                           # FAQ cards, sidebar, and content
│   │   ├── global/                        # App-wide headers and utilities
│   │   ├── GlobalNavigation/              # Main application navigation
│   │   ├── home/
│   │   │   └── sections/                  # Homepage content sections
│   │   ├── mxrep/
│   │   │   ├── contexts/                  # MxRep auth and simulation contexts
│   │   │   ├── dashboard/                 # Shared MxRep dashboard widgets
│   │   │   ├── forms/
│   │   │   │   ├── Auth/
│   │   │   │   ├── Panels/
│   │   │   │   │   ├── Admin/
│   │   │   │   │   ├── Professor/
│   │   │   │   │   └── Student/
│   │   │   │   └── Registry/
│   │   │   │       └── Modals/
│   │   │   ├── general/                   # Shared MxRep layout components
│   │   │   └── panels/
│   │   │       ├── Admin/
│   │   │       ├── Common/
│   │   │       ├── Professor/
│   │   │       ├── Student/
│   │   │       └── SuperAdmin/
│   │   ├── sims/
│   │   │   ├── forecasts/                 # Forecast simulator UI
│   │   │   └── investments/
│   │   │       └── Inputs/                # Investment simulator inputs
│   │   └── ui/                            # Low-level UI primitives
│   ├── core/                              # Canonical business-data pipeline
│   │   ├── adapters/                      # Input to normalized-model adapters
│   │   ├── api/                           # Core domain API helpers
│   │   ├── engine/                        # Financial calculation engine
│   │   ├── models/                        # Canonical business models
│   │   └── store/                         # Dashboard context and state
│   ├── dashboard/                         # Unified visual output
│   │   ├── components/                    # Dashboard layout components
│   │   ├── contexts/                      # Legacy simulation compatibility
│   │   └── views/
│   │       ├── Finance_KPIs/
│   │       │   ├── Gauges/
│   │       │   ├── Graphs/
│   │       │   └── Margins/
│   │       ├── FinancialStatements/
│   │       ├── Forecasts/
│   │       ├── OverView/
│   │       └── ProjectEvaluation/
│   │           └── components/
│   ├── hooks/
│   │   ├── mxrep/                         # MxRep data hooks
│   │   └── sims/
│   │       └── forecasts/                 # Forecast state hooks
│   ├── lib/
│   │   └── utils.js                       # Shared UI utility functions
│   ├── pages/                             # Route-level screens and layouts
│   │   ├── faq/
│   │   │   └── data/                      # FAQ content
│   │   ├── home/                          # Homepage route
│   │   ├── modules/
│   │   │   ├── custom-excel/              # Custom Excel route
│   │   │   └── templates/                 # Template selection/upload routes
│   │   ├── mxrep/
│   │   │   ├── dashboard/
│   │   │   │   ├── Finance_KPIs/
│   │   │   │   │   ├── Gauges/
│   │   │   │   │   ├── Graphs/
│   │   │   │   │   └── Margins/
│   │   │   │   ├── Financial_Statement/
│   │   │   │   │   ├── Buttons/
│   │   │   │   │   ├── Calcs/
│   │   │   │   │   └── Pages/
│   │   │   │   ├── Forecasts/
│   │   │   │   │   ├── Calcs/
│   │   │   │   │   ├── Leaderboard/
│   │   │   │   │   └── Options/
│   │   │   │   ├── Investments/
│   │   │   │   │   ├── GraphComponents/
│   │   │   │   │   ├── HistoryComps/
│   │   │   │   │   ├── Macros/
│   │   │   │   │   └── ResultsComps/
│   │   │   │   ├── OverView/
│   │   │   │   │   ├── Calcs/
│   │   │   │   │   ├── Middle/
│   │   │   │   │   └── Small/
│   │   │   │   └── Productivity/
│   │   │   │       ├── Calcs/
│   │   │   │       ├── Graphs/
│   │   │   │       ├── Inventory/
│   │   │   │       └── KPIS/
│   │   │   ├── panel/
│   │   │   │   ├── Admin/
│   │   │   │   │   ├── Professor/
│   │   │   │   │   └── Student/
│   │   │   │   ├── Professor/
│   │   │   │   │   ├── Class/
│   │   │   │   │   ├── Game/
│   │   │   │   │   └── Group/
│   │   │   │   ├── Student/
│   │   │   │   │   └── Game/
│   │   │   │   └── SuperAdmin/
│   │   │   │       └── Institution/
│   │   │   └── routing/
│   │   │       ├── Auth/
│   │   │       ├── Institution/
│   │   │       │   ├── Dashboard/
│   │   │       │   └── Panel/
│   │   │       │       ├── Admin/
│   │   │       │       ├── Professor/
│   │   │       │       └── Student/
│   │   │       ├── Registry/
│   │   │       └── SuperAdmin/
│   │   └── sims/
│   │       ├── forecasts/                  # Forecast simulator route
│   │       └── investments/                # Investment simulator route
│   ├── store/
│   │   ├── customExcelStore.js
│   │   ├── forecastStore.js
│   │   └── projEvalStore.js
│   ├── styles/                             # Feature and global stylesheets
│   ├── utils/
│   │   ├── faq/                            # FAQ routing helpers
│   │   ├── mxrep/
│   │   │   ├── configs/                    # MxRep navigation configuration
│   │   │   └── schemas/                    # MxRep form schemas
│   │   ├── sims/
│   │   │   ├── forecasts/
│   │   │   │   └── __tests__/              # Forecast utility tests
│   │   │   └── investments/
│   │   └── workingCapital.js               # Shared financial helper
│   ├── App.jsx                             # Top-level routes and providers
│   ├── main.jsx                            # React entry point
│   ├── App.css
│   └── index.css
├── components.json                         # UI component configuration
├── Dockerfile
├── Dockerfile.dev
├── eslint.config.js
├── index.html
├── jsconfig.json                           # Source alias configuration
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

`node_modules/`, build output, environment files, and other generated or private files are intentionally omitted.
