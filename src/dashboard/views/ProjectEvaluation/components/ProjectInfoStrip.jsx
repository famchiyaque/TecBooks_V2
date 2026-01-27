import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { CheckCircle, Cancel, Star } from '@mui/icons-material';

/**
 * Project Info Strip
 * Combined strip showing Viability (left) and Recommended Lifetime (right)
 */
function ProjectInfoStrip({ bestLifetime, irr, trema }) {
  const tremaPercent = trema * 100;
  const isViable = irr > tremaPercent;
  const { lifetime, npv, npvPerYear } = bestLifetime;
  const isPositive = npv >= 0;

  return (
    <Card 
      sx={{ 
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: 2,
        mb: 2,
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Grid container spacing={2}>
          {/* Viability - Left Half */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1.5}>
                {isViable ? (
                  <CheckCircle sx={{ color: '#66bb6a', fontSize: 18 }} />
                ) : (
                  <Cancel sx={{ color: '#ef5350', fontSize: 18 }} />
                )}
                <Typography variant="body2" fontWeight={600}>
                  Project Viability:
                </Typography>
                <Chip
                  label={isViable ? 'PASSES' : 'FAILS'}
                  sx={{ 
                    bgcolor: isViable ? '#66bb6a' : '#ef5350',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}
                  size="small"
                />
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {isViable 
                  ? `IRR (${irr.toFixed(1)}%) > TREMA (${tremaPercent.toFixed(1)}%)`
                  : `IRR (${irr.toFixed(1)}%) ≤ TREMA (${tremaPercent.toFixed(1)}%)`
                }
              </Typography>
            </Box>
          </Grid>

          {/* Recommended Lifetime - Right Half */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1.5}>
                <Star sx={{ color: isPositive ? '#66bb6a' : '#ffa726', fontSize: 18 }} />
                <Typography variant="body2" fontWeight={600}>
                  Recommended Lifetime:
                </Typography>
                <Chip
                  label={`${lifetime} Years`}
                  sx={{ 
                    bgcolor: isPositive ? '#66bb6a' : '#ffa726',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}
                  size="small"
                />
              </Box>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  NPV: ${npv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  NPV/Year: ${npvPerYear.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProjectInfoStrip;
