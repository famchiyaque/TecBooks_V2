# Quick Start Guide

## 🚀 Getting Started with the New Architecture

### Step 1: Add Your Manufacturing Template

Place your manufacturing Excel template in:
```
TecBooks_V2/public/templates/manufacturing-mexico-template.xlsx
```

The template should have these sheets:
- Overview
- Revenue
- Costs
- Expenses
- Accounts (optional)

### Step 2: Test the Flow

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Navigate to the homepage**
   - Go to `http://localhost:5173/home`
   - Scroll to the "Project Evaluation & Financial Dashboard" section

3. **Browse templates**
   - Click "Browse Templates"
   - You should see the Manufacturing Mexico template

4. **Download and fill template**
   - Download the template
   - Fill it with sample data
   - Save the file

5. **Upload template**
   - Click "Upload Template" or go to `/templates/upload`
   - Drag and drop your filled template
   - Click "Generate Dashboard"

6. **View dashboard**
   - You should be redirected to `/dashboard`
   - See Project Evaluation metrics (IRR, NPV, ROI, Break-even)
   - Navigate through other sections using the sidebar

### Step 3: Verify Core Functionality

#### Test the Canonical Model
```javascript
// In browser console
import { createEmptyBusinessModel } from './core/models/BusinessModel'
const model = createEmptyBusinessModel()
console.log(model)
```

#### Test the Engine
```javascript
import { calculateNPV, calculateIRR } from './core/engine/projectMetrics'
const npv = calculateNPV(10000, [3000, 4000, 5000], 10)
const irr = calculateIRR(10000, [3000, 4000, 5000])
console.log({ npv, irr })
```

#### Test the Adapter
```javascript
import { adaptExcelToBusinessModel } from './core/adapters/ExcelAdapter'
// Load your Excel data
const businessModel = adaptExcelToBusinessModel(excelData)
console.log(businessModel)
```

## 🔧 Common Issues & Solutions

### Issue: Template not showing
**Solution**: Make sure the file is named exactly `manufacturing-mexico-template.xlsx` and is in the `public/templates/` folder.

### Issue: Dashboard shows "No data"
**Solution**: Check browser console for errors. The Excel adapter might not be parsing your template correctly. Verify sheet names and structure.

### Issue: Calculations seem wrong
**Solution**: Check the canonical model in the DashboardContext. Use React DevTools to inspect the context values.

### Issue: Routing not working
**Solution**: Make sure you're using the correct paths:
- `/dashboard` - Main dashboard
- `/templates` - Template selector
- `/templates/upload` - Upload page

## 📝 Quick Reference

### Key Routes
- `/home` - Homepage
- `/templates` - Browse templates
- `/templates/upload` - Upload template
- `/dashboard` - Main dashboard
- `/dashboard/project-evaluation` - Project metrics
- `/dashboard/overview` - Overview
- `/dashboard/statements` - Financial statements
- `/dashboard/forecasts` - Forecasts

### Key Files
- `src/core/models/BusinessModel.js` - Data structure
- `src/core/adapters/ExcelAdapter.js` - Excel transformation
- `src/core/engine/projectMetrics.js` - IRR, NPV, ROI calculations
- `src/dashboard/views/ProjectEvaluation/` - Main dashboard view
- `src/modules/excel-templates/` - Template UI

### Key Hooks
```javascript
// In any dashboard view
const { 
  businessModel,      // Canonical data
  projectMetrics,     // IRR, NPV, ROI, etc.
  statements,         // Income, Balance, Cashflow
  cashflowData,       // Cashflow charts and stats
  loading,            // Loading state
  error              // Error state
} = useDashboard()
```

## 🎯 Next Development Tasks

### Priority 1: Core Functionality
- [ ] Test with real manufacturing data
- [ ] Fix any calculation bugs
- [ ] Ensure all adapters work correctly

### Priority 2: UI Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Improve mobile responsiveness
- [ ] Add tooltips and help text

### Priority 3: Features
- [ ] Complete Overview view
- [ ] Complete Balance Sheet
- [ ] Complete Cash Flow Statement
- [ ] Add forecasting UI
- [ ] Implement export functionality

### Priority 4: Templates
- [ ] Add real-time data fetching (inflation, PTU)
- [ ] Create Services Mexico template
- [ ] Create Retail Mexico template
- [ ] Add template versioning

## 🐛 Debugging Tips

### Enable Verbose Logging
The adapters and engine already have console.log statements. Check browser console for:
- `[ExcelAdapter]` - Excel processing
- `[DashboardContext]` - Context updates
- `[TemplateUpload]` - Upload process

### React DevTools
1. Install React DevTools extension
2. Inspect `DashboardProvider` component
3. Check context values
4. Verify memoization is working

### Check Canonical Model
In any dashboard view:
```javascript
const { businessModel } = useDashboard()
console.log(JSON.stringify(businessModel, null, 2))
```

### Verify Calculations
```javascript
const { projectMetrics } = useDashboard()
console.log('IRR:', projectMetrics.irr)
console.log('NPV:', projectMetrics.npv)
console.log('ROI:', projectMetrics.roi)
console.log('Break-even:', projectMetrics.breakEven)
```

## 📚 Learning Path

1. **Day 1**: Understand the canonical business model
2. **Day 2**: Explore the adapters (how data gets in)
3. **Day 3**: Study the engine (how calculations work)
4. **Day 4**: Examine the dashboard views (how data is displayed)
5. **Day 5**: Try adding a new calculation or view

## 🤝 Contributing

### Adding a New Calculation
1. Add function to appropriate engine file
2. Export from `src/core/engine/index.js`
3. Compute in `DashboardContext.jsx`
4. Use in your view

### Adding a New View
1. Create folder in `src/dashboard/views/`
2. Create `YourView_View.jsx`
3. Use `useDashboard()` hook
4. Add route in `Router.jsx`
5. Add sidebar entry

### Adding a New Input Source
1. Create adapter in `src/core/adapters/`
2. Transform to canonical model
3. Create UI in `src/modules/`
4. Add route in `App.jsx`

## 🎉 Success!

If you can:
1. ✅ Upload an Excel template
2. ✅ See it transform to canonical model
3. ✅ View IRR, NPV, ROI on dashboard
4. ✅ Navigate between dashboard sections

Then the architecture is working! 🎊

---

**Questions?** Check `ARCHITECTURE.md` or `MIGRATION_GUIDE.md`
