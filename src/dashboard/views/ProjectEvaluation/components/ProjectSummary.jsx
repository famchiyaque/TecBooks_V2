import React from 'react'
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material'
import { CheckCircle, Cancel, Warning } from '@mui/icons-material'

function ProjectSummary({ metrics, businessModel }) {
  const getProjectViability = () => {
    const { npv, irr, roi, breakEven } = metrics
    
    if (npv > 0 && irr > 10 && roi > 0 && breakEven > 0) {
      return {
        status: 'Viable',
        color: 'success',
        icon: CheckCircle,
        message: 'Project shows positive returns and is financially viable',
      }
    } else if (npv < 0 || irr < 5) {
      return {
        status: 'Not Viable',
        color: 'error',
        icon: Cancel,
        message: 'Project shows negative or insufficient returns',
      }
    } else {
      return {
        status: 'Marginal',
        color: 'warning',
        icon: Warning,
        message: 'Project shows marginal returns, further analysis recommended',
      }
    }
  }

  const viability = getProjectViability()
  const Icon = viability.icon

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Project Summary
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Project Viability
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color={viability.color} />
                <Chip 
                  label={viability.status} 
                  color={viability.color} 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {viability.message}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Initial Investment
              </Typography>
              <Typography variant="h6">
                ${metrics.initialInvestment.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Discount Rate
              </Typography>
              <Typography variant="h6">
                {metrics.discountRate}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Cashflow
              </Typography>
              <Typography variant="h6" sx={{ color: metrics.totalCashflow >= 0 ? '#2e7d32' : '#d32f2f' }}>
                ${metrics.totalCashflow.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Payback Period
              </Typography>
              <Typography variant="h6">
                {metrics.paybackPeriod < 0 ? 'Never' : `${metrics.paybackPeriod.toFixed(1)} periods`}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Profitability Index
              </Typography>
              <Typography variant="h6">
                {metrics.profitabilityIndex.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {metrics.profitabilityIndex > 1 ? 'Creates value' : 'Destroys value'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Business Information
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {businessModel.metadata.name}
          </Typography>
          <Typography variant="body2">
            <strong>Type:</strong> {businessModel.metadata.type}
          </Typography>
          <Typography variant="body2">
            <strong>Timeline:</strong> {businessModel.timeline.totalMonths} months
          </Typography>
          <Typography variant="body2">
            <strong>Source:</strong> {businessModel.metadata.source}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProjectSummary
