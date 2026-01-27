import React from 'react'
import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import { TrendingUp, TrendingDown, AttachMoney, Timeline } from '@mui/icons-material'

function MetricCard({ title, value, subtitle, icon: Icon, color, isPercentage = false, isCurrency = false }) {
  const displayValue = isPercentage 
    ? `${value.toFixed(2)}%` 
    : isCurrency 
    ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value.toFixed(2)

  return (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, border: `2px solid ${color}30` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Icon sx={{ color: color, fontSize: 32 }} />
        </Box>
        
        <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {displayValue}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

function MetricsCards({ metrics, lifetimeInfo = null }) {
  const getBreakEvenText = (breakEven) => {
    if (breakEven < 0) return 'Never breaks even'
    if (breakEven < 1) return 'Less than 1 year'
    return `${breakEven.toFixed(1)} years`
  }

  const getIRRColor = (irr) => {
    if (irr >= 15) return '#2e7d32' // Green
    if (irr >= 10) return '#ed6c02' // Orange
    return '#d32f2f' // Red
  }

  const getNPVColor = (npv) => {
    if (npv > 0) return '#2e7d32' // Green
    if (npv === 0) return '#ed6c02' // Orange
    return '#d32f2f' // Red
  }

  // Add lifetime info to subtitle if provided
  const getSubtitle = (base) => {
    if (lifetimeInfo) {
      return `${base} (${lifetimeInfo.lifetime}-year projection)`;
    }
    return base;
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="NPV"
          value={metrics.npv}
          subtitle={getSubtitle("Net Present Value")}
          icon={AttachMoney}
          color={getNPVColor(metrics.npv)}
          isCurrency={true}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="IRR"
          value={metrics.irr}
          subtitle={getSubtitle("Internal Rate of Return")}
          icon={TrendingUp}
          color={getIRRColor(metrics.irr)}
          isPercentage={true}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="ROI"
          value={metrics.roi}
          subtitle={getSubtitle("Return on Investment")}
          icon={TrendingUp}
          color="#1976d2"
          isPercentage={true}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #9c27b015 0%, #9c27b005 100%)', border: '2px solid #9c27b030' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="div" color="text.secondary" sx={{ fontWeight: 500 }}>
                Break-even
              </Typography>
              <Timeline sx={{ color: '#9c27b0', fontSize: 32 }} />
            </Box>
            
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: '#9c27b0', mb: 1 }}>
              {metrics.breakEven < 0 ? '∞' : metrics.breakEven.toFixed(1)}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {getBreakEvenText(metrics.breakEven)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default MetricsCards
