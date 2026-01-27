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
 * NPV by Lifetime Chart
 * Shows how NPV changes across different project lifetimes
 */
function NPVByLifetimeChart({ metricsByLifetime, bestLifetime }) {
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

  // Prepare chart data
  const chartData = metricsByLifetime.map((metric) => ({
    lifetime: `${metric.lifetime}Y`,
    npv: Math.round(metric.npv),
    npvPerYear: Math.round(metric.npvPerYear),
    isBest: metric.lifetime === bestLifetime?.lifetime,
  }));

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
          borderRadius: '4px',
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
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          NPV by Project Lifetime
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Net Present Value across different project durations
        </Typography>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="lifetime" 
              label={{ value: 'Project Lifetime', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              label={{ value: 'NPV ($)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="npv" name="Net Present Value">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isBest ? '#4caf50' : entry.npv >= 0 ? '#2196f3' : '#f44336'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Green bar indicates optimal lifetime based on NPV/year ratio
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NPVByLifetimeChart;
