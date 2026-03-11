/**
 * Dashboard Context
 * 
 * Unified state management for the dashboard.
 * Holds the canonical business model and computed metrics.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { validateBusinessModel } from '../models/BusinessModel.js';
import { calculateAllProjectMetrics } from '../engine/projectMetrics.js';
import { calculateAllStatements } from '../engine/statements.js';
import { prepareCashflowChartData, calculateCashflowStats } from '../engine/cashflow.js';
import { calculateManufacturingProjections } from '../engine/manufacturingProjections.js';
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
  const [demandProjectionMethod, setDemandProjectionMethod] = useState('inflation');
  
  // New: Forecasting methods state
  const [forecastingMethods, setForecastingMethods] = useState({
    demand: 'slr',
    boms: 'inflation',
    expenses: 'inflation',
    workforce: 'inflation',
  });

  // Update model when businessModel prop changes
  useEffect(() => {
    if (businessModel) {
      console.log('[DashboardContext] Updating model from prop:', businessModel.metadata);
      setModel(businessModel);
      
      // Initialize forecasting methods from model
      if (businessModel.demand?.ordersForecastMethod) {
        setForecastingMethods(prev => ({
          ...prev,
          demand: businessModel.demand.ordersForecastMethod,
        }));
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
            totalMonths
          )
        : [];
      
      // Recalculate workforce
      const workforceDerived = model.workforce?.employees
        ? deriveWorkforceSalaries(
            model.workforce.employees,
            totalMonths,
            model.premises?.inflationRate || 0.04
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

  // Update model with new final values
  useEffect(() => {
    if (finalValues && model) {
      console.log('[DashboardContext] Updating model with new final values');
      setModel(prev => ({
        ...prev,
        revenue: finalValues.revenue,
        costs: finalValues.costs,
        operatingExpenses: finalValues.operatingExpenses,
        // Also update derived values in the model
        bomsDerived: derivedValues?.bomsDerived,
        demandDerived: derivedValues?.demandDerived,
        workforceDerived: derivedValues?.workforceDerived,
        expensesDerived: derivedValues?.expensesDerived,
      }));
    }
  }, [finalValues]);

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

  // Compute manufacturing projections (for manufacturing businesses)
  const manufacturingProjections = useMemo(() => {
    if (!model) return null;
    
    // Check if this is a manufacturing business
    const isManufacturing = 
      model.metadata?.type?.toLowerCase() === 'manufacturing' ||
      model.metadata?.source === 'mexico-manufacturing-excel';
    
    if (!isManufacturing) {
      console.log('[DashboardContext] Not a manufacturing business, skipping projections');
      return null;
    }
    
    setLoading(true);
    
    try {
      console.log('[DashboardContext] Calculating manufacturing projections...');
      const projections = calculateManufacturingProjections(model, 10, demandProjectionMethod);
      setLoading(false);
      return projections;
    } catch (err) {
      console.error('[DashboardContext] Error calculating manufacturing projections:', err);
      setLoading(false);
      return null;
    }
  }, [model, demandProjectionMethod]);

  // Update business model
  const updateModel = (newModel) => {
    setModel(newModel);
  };

  // Update specific parts of the model
  const updateModelPartial = (updates) => {
    setModel(prev => ({
      ...prev,
      ...updates,
    }));
  };
  
  // Update forecasting method for a specific category
  const updateForecastingMethod = (category, method) => {
    console.log('[DashboardContext] Updating forecasting method:', category, '→', method);
    setForecastingMethods(prev => ({
      ...prev,
      [category]: method,
    }));
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
    manufacturingProjections,
    
    // Demand projection settings
    demandProjectionMethod,
    setDemandProjectionMethod,
    
    // Forecasting methods
    forecastingMethods,
    updateForecastingMethod,
    
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
