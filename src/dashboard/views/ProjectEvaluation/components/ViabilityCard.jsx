import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

/**
 * Viability Card
 * Shows if project passes TREMA test (IRR > TREMA)
 */
function ViabilityCard({ irr, trema }) {
  const tremaPercent = trema * 100; // Convert decimal to percentage
  const isViable = irr > tremaPercent;

  return (
    <Card sx={{ 
      height: '100%', 
      bgcolor: 'white',
      border: '1px solid',
      borderColor: isViable ? 'success.light' : 'error.light',
      borderRadius: 3,
      boxShadow: 2,
      '&:hover': { boxShadow: 3 }
    }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
            Viability
          </Typography>
          {isViable ? (
            <CheckCircle sx={{ color: 'success.main', fontSize: 16, opacity: 0.8 }} />
          ) : (
            <Cancel sx={{ color: 'error.main', fontSize: 16, opacity: 0.8 }} />
          )}
        </Box>
        
        <Chip
          label={isViable ? 'PASSES' : 'FAILS'}
          color={isViable ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 700, fontSize: '0.875rem', height: 28 }}
        />
        
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mt: 0.25 }}>
          {isViable 
            ? `IRR (${irr.toFixed(1)}%) > TREMA (${tremaPercent.toFixed(1)}%)`
            : `IRR (${irr.toFixed(1)}%) ≤ TREMA (${tremaPercent.toFixed(1)}%)`
          }
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ViabilityCard;
