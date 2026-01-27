import React from 'react'
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material'
import { TrendingUp, TrendingDown, AttachMoney, Timeline, CheckCircle, Cancel } from '@mui/icons-material'

function MetricCard({ title, value, subtitle, icon: Icon, color, isPercentage = false, isCurrency = false }) {
  const displayValue = isPercentage 
    ? `${value.toFixed(2)}%` 
    : isCurrency 
    ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : value.toFixed(2)

  return (
    <Card sx={{ 
      height: '100%', 
      bgcolor: 'white',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      boxShadow: 2,
      '&:hover': { boxShadow: 3 }
    }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" component="div" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {title}
          </Typography>
          <Icon sx={{ color: color, fontSize: 24, opacity: 0.7 }} />
        </Box>
        
        <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: color, lineHeight: 1.2, mb: 0.5 }}>
          {displayValue}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

function MetricsCards({ metrics, lifetimeInfo = null, maxYears = null, trema = null }) {
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

  // Add lifetime info to subtitle - use maxYears if provided, otherwise lifetimeInfo
  const getSubtitle = (base) => {
    if (maxYears !== null) {
      return `${base} (${maxYears}-year projection)`;
    }
    if (lifetimeInfo) {
      return `${base} (${lifetimeInfo.lifetime}-year projection)`;
    }
    return base;
  };

  return (
    <Grid container spacing={2.5} sx={{ mb: 2 }}>
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
          color="#42a5f5"
          isPercentage={true}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          height: '100%', 
          bgcolor: 'white',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          boxShadow: 2,
          '&:hover': { boxShadow: 3 }
        }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" component="div" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Break-even
              </Typography>
              <Timeline sx={{ color: '#9c27b0', fontSize: 24, opacity: 0.7 }} />
            </Box>
            
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: '#9c27b0', lineHeight: 1.2, mb: 0.5 }}>
              {metrics.breakEven < 0 ? '∞' : metrics.breakEven.toFixed(1)}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
              {getBreakEvenText(metrics.breakEven)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default MetricsCards
