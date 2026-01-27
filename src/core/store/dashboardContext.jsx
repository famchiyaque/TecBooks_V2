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

  // Update model when businessModel prop changes
  useEffect(() => {
    if (businessModel) {
      console.log('[DashboardContext] Updating model from prop:', businessModel.metadata);
      setModel(businessModel);
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
