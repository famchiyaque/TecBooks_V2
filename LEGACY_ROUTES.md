# Legacy Routes Documentation

## Overview

The old TECBooks and MxRep implementations are now accessible via `/legacy/` routes. This allows the team to reference the original implementations while building the new architecture.

## Available Legacy Routes

### TECBooks Legacy
- **Path**: `/legacy/tecbooks/*`
- **Description**: Original TECBooks implementation with survey and dashboard
- **Routes**:
  - `/legacy/tecbooks/survey` - Original business questionnaire
  - `/legacy/tecbooks/template-upload` - Original template upload
  - `/legacy/tecbooks/dashboard` - Original dashboard

### MxRep Legacy
- **Path**: `/legacy/mxrep/*`
- **Description**: Original MxRep implementation with auth and panels
- **Routes**:
  - `/legacy/mxrep/auth/login` - MxRep login
  - `/legacy/mxrep/auth/register` - MxRep registration
  - `/legacy/mxrep/student-panel` - Student panel
  - `/legacy/mxrep/professor-panel` - Professor panel
  - `/legacy/mxrep/admin-panel` - Admin panel
  - `/legacy/mxrep/dashboard/:gameId/:runId` - Production dashboard

## Backward Compatibility

For backward compatibility, the old `/tecbooks/*` route now redirects to `/legacy/tecbooks/*`.

```javascript
// In App.jsx
<Route path="/tecbooks/*" element={<Navigate to="/legacy/tecbooks" replace />} />
```

This ensures that any existing bookmarks or links continue to work.

## New vs Legacy

### New Routes (Recommended)
- `/dashboard/*` - Unified dashboard with project evaluation
- `/templates/*` - Template selector and upload
- `/mxrep/*` - MxRep educational module (still active, not legacy)

### Legacy Routes (Reference Only)
- `/legacy/tecbooks/*` - Old TECBooks implementation
- `/legacy/mxrep/*` - Old MxRep implementation

## When to Use Legacy Routes

### Use Legacy Routes When:
- ✅ Referencing old implementation for comparison
- ✅ Testing backward compatibility
- ✅ Showing clients the evolution of the product
- ✅ Debugging issues by comparing old vs new behavior

### Don't Use Legacy Routes For:
- ❌ New features or development
- ❌ Production user flows
- ❌ Documentation or tutorials
- ❌ Marketing materials

## Migration Strategy

The legacy routes will remain available during the transition period. The plan is:

1. **Phase 1** (Current): Both old and new systems available
2. **Phase 2** (After testing): New system becomes default, legacy available for reference
3. **Phase 3** (After full migration): Legacy routes deprecated with warning messages
4. **Phase 4** (Future): Legacy routes removed

## Code Organization

### Legacy Code Location
```
src/
├── TECBooks/          # Legacy TECBooks (accessible via /legacy/tecbooks)
│   ├── Survey/
│   ├── Dashboard/
│   └── TempUpload/
│
└── MxRep/             # Still active, but also accessible via /legacy/mxrep
    ├── Forms/
    ├── Views/
    └── Routing/
```

### New Code Location
```
src/
├── core/              # New domain logic
├── dashboard/         # New unified dashboard
└── modules/           # New input modules
```

## Notes

- Legacy code is **not being maintained** - bug fixes go to new system only
- Legacy routes are **read-only** - no new features will be added
- Legacy implementations remain **fully functional** for reference
- MxRep is still active at `/mxrep/*` but also accessible at `/legacy/mxrep/*` for consistency

## For Developers

When working on the new system and need to reference the old implementation:

1. Navigate to `/legacy/tecbooks` or `/legacy/mxrep` in your browser
2. Compare behavior with new implementation
3. Extract any useful patterns or logic
4. Implement in the new architecture following the adapter pattern

## Questions?

See `ARCHITECTURE.md` for the new system architecture or `MIGRATION_GUIDE.md` for migration instructions.
