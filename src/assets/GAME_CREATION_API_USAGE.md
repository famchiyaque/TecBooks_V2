# Dynamic Game Creation API - Usage Guide

## Overview
The game creation system now supports **dynamic configuration** where professors can customize all game settings in a single form submission.

---

## Frontend Flow: "Create Game" Page

### Step 1: Load Default Configs & Available Templates

```javascript
// When page loads, fetch defaults and templates
const [defaultConfigs, templates] = await Promise.all([
  fetch('/api/professor-panel/default-configs').then(r => r.json()),
  fetch('/api/professor-panel/templates').then(r => r.json())
]);

// defaultConfigs.data contains:
{
  ordersConfig: {
    ordersPerYear: 100000,
    ordersByMonth: {
      january: 0.08,
      february: 0.09,
      // ... all months
    }
  },
  premisesConfig: {
    year: 2024,
    economics: {
      closingExchangeRate: 16.66,
      nationalPrimeRate: 0.16,
      // ... all economic settings
    },
    tax: {
      nationalInflation: 0.043,
      // ... all tax settings
    },
    policies: {
      inventoryPercentage: 0.2,
      // ... all policy settings
    }
  },
  gameSettings: {
    initialCapital: 1000000,
    gameDurationMonths: 12
  }
}

// templates.data contains:
{
  boms: [...],
  employees: [...],
  assets: [...],
  materials: [...],
  processes: [...],
  expenses: [...],
  jobs: [...],
  skills: [...]
}
```

---

### Step 2: Display Form with Defaults

```jsx
// Example React form structure
<form onSubmit={handleCreateGame}>
  {/* Basic Info */}
  <input name="name" placeholder="Game Name" required />
  <textarea name="description" placeholder="Description" />
  <select name="groupId" required>
    {/* Load groups from /api/professor-panel/get-my-groups */}
  </select>

  {/* Game Settings */}
  <input 
    name="initialCapital" 
    type="number" 
    defaultValue={defaultConfigs.gameSettings.initialCapital}
  />
  <input 
    name="gameDurationMonths" 
    type="number" 
    defaultValue={defaultConfigs.gameSettings.gameDurationMonths}
  />

  {/* Orders Configuration */}
  <h3>Orders Configuration</h3>
  <input 
    name="ordersPerYear" 
    type="number"
    defaultValue={defaultConfigs.ordersConfig.ordersPerYear}
  />
  
  {/* Month percentages */}
  {Object.entries(defaultConfigs.ordersConfig.ordersByMonth).map(([month, value]) => (
    <input 
      key={month}
      name={`ordersByMonth.${month}`}
      type="number"
      step="0.01"
      defaultValue={value}
      label={month}
    />
  ))}

  {/* Premises Configuration (optional - can use defaults) */}
  <h3>Economic Settings (Optional)</h3>
  <details>
    <summary>Click to customize economic settings</summary>
    <input 
      name="premisesConfig.economics.closingExchangeRate"
      type="number"
      step="0.01"
      defaultValue={defaultConfigs.premisesConfig.economics.closingExchangeRate}
    />
    {/* ... more premises fields */}
  </details>

  {/* Available Templates Selection */}
  <h3>Select Available BOMs</h3>
  {templates.boms.map(bom => (
    <label key={bom._id}>
      <input 
        type="checkbox" 
        name="selectedBOMIds" 
        value={bom._id}
      />
      {bom.name} - ${bom.sellingPrice}
    </label>
  ))}

  <h3>Select Available Employees</h3>
  {templates.employees.map(emp => (
    <label key={emp._id}>
      <input 
        type="checkbox" 
        name="selectedEmployeeIds" 
        value={emp._id}
      />
      {emp.name} - ${emp.monthlySalary}/month
    </label>
  ))}

  {/* ... similar for assets, materials, processes, expenses */}

  <button type="submit">Create Game</button>
</form>
```

---

### Step 3: Submit Game Creation

```javascript
const handleCreateGame = async (formData) => {
  // Build the request body
  const gameData = {
    // Basic info
    name: formData.name,
    description: formData.description,
    groupId: formData.groupId,

    // Game settings
    initialCapital: formData.initialCapital || 1000000,
    gameDurationMonths: formData.gameDurationMonths || 12,

    // Orders configuration
    ordersConfig: {
      ordersPerYear: formData.ordersPerYear,
      ordersByMonth: {
        january: formData['ordersByMonth.january'],
        february: formData['ordersByMonth.february'],
        // ... all months
      }
    },

    // Premises configuration (optional)
    // Option 1: Use defaults (omit premisesConfig and premisesConfigId)
    // Option 2: Customize (include premisesConfig object)
    premisesConfig: {
      year: 2024,
      economics: {
        closingExchangeRate: formData['premisesConfig.economics.closingExchangeRate'],
        // ... other fields if customized
      },
      // ... tax and policies if customized
    },

    // Selected templates
    selectedBOMIds: formData.selectedBOMIds, // array of IDs
    selectedEmployeeIds: formData.selectedEmployeeIds,
    selectedAssetIds: formData.selectedAssetIds,
    selectedMaterialIds: formData.selectedMaterialIds,
    selectedProcessIds: formData.selectedProcessIds,
    selectedExpenseIds: formData.selectedExpenseIds,
  };

  // Send to backend
  const response = await fetch('/api/professor-panel/create-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData)
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Game created:', result.data);
    // result.data contains the created game with unique code
    alert(`Game created! Code: ${result.data.code}`);
    // Redirect to game management page
  }
};
```

