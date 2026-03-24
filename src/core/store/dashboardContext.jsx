/**
 * Dashboard Context
 * 
 * Unified state management for the dashboard.
 * Holds the canonical business model and computed metrics.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { validateBusinessModel } from '../models/BusinessModel.js';
import { calculateAllProjectMetrics, calculateMetricsForAllLifetimes } from '../engine/projectMetrics.js';
import { calculateAllStatements } from '../engine/statements.js';
import { prepareCashflowChartData, calculateCashflowStats } from '../engine/cashflow.js';
import {
  deriveBOMSalesPriceAndCost,
  deriveDemand,
  deriveExpenses,
  deriveWorkforceSalaries,
  calculateRevenueFromDemandAndBOMs,
  calculateCostsFromDerivedValues,
  calculateOperatingExpenses,
} from '../engine/index.js';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export function DashboardProvider({ children, businessModel }) {
  const [model, setModel] = useState(businessModel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [demandProjectionMethod, setDemandProjectionMethod] = useState('sma');
  
  // New: Forecasting methods state
  const [forecastingMethods, setForecastingMethods] = useState({
    demand: 'sma',
    boms: 'inflation',
    expenses: 'inflation',
    workforce: 'inflation',
  });

  /** 0-based inclusive indices into timeline periods; null = full timeline */
  const [periodRange, setPeriodRange] = useState(null);

  // Update model when businessModel prop changes
  useEffect(() => {
    if (businessModel) {
      console.log('[DashboardContext] Updating model from prop:', businessModel.metadata);
      setModel(businessModel);
      
      // Initialize forecasting methods from model
      if (businessModel.demand?.ordersForecastMethod) {
        const d = businessModel.demand.ordersForecastMethod;
        setForecastingMethods(prev => ({
          ...prev,
          demand: d,
        }));
        setDemandProjectionMethod(d);
      }
    }
  }, [businessModel]);

  // Validate model when it changes
  useEffect(() => {
    if (model) {
      const validation = validateBusinessModel(model);
      if (!validation.valid) {
        console.warn('[DashboardContext] Model validation warnings:', validation.errors);
        setError(validation.errors.join(', '));
      } else {
        setError(null);
      }
    }
  }, [model]);

  // Recalculate derived values when forecasting methods change
  const derivedValues = useMemo(() => {
    if (!model || !model.timeline || !model.timeline.totalMonths) {
      return null;
    }
    
    try {
      console.log('[DashboardContext] Recalculating derived values with methods:', forecastingMethods);
      
      const totalMonths = model.timeline.totalMonths;
      
      // Recalculate BOMs
      const bomsDerived = model.boms?.products 
        ? deriveBOMSalesPriceAndCost(
            model.boms.products,
            totalMonths,
            model.premises?.inflationRate || 0.04,
            forecastingMethods.boms
          )
        : [];
      
      // Recalculate demand
      const demandDerived = model.demand
        ? deriveDemand(
            { ...model.demand, ordersForecastMethod: forecastingMethods.demand },
            totalMonths,
            model.boms?.products || [],
            model.premises?.forecastWindowSize || 5
          )
        : [];
      
      const workforceDerived = model.workforce
        ? deriveWorkforceSalaries(
            model.workforce,
            totalMonths,
            model.premises?.inflationRate || 0.04,
            forecastingMethods.workforce || 'inflation'
          )
        : { directLaborSalaries: [], indirectLaborSalaries: [], engineeringSalaries: [], administrativeSalaries: [] };
      
      // Recalculate expenses
      const expensesDerived = model.expenses
        ? deriveExpenses(
            model.expenses.fixedExpenses || [],
            model.expenses.variableExpenses || [],
            forecastingMethods.expenses,
            totalMonths,
            model.premises?.inflationRate || 0.04,
            null
          )
        : [];
      
      return {
        bomsDerived,
        demandDerived,
        workforceDerived,
        expensesDerived,
      };
    } catch (err) {
      console.error('[DashboardContext] Error calculating derived values:', err);
      return null;
    }
  }, [model, forecastingMethods]);

  // Recalculate final values when derived values change
  const finalValues = useMemo(() => {
    if (!derivedValues || !model || !model.timeline) {
      return null;
    }
    
    try {
      console.log('[DashboardContext] Recalculating final values from derived values');
      
      const revenue = calculateRevenueFromDemandAndBOMs(
        derivedValues.demandDerived,
        derivedValues.bomsDerived,
        model.timeline.periods
      );
      
      const costs = calculateCostsFromDerivedValues(
        derivedValues.bomsDerived,
        derivedValues.demandDerived,
        derivedValues.workforceDerived,
        model.assetsDerived,
        model.timeline.periods
      );
      
      const operatingExpenses = calculateOperatingExpenses(
        derivedValues.workforceDerived,
        derivedValues.expensesDerived,
        model.timeline.periods
      );
      
      return {
        revenue,
        costs,
        operatingExpenses,
      };
    } catch (err) {
      console.error('[DashboardContext] Error calculating final values:', err);
      return null;
    }
  }, [derivedValues, model]);

  // Compute project metrics (memoized for performance)
  const projectMetrics = useMemo(() => {
    if (!model) return null;
    
    try {
      return calculateAllProjectMetrics(model);
    } catch (err) {
      console.error('[DashboardContext] Error calculating project metrics:', err);
      return null;
    }
  }, [model]);

  // Compute financial statements (memoized)
  const statements = useMemo(() => {
    if (!model) return null;
    
    try {
      return calculateAllStatements(model);
    } catch (err) {
      console.error('[DashboardContext] Error calculating statements:', err);
      return null;
    }
  }, [model]);

  // Compute cashflow data (memoized)
  const cashflowData = useMemo(() => {
    if (!model) return null;
    
    try {
      const chartData = prepareCashflowChartData(model);
      const stats = calculateCashflowStats(model);
      return { chartData, stats };
    } catch (err) {
      console.error('[DashboardContext] Error calculating cashflow:', err);
      return null;
    }
  }, [model]);

  /** NPV/IRR/cashflow chart data from CBM.cashFlows (any business type with monthly flows) */
  const projectEvaluationProjections = useMemo(() => {
    if (!model?.cashFlows?.inflows?.length) return null;
    try {
      return calculateMetricsForAllLifetimes(model, 10);
    } catch (err) {
      console.error('[DashboardContext] Error calculating project evaluation projections:', err);
      return null;
    }
  }, [model]);

  const persistModelToSession = (nextModel) => {
    try {
      sessionStorage.setItem('currentBusinessModel', JSON.stringify(nextModel));
    } catch (e) {
      console.warn('[DashboardContext] Could not persist model to sessionStorage', e);
    }
  };

  // Update business model
  const updateModel = (newModel) => {
    setModel(newModel);
    persistModelToSession(newModel);
  };

  // Update specific parts of the model
  const updateModelPartial = (updates) => {
    setModel(prev => {
      const next = { ...prev, ...updates };
      persistModelToSession(next);
      return next;
    });
  };

  /** Slice a per-period array using periodRange (0-based indices inclusive) */
  const getFilteredData = (dataArray) => {
    if (!Array.isArray(dataArray)) return dataArray;
    if (!periodRange || periodRange.start == null || periodRange.end == null) return dataArray;
    const start = Math.max(0, periodRange.start);
    const end = Math.min(dataArray.length - 1, periodRange.end);
    if (start > end) return [];
    return dataArray.slice(start, end + 1);
  };
  
  // Update forecasting method for a specific category
  const updateForecastingMethod = (category, method) => {
    console.log('[DashboardContext] Updating forecasting method:', category, '→', method);
    setForecastingMethods(prev => ({
      ...prev,
      [category]: method,
    }));
    if (category === 'demand') {
      setDemandProjectionMethod(method);
      setModel(prev => {
        if (!prev?.demand) return prev;
        const next = {
          ...prev,
          demand: { ...prev.demand, ordersForecastMethod: method },
        };
        persistModelToSession(next);
        return next;
      });
    }
  };

  const value = {
    // Core data
    businessModel: model,
    loading,
    error,
    
    // Computed metrics
    projectMetrics,
    statements,
    cashflowData,
    projectEvaluationProjections,
    /** @deprecated use projectEvaluationProjections */
    manufacturingProjections: projectEvaluationProjections,
    
    // Recalculated slices (adapter model is unchanged; use these for UI that reacts to forecast method)
    recalculatedDerived: derivedValues,
    recalculatedFinal: finalValues,
    
    // Demand projection settings
    demandProjectionMethod,
    setDemandProjectionMethod,
    
    // Forecasting methods
    forecastingMethods,
    updateForecastingMethod,
    
    // Period filtering (subheader) — indices into timeline.periods / month arrays
    periodRange,
    setPeriodRange,
    getFilteredData,
    
    // Actions
    updateModel,
    updateModelPartial,
    setLoading,
    setError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
