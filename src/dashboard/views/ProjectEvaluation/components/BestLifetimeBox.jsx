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
        mb: 3, 
        bgcolor: isPositive ? 'success.light' : 'warning.light',
        border: 2,
        borderColor: isPositive ? 'success.main' : 'warning.main',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Star sx={{ color: isPositive ? 'success.dark' : 'warning.dark' }} />
          <Typography variant="h6" fontWeight="bold">
            Recommended Project Lifetime
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Chip
            label={`${lifetime} Years`}
            color={isPositive ? 'success' : 'warning'}
            size="large"
            sx={{ fontSize: '1.1rem', fontWeight: 'bold', py: 2.5, px: 1 }}
          />
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total NPV
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${npv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              NPV per Year
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${npvPerYear.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
          {reason || 'This lifetime offers the best NPV per year ratio, balancing total returns with time invested.'}
        </Typography>

        {!isPositive && (
          <Typography 
            variant="body2" 
            color="warning.dark" 
            fontWeight="bold" 
            sx={{ mt: 2 }}
          >
            ⚠️ Note: Even the optimal lifetime shows negative NPV. Consider revising your business model or extending the analysis period.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default BestLifetimeBox;
