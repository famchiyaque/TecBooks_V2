import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

/**
 * Manufacturing Cashflow Chart with Lifetime Selector
 * Shows inflows, outflows, and cumulative cashflow for selected project lifetime
 */
function ManufacturingCashflowChart({ cashflows, bestLifetime, maxYears = 10 }) {
  const [selectedLifetime, setSelectedLifetime] = useState(bestLifetime?.lifetime || maxYears);

  if (!cashflows) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cashflow Projections
          </Typography>
          <Typography color="text.secondary">
            No cashflow data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { inflows, outflows, netCashflows, cumulativeCashflows } = cashflows;

  // Prepare data for selected lifetime (+ Year 0)
  const relevantYears = Array.from({ length: selectedLifetime + 1 }, (_, i) => `Year ${i}`);
  const relevantInflows = inflows.slice(0, selectedLifetime + 1);
  const relevantOutflows = outflows.slice(0, selectedLifetime + 1);
  const relevantNetCashflows = netCashflows.slice(0, selectedLifetime + 1);
  const relevantCumulative = cumulativeCashflows.slice(0, selectedLifetime + 1);

  // Calculate stats
  const totalInflows = relevantInflows.reduce((sum, val) => sum + val, 0);
  const totalOutflows = relevantOutflows.reduce((sum, val) => sum + val, 0);
  const totalNet = relevantNetCashflows.reduce((sum, val) => sum + val, 0);
  const maxNet = Math.max(...relevantNetCashflows);
  const minNet = Math.min(...relevantNetCashflows);
  const finalCumulative = relevantCumulative[relevantCumulative.length - 1];

  const options = {
    chart: {
      height: 450,
    },
    title: {
      text: 'Cashflow Projection',
      align: 'left',
    },
    subtitle: {
      text: `${selectedLifetime}-Year Analysis | Total Net Cashflow: $${totalNet.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      align: 'left',
    },
    xAxis: {
      categories: relevantYears,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: 'Cashflow ($)',
        },
        labels: {
          formatter: function () {
            return '$' + (this.value / 1000).toFixed(0) + 'K';
          },
        },
      },
      {
        title: {
          text: 'Cumulative Cashflow ($)',
        },
        labels: {
          formatter: function () {
            return '$' + (this.value / 1000).toFixed(0) + 'K';
          },
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
      valuePrefix: '$',
      valueDecimals: 0,
    },
    plotOptions: {
      column: {
        borderRadius: 3,
        dataLabels: {
          enabled: false,
        },
      },
      line: {
        dataLabels: {
          enabled: false,
        },
        marker: {
          enabled: true,
          radius: 4,
        },
      },
    },
    series: [
      {
        name: 'Inflows',
        type: 'column',
        data: relevantInflows,
        color: '#4caf50',
        yAxis: 0,
      },
      {
        name: 'Outflows',
        type: 'column',
        data: relevantOutflows.map(val => -val), // Display as negative for visual clarity
        color: '#f44336',
        yAxis: 0,
      },
      {
        name: 'Net Cashflow',
        type: 'column',
        data: relevantNetCashflows,
        color: '#2196f3',
        yAxis: 0,
      },
      {
        name: 'Cumulative Cashflow',
        type: 'line',
        data: relevantCumulative,
        color: '#ff9800',
        yAxis: 1,
        lineWidth: 3,
        marker: {
          radius: 5,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        {/* Lifetime Selector */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Cashflow Projections
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="lifetime-selector-label">Project Lifetime</InputLabel>
            <Select
              labelId="lifetime-selector-label"
              id="lifetime-selector"
              value={selectedLifetime}
              label="Project Lifetime"
              onChange={(e) => setSelectedLifetime(e.target.value)}
            >
              {Array.from({ length: maxYears }, (_, i) => i + 1).map((year) => (
                <MenuItem key={year} value={year}>
                  {year} {year === 1 ? 'Year' : 'Years'}
                  {year === bestLifetime?.lifetime && ' ⭐ (Best)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <HighchartsReact highcharts={Highcharts} options={options} />

        {/* Stats */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Inflows
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#4caf50' }}>
              ${totalInflows.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Outflows
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#f44336' }}>
              ${totalOutflows.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Max Net
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              ${maxNet.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Min Net
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f' }}>
              ${minNet.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Final Position
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: finalCumulative >= 0 ? '#2e7d32' : '#d32f2f',
              }}
            >
              ${finalCumulative.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ManufacturingCashflowChart;
