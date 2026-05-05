import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, Star } from '@mui/icons-material';

/**
 * Best Lifetime Info Box
 * Displays information about the optimal project lifetime
 */
function BestLifetimeBox({ bestLifetime }) {
  if (!bestLifetime) {
    return (
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Optimal Project Lifetime
          </Typography>
          <Typography color="text.secondary">
            No lifetime data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { lifetime, npv, npvPerYear, reason } = bestLifetime;
  const isPositive = npv >= 0;

  return (
    <Card 
      sx={{ 
        bgcolor: 'white',
        border: '1px solid',
        borderColor: isPositive ? 'success.light' : 'warning.light',
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
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
          
          <Box display="flex" alignItems="center" gap={3}>
            <Box display="flex" alignItems="baseline" gap={0.5}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                NPV:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                ${npv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </Typography>
            </Box>

            <Box display="flex" alignItems="baseline" gap={0.5}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                NPV/Year:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                ${npvPerYear.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BestLifetimeBox;
