import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Tooltip, 
  IconButton,
  Typography,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

/**
 * Demand Projection Method Selector
 * Allows user to select the method for projecting future demand
 */
function DemandProjectionMethodSelector({ value, onChange }) {
  const methods = [
    {
      value: 'inflation',
      label: 'Inflation-Based Growth',
      description: 'Demand grows at the inflation rate each year. Simple and commonly used.',
      enabled: true,
    },
    {
      value: 'linear',
      label: 'Linear Growth',
      description: 'Demand increases by a fixed amount each year. Good for steady markets.',
      enabled: false,
    },
    {
      value: 'statistical',
      label: 'Statistical Time Series',
      description: 'Advanced forecasting using historical patterns and trends.',
      enabled: false,
    },
  ];

  const selectedMethod = methods.find((m) => m.value === value);

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="demand-projection-method-label">
          Demand Projection
        </InputLabel>
        <Select
          labelId="demand-projection-method-label"
          id="demand-projection-method"
          value={value}
          label="Demand Projection"
          onChange={(e) => onChange(e.target.value)}
        >
          {methods.map((method) => (
            <MenuItem 
              key={method.value} 
              value={method.value}
              disabled={!method.enabled}
            >
              {method.label}
              {!method.enabled && ' (Coming Soon)'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip 
        title={
          <Box>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              {selectedMethod?.label}
            </Typography>
            <Typography variant="caption">
              {selectedMethod?.description}
            </Typography>
          </Box>
        }
        arrow
      >
        <IconButton size="small">
          <InfoOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default DemandProjectionMethodSelector;
