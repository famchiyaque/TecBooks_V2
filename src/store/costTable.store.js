import { configureStore, createSlice } from '@reduxjs/toolkit';
import { EditableTableSlice } from './EditableTableSlice.js';

// This table's editable-cells/custom-rows state - see EditableTableSlice for
// the reusable pattern (any other table just needs its own instance of this).
export const costTableEditsSlice = new EditableTableSlice('costTableEdits');

const costTableSlice = createSlice({
  name: 'costTable',
  initialState: {
    fileName: '',
    // Array of { id, name, category: 'direct'|'indirect'|'engineering'|'administrative', quantity, monthlySalary }
    employees: [],
    production: {
      yearZeroRecorded: false,
      purchaseOrders: {}, // { [year]: number } - "CO" in InputNovus' COs sheet
      qualityYield: {}, // { [year]: number }
      materialCostPerUnit: 0, // BOM "Costo de Materia Prima"
      salesPricePerUnit: 0, // BOM "Costo de venta"
    },
    premises: {
      indirectProductPercentage: {}, // { [year]: number } - Premisas "Porcentaje de costo indirecto del producto."
    },
  },
  reducers: {
    setFileName: (state, action) => { state.fileName = action.payload; },
    setEmployees: (state, action) => { state.employees = action.payload; },
    setProduction: (state, action) => { state.production = action.payload; },
    setPremises: (state, action) => { state.premises = action.payload; },
    resetCostTable: () => costTableSlice.getInitialState(),
  },
});

export const {
  setFileName, setEmployees, setProduction, setPremises, resetCostTable,
} = costTableSlice.actions;

// Create a store specifically for the cost table feature
export const createCostTableStore = () => configureStore({
  reducer: { costTable: costTableSlice.reducer, [costTableEditsSlice.name]: costTableEditsSlice.reducer },
});

// Selectors
export const selectFileName = (state) => state.costTable.fileName;
export const selectEmployees = (state) => state.costTable.employees;
export const selectProduction = (state) => state.costTable.production;
export const selectPremises = (state) => state.costTable.premises;

export const selectHasFile = (state) => state.costTable.fileName !== '';

export const selectHasYearZeroRecord = (state) => state.costTable.production.yearZeroRecorded === true;

export const selectHasEmployees = (state) => state.costTable.employees.length > 0;

export const selectAllEmployeesHaveQuantity = (state) => (
  state.costTable.employees.length > 0 &&
  state.costTable.employees.every((emp) => typeof emp.quantity === 'number' && emp.quantity > 0)
);
