import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * NPV by Lifetime Chart (Horizontal)
 * Shows how NPV changes across different project lifetimes
 */
function NPVByLifetimeChart({ metricsByLifetime, bestLifetime, maxYears }) {
  if (!metricsByLifetime || metricsByLifetime.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            NPV by Project Lifetime
          </Typography>
          <Typography color="text.secondary">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Filter to only show up to maxYears
  const filteredMetrics = metricsByLifetime.slice(0, maxYears);
  
  // Prepare chart data
  const chartData = filteredMetrics.map((metric) => ({
    lifetime: `${metric.lifetime}Y`,
    npv: Math.round(metric.npv),
    npvPerYear: Math.round(metric.npvPerYear),
    isBest: metric.lifetime === bestLifetime?.lifetime,
  }));

  // Debug: Log chart data to help diagnose issues
  console.log('[NPVByLifetimeChart] Chart data:', chartData);
  console.log('[NPVByLifetimeChart] NPV values:', chartData.map(d => d.npv));
  
  // Calculate domain for XAxis to handle negative values properly
  // Use 'auto' to let Recharts handle it, which works well with negative values
  const xAxisDomain = ['auto', 'auto'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {data.lifetime} Lifetime
        </Typography>
        <Typography variant="body2" color="primary">
          NPV: ${data.npv.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          NPV/Year: ${data.npvPerYear.toLocaleString()}
        </Typography>
        {data.isBest && (
          <Typography variant="body2" color="success.main" fontWeight="bold">
            ★ Best Lifetime
          </Typography>
        )}
      </div>
    );
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          NPV by Lifetime
        </Typography>
        
        <ResponsiveContainer width="100%" height={400} minWidth={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number"
              domain={xAxisDomain}
              tickFormatter={(value) => {
                if (value === 0) return '$0';
                return `$${(value / 1000).toFixed(0)}K`;
              }}
              allowDataOverflow={false}
            />
            <YAxis 
              type="category"
              dataKey="lifetime"
              width={60}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="npv" 
              name="Net Present Value" 
              radius={[0, 8, 8, 0]}
              minPointSize={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isBest ? '#66bb6a' : entry.npv >= 0 ? '#42a5f5' : '#ef5350'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.7rem' }}>
          Green = optimal lifetime
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NPVByLifetimeChart;
