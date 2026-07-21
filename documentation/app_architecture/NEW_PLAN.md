New plan for project folder structure.

- intentionally separate MXREP module completely (views, component, everything)
- treat as separate app, apart from our new global architecture
    - move mxrep components back into its own folder
    - move mxrep pages back into its own folder
    - move mxrep utils back into its own folder
    - move mxrep apis back into its own folder

If you remember how the MXREP module/folder was before, try to restore it as
such. Don't even worry about wiring it into the app or making it available,
it will simply be dead code for now.

- Flatten the dashboard folder into the new architecture
    - move all the dashboard/views into pages, in a new pages/dashboard folder and move all its *_View, Landings, etc., into that folder. They should not own their own folder either, like we want 'pages/dashboard/Finance_KPI_View.jsx', not 'pages/dashboard/Finance_KPIs/Finance_KPI_View.jsx'. this also because the components that that folder own currently in 'dashboard/Finance_KPIs/ like Gauges, Graphs, etc., will be moved into components'
    - rename the Finance_KPIs/Finance_KPI_View to just Finances
    - rename FinancialStatements to Accounting. (following the pattern, should become 'pages/dashboard/Accounting.jsx')
    - the 'pages/dashboard folder should also have the index and layout file, renamed 'Index.jsx' and 'Layout.jsx', following more common conventions as well. 

    - for dashboard components, same example (currently dashboard/components), move them into components/dashboard
    - for Gauges/Graphs/Margins folder, move them into components/dashboard/finances
    - make a root level contexts folder and move the dashboards/contexts into it
    - with that we should no longer have a 'dashboard' folder

- Flatten the 'core' folder as well
    - move the store/dashboardContext into the global contexts folder
    - move the models into a project-root level models/dashboard folder
    - move the current engine/ files into utils/dashboard
    - move the api/premises.js into api/dashboard/premises.js
    - move the adapters folder into utils/adapters

This way we should no longer have a project root level 'core' folder either.

There is still much more to clean up but don't go ahead of me. Make these migrations and we'll continue from there.