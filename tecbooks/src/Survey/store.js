import { configureStore, createSlice } from '@reduxjs/toolkit';

const surveySlice = createSlice({
  name: 'survey',
  initialState: {
    currQuestion: 1,
    // General Business Info (Slide 1)
    nameBiz: '',
    // typeBiz: '',
    startMonth: '',
    // Revenue/Income Streams (Slide 2)
    revenue: [],
    // Employee Information (Slide 3)
    hasEmployees: null,
    numEmployees: null,
    empProduction: 0,
    empAdmin: 0,
    // Assets and Inventory Information (Slide 4)
    hasAssets: null,
    assets: [],
    hasInventory: null,
    hasRW: null,
    hasWIPG: null,
    hasFG: null,
    // inventory: [],
    // typeAssets: [],
    // Expenses (not including assets/salaries) (Slide 5)
    hasExpenses: true,
    expenses: [],
    // Debt and Passive Section (Slide 6)
    hasAccsPayable: null,
    accsPayable: [],
    hasAccsReceivable: null,
    accsReceivable: [],
    // Progress Bar
    progress: 10,
    progressBarFixed: false,
  },
  reducers: {
    setCurrQuestion: (state, action) => { state.currQuestion = action.payload; },
    setNameBiz: (state, action) => { state.nameBiz = action.payload; },
    // setTypeBiz: (state, action) => { state.typeBiz = action.payload; },
    setStartMonth: (state, action) => { state.startMonth = action.payload; },
    setRevenue: (state, action) => { state.revenue = action.payload; },
    setHasEmployees: (state, action) => { state.hasEmployees = action.payload; },
    setNumEmployees: (state, action) => { state.numEmployees = action.payload; },
    setEmpProduction: (state, action) => { state.empProduction = action.payload; },
    setEmpAdmin: (state, action) => { state.empAdmin = action.payload; },
    setHasAssets: (state, action) => { state.hasAssets = action.payload; },
    setHasInventory: (state, action) => { state.hasInventory = action.payload; },
    setHasRW: (state, action) => { state.hasRW = action.payload; },
    setHasWIPG: (state, action) => { state.hasWIPG = action.payload; },
    setHasFG: (state, action) => { state.hasFG = action.payload; },
    setAssets: (state, action) => { state.assets = action.payload; },
    setInventory: (state, action) => { state.inventory = action.payload },
    setTypeAssets: (state, action) => { state.typeAssets = action.payload; },
    setHasExpenses: (state, action) => { state.hasExpenses = action.payload },
    setExpenses: (state, action) => { state.expenses = action.payload; },
    setHasAccsPayable: (state, action) => { state.hasAccsPayable = action.payload; },
    setAccsPayable: (state, action) => { state.accsPayable = action.payload; },
    setHasAccsReceivable: (state, action) => { state.hasAccsReceivable = action.payload; },
    setAccsReceivable: (state, action) => { state.accsReceivable = action.payload; },
    setProgress: (state, action) => { state.progress = action.payload; },
    setProgressBarFixed: (state, action) => { state.progressBarFixed = action.payload; },
  },
});

// Export actions
export const {
  setCurrQuestion, setNameBiz, setTypeBiz, setStartMonth, setRevenue, 
  setHasEmployees, setNumEmployees, setEmpProduction, setEmpAdmin, setHasAssets,
  setHasInventory, setAssets, setHasRW, setHasWIPG, setHasFG,
  setInventory, setTypeAssets, setExpenses, setHasExpenses,
  setHasAccsPayable, setAccsPayable, setHasAccsReceivable, setAccsReceivable, 
  setProgress, setProgressBarFixed,
} = surveySlice.actions;

// Create a store specifically for the survey
export const createSurveyStore = () => configureStore({
  reducer: { survey: surveySlice.reducer },
});

// store/surveySelectors.js
export const selectTypeBizComplete = (state) => {
  return state.survey.nameBiz !== '' && state.survey.startMonth !== '';
};