---

## API Endpoints

### 1. Get Default Configurations
```
GET /api/professor-panel/default-configs
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ordersConfig": { ... },
    "premisesConfig": { ... },
    "gameSettings": {
      "initialCapital": 1000000,
      "gameDurationMonths": 12
    }
  }
}
```

---

### 2. Get Available Templates
```
GET /api/professor-panel/templates
```

**Response:**
```json
{
  "success": true,
  "data": {
    "boms": [...],
    "employees": [...],
    "assets": [...],
    "materials": [...],
    "processes": [...],
    "expenses": [...],
    "jobs": [...],
    "skills": [...]
  }
}
```

**Note:** Only returns templates accessible to the professor:
- System-level templates (scope: "system")
- Institution-level templates (scope: "institution")
- Professor's own templates (scope: "professor")

---

### 3. Create Game (Dynamic Configuration)
```
POST /api/professor-panel/create-game
```

**Request Body:**
```json
{
  "name": "Spring 2024 Manufacturing Game",
  "description": "Intro to production lines",
  "groupId": "group123",
  
  "initialCapital": 500000,
  "gameDurationMonths": 12,
  
  "ordersConfig": {
    "ordersPerYear": 150000,
    "ordersByMonth": {
      "january": 0.10,
      "february": 0.08,
      // ... all 12 months
    }
  },
  
  "premisesConfig": {
    "year": 2024,
    "economics": { ... },
    "tax": { ... },
    "policies": { ... }
  },
  
  "selectedBOMIds": ["bom1", "bom2"],
  "selectedEmployeeIds": ["emp1", "emp2", "emp3"],
  "selectedAssetIds": ["asset1", "asset2"],
  "selectedMaterialIds": ["mat1", "mat2"],
  "selectedProcessIds": ["proc1", "proc2"],
  "selectedExpenseIds": ["exp1"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Game created successfully",
  "data": {
    "_id": "game123",
    "name": "Spring 2024 Manufacturing Game",
    "code": "XY7K2M",
    "status": "draft",
    "groupId": "group123",
    "configurationId": "config123",
    // ... other fields
  }
}
```

---

## What Happens Behind the Scenes

When you call `POST /create-game`, the backend:

1. **Creates OrdersConfig** document with your custom values
2. **Creates PremisesConfig** document (or uses defaults if not provided)
3. **Creates GameConfiguration** document that references:
   - The OrdersConfig
   - The PremisesConfig
   - All selected template IDs
   - Game settings (initialCapital, gameDurationMonths)
4. **Creates Game** document that references the GameConfiguration
5. **Generates unique 6-character code** for students to join

---

## Simplified Options

### Option A: Use All Defaults
```json
{
  "name": "My Game",
  "groupId": "group123"
}
```
Backend will use all default values.

---

### Option B: Customize Orders Only
```json
{
  "name": "My Game",
  "groupId": "group123",
  "ordersConfig": {
    "ordersPerYear": 200000,
    "ordersByMonth": { ... }
  },
  "selectedBOMIds": ["bom1", "bom2"]
}
```
Backend will use default premises config.

---

### Option C: Full Customization
```json
{
  "name": "My Game",
  "groupId": "group123",
  "initialCapital": 750000,
  "gameDurationMonths": 6,
  "ordersConfig": { ... },
  "premisesConfig": { ... },
  "selectedBOMIds": [...],
  "selectedEmployeeIds": [...],
  // ... all templates
}
```

---

## Frontend Implementation Tips

### 1. Progressive Disclosure
Use collapsible sections for advanced settings:
```jsx
<details>
  <summary>Advanced Economic Settings (Optional)</summary>
  {/* Premises config fields */}
</details>
```

### 2. Smart Defaults
Pre-fill form with defaults from `/default-configs`:
```jsx
const [formData, setFormData] = useState(defaultConfigs);
```

### 3. Validation
Ensure month percentages sum to ~1.0:
```javascript
const validateMonthPercentages = (months) => {
  const sum = Object.values(months).reduce((a, b) => a + b, 0);
  return Math.abs(sum - 1.0) < 0.01; // Allow small rounding errors
};
```

### 4. Template Preview
Show template details when hovering/clicking:
```jsx
<Tooltip content={`${bom.name}: ${bom.processes.length} processes, $${bom.sellingPrice}`}>
  <Checkbox value={bom._id} />
</Tooltip>
```

---

## Summary

✅ **Single endpoint** for game creation with full customization
✅ **Default configs** endpoint for form initialization  
✅ **Templates endpoint** for available resources
✅ **Flexible** - use defaults or customize everything
✅ **Automatic** - backend creates all necessary documents
✅ **Unique codes** - generated automatically for student access

The system is now ready for your frontend implementation!

