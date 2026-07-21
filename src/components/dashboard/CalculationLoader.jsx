import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { 
  TrendingUp, 
  Calculate, 
  Timeline, 
  AccountBalance 
} from '@mui/icons-material';

/**
 * Calculation Loader
 * Professional loading screen for complex financial calculations
 */
function CalculationLoader({ message = 'Calculating projections...' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Calculate, text: 'Calculating production capacity...' },
    { icon: Timeline, text: 'Projecting demand and work orders...' },
    { icon: AccountBalance, text: 'Computing cashflows and depreciation...' },
    { icon: TrendingUp, text: 'Analyzing NPV optimization...' },
  ];

  useEffect(() => {
    // Cycle through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      sx={{ px: 3 }}
    >
      {/* Main spinner */}
      <Box position="relative" display="inline-flex" mb={4}>
        <CircularProgress size={80} thickness={4} />
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CurrentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
      </Box>

      {/* Main message */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        {message}
      </Typography>

      {/* Current step */}
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: 3, textAlign: 'center' }}
      >
        {steps[currentStep].text}
      </Typography>

      {/* Progress bar */}
      <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      {/* Additional info */}
      <Typography variant="caption" color="text.secondary">
        This may take a few seconds...
      </Typography>
    </Box>
  );
}

export default CalculationLoader;