export const selectRevenueComplete = (state) => {
  return state.survey.revenue.length > 0 && (
    state.survey.revenue.every(rev => 
      rev.status !== "" && rev.name !== ""
    )
  );
};

export const selectEmployeesComplete = (state) => {
  const ss = state.survey
  return ss.hasEmployees === false || 
  (ss.numEmployees !== null && ss.numEmployees > 0 && ss.empAdmin + ss.empProduction === ss.numEmployees);
};

export const selectAssetsComplete = (state) => {
  const ss = state.survey
  const hasChecked = ss.hasAssets !== null && ss.hasInventory !== null
  const assetsGood = ss.hasAssets === false || (ss.assets.length > 0 && (
    ss.assets.every(asset => 
      asset.status !== '' && asset.name !== '' && asset.dateAcq !== '' && (
        asset.status === "Owned" ? asset.type !== '' : true
      )
    )
  )) 
  
  const inventoryGood = ss.hasInventory !== null && (ss.hasInventory === false || (
    ss.hasRW === true || ss.hasWIPG === true || ss.hasFG === true
  ))
  // const inventoryGood = ss.hasInventory === false || ( ss.inventory.length > 0 && (
  //   ss.inventory.every(inv => 
  //     inv.type !== '' && inv.name !== ''
  //   )
  // ))

  return hasChecked && assetsGood && inventoryGood
};

export const selectExpensesComplete = (state) => {
  const ss = state.survey

  return ss.hasExpenses === false || (
    ss.expenses.length > 0 && ss.expenses.every(exp => exp.name !== '')
  )
};

export const selectAccountsComplete = (state) => {
  const ss = state.survey

  const accsPayableGood = ss.hasAccsPayable === false || (
    ss.hasAccsPayable === true && ss.accsPayable.length > 0 && ss.accsPayable.every(acc => acc.name !== '' && acc.date !== '')
  )

  const accsReceivableGood = ss.hasAccsReceivable === false || (
    ss.hasAccsReceivable === true && ss.accsReceivable.length > 0 && ss.accsReceivable.every(acc => acc.name !== '' && acc.date !== '')
  )

  return accsPayableGood && accsReceivableGood
};

export const selectAllSurveyInfo = (state) => {
  const ss = state.survey

  return {
    bizInfo: { name: ss.nameBiz, startMonth: ss.startMonth },    
    revenueInfo: { revenue: ss.revenue },
    employeesInfo: {
      hasEmployees: ss.hasEmployees,
      numEmployees: ss.numEmployees,
      empProduction: ss.empProduction,
      empAdmin: ss.empAdmin
    },
    assetsInfo: {
      hasAssets: ss.hasAssets,
      assets: ss.assets,
      hasInventory: ss.hasInventory,
      hasRW: ss.hasRW,
      hasWIPG: ss.hasWIPG,
      hasFG: ss.hasFG,
    },
    expensesInfo: { hasExpenses: ss.hasExpenses, expenses: ss.expenses },
    accountsInfo: {
      hasAccsPayable: ss.hasAccsPayable,
      accsPayable: ss.accsPayable,
      hasAccsReceivable: ss.hasAccsReceivable,
      accsReceivable: ss.accsReceivable
    }
  }
}

export const selectSurveyComplete = (state) => {
  return selectTypeBizComplete(state) && 
         selectRevenueComplete(state) && 
         selectEmployeesComplete(state) &&
         selectAssetsComplete(state) && 
         selectExpensesComplete(state) && 
         selectAccountsComplete(state)
}

export const selectProgress = (state) => {
  const slides = [
    selectTypeBizComplete, selectRevenueComplete, selectEmployeesComplete,
    selectAssetsComplete, selectExpensesComplete, selectAccountsComplete
  ]

  const total = slides.length

  const progress = slides.reduce((acc, fun) => {
    return acc += (fun(state) ? 1 : 0)
  }, 0)

  return Math.round((progress / total) * 100)
}