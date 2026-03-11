import React from 'react'
import { useDashboard } from '@/core/store'
import { Typography, Card, CardContent, Grid, Box, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material'
import { Settings, TrendingUp, Assessment } from '@mui/icons-material'
import '@/styles/general.css'

/**
 * Overview View
 * 
 * Shows business configuration including premises (financial assumptions)
 * and forecasting method controls
 */
function Overview_View() {
  const { businessModel, forecastingMethods, updateForecastingMethod, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className='view-child'>
        <div className='loader'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='view-child'>
        <Typography color="error">Error: {error}</Typography>
      </div>
    )
  }

  const { premises, boms, demand, expenses, workforce } = businessModel || {}

  // Format percentage for display
  const formatPercent = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className='view-child'>
      <div className='view-title'>
        <Typography variant='h4' sx={{ fontWeight: '600' }}>
          Business Configuration
        </Typography>
        <Typography variant='subtitle1' color="text.secondary">
          Financial assumptions and forecasting settings
        </Typography>
      </div>

      <Grid container spacing={3}>
        {/* Premises Card */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Financial Premises
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Discount Rate (TREMA)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {formatPercent(premises?.trema)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Inflation Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatPercent(premises?.inflationRate)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Interest Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatPercent(premises?.interestRate)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Business Income Tax
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatPercent(premises?.businessIncomeTax)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    CETES Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatPercent(premises?.cetes)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Reward Margin
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatPercent(premises?.rewardMargin)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Quality Improvement Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatPercent(premises?.qualityImprovementRate)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Utilization Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatPercent(premises?.utilizationRate)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                These rates are defined by your input data and influence all financial projections.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Forecasting Methods Card */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Forecasting Methods
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Adjust how future values are projected. Changes will automatically recalculate all derived metrics.
              </Typography>

              <Grid container spacing={3}>
                {/* Demand Forecasting */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Demand Forecasting Method</InputLabel>
                    <Select
                      value={forecastingMethods?.demand || 'slr'}
                      label="Demand Forecasting Method"
                      onChange={(e) => updateForecastingMethod('demand', e.target.value)}
                    >
                      {demand?.availableForecastingMethods?.map(method => (
                        <MenuItem key={method} value={method}>
                          {getMethodLabel(method)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {getMethodDescription(forecastingMethods?.demand)}
                  </Typography>
                </Grid>

                {/* BOMs Forecasting */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>BOMs Price Forecasting Method</InputLabel>
                    <Select
                      value={forecastingMethods?.boms || 'inflation'}
                      label="BOMs Price Forecasting Method"
                      onChange={(e) => updateForecastingMethod('boms', e.target.value)}
                    >
                      {boms?.availableForecastingMethods?.map(method => (
                        <MenuItem key={method} value={method}>
                          {getMethodLabel(method)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {getMethodDescription(forecastingMethods?.boms)}
                  </Typography>
                </Grid>

                {/* Workforce Forecasting */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Workforce Salary Forecasting</InputLabel>
                    <Select
                      value={forecastingMethods?.workforce || 'inflation'}
                      label="Workforce Salary Forecasting"
                      onChange={(e) => updateForecastingMethod('workforce', e.target.value)}
                    >
                      {workforce?.availableForecastingMethods?.map(method => (
                        <MenuItem key={method} value={method}>
                          {getMethodLabel(method)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {getMethodDescription(forecastingMethods?.workforce)}
                  </Typography>
                </Grid>

                {/* Expenses Forecasting */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Expenses Forecasting Method</InputLabel>
                    <Select
                      value={forecastingMethods?.expenses || 'inflation'}
                      label="Expenses Forecasting Method"
                      onChange={(e) => updateForecastingMethod('expenses', e.target.value)}
                    >
                      {expenses?.availableForecastingMethods?.map(method => (
                        <MenuItem key={method} value={method}>
                          {getMethodLabel(method)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {getMethodDescription(forecastingMethods?.expenses)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Info Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Business Information
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Business Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {businessModel?.metadata?.name || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {businessModel?.metadata?.type || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Country
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {businessModel?.metadata?.country?.toUpperCase() || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Timeline
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {businessModel?.timeline?.totalMonths || 0} months
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

// Helper function to get method labels
function getMethodLabel(method) {
  const labels = {
    'slr': 'Simple Linear Regression',
    'dlr': 'Double Linear Regression',
    'sma': 'Simple Moving Average',
    'dma': 'Double Moving Average',
    'ses': 'Simple Exponential Smoothing',
    'des': 'Double Exponential Smoothing',
    'winters': 'Winters Method',
    'inflation': 'Inflation-Based',
    'static': 'Static (No Change)',
    'production': 'Production-Based',
    'log': 'Logarithmic',
  };
  return labels[method] || method.toUpperCase();
}

// Helper function to get method descriptions
function getMethodDescription(method) {
  const descriptions = {
    'slr': 'Projects values using a linear trend from historical data',
    'sma': 'Uses average of recent periods for forecasting',
    'ses': 'Weighs recent data more heavily with exponential decay',
    'winters': 'Accounts for trends and seasonal patterns',
    'inflation': 'Adjusts values based on the inflation rate',
    'static': 'Keeps values constant over time',
    'production': 'Scales with production volume changes',
  };
  return descriptions[method] || 'Forecast future values using this method';
}

export default Overview_View
