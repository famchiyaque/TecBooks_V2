import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import Chart from 'chart.js/auto';

/**
 * Cashflow Chart using Chart.js (matching the investment simulator)
 * Shows annual cashflow bars and cumulative cashflow line
 */
function CashflowChartJS({ cashflows, bestLifetime, maxYears, onMaxYearsChange, businessName = 'Business' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!cashflows || !canvasRef.current) return;

    const { inflows, outflows } = cashflows;
    
    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const year = new Date().getFullYear();
    const labels = Array.from({ length: maxYears }, (_, i) => (year + i).toString());

    // Calculate annual cashflows (matching simulator logic)
    const annualCashflows = inflows.slice(0, maxYears).map((inflow, index) => {
      return inflow - outflows[index];
    });

    // Calculate cumulative cashflow
    const cumulativeCashFlow = annualCashflows.reduce((acc, cashflow, index) => {
      if (index === 0) {
        acc.push(cashflow);
      } else {
        acc.push(acc[index - 1] + cashflow);
      }
      return acc;
    }, []);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Cumulative Cash Flow',
          data: cumulativeCashFlow,
          borderColor: 'rgb(33, 150, 243)',
          backgroundColor: 'transparent',
          fill: false,
          type: 'line',
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: 'y1',
        },
        {
          label: 'Annual Cash Flow',
          data: annualCashflows,
          backgroundColor: annualCashflows.map((cashflow) => 
            cashflow >= 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)'
          ),
          borderColor: annualCashflows.map((cashflow) => 
            cashflow >= 0 ? 'rgb(76, 175, 80)' : 'rgb(244, 67, 54)'
          ),
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
            }
          },
          title: {
            display: true,
            text: `${businessName} - Cash Flow Projection`,
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(context.parsed.y);
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Annual Cash Flow ($)',
              font: {
                size: 12,
              }
            },
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000).toFixed(0) + 'K';
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Cumulative Cash Flow ($)',
              font: {
                size: 12,
              }
            },
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000).toFixed(0) + 'K';
              }
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [maxYears, cashflows, businessName]);

  if (!cashflows) {
    return (
      <Card>
        <CardContent>
          <Typography>No cashflow data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const handleDecrease = () => {
    if (maxYears > 1) {
      onMaxYearsChange(maxYears - 1);
    }
  };

  const handleIncrease = () => {
    if (maxYears < 15) {
      onMaxYearsChange(maxYears + 1);
    }
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle2" fontWeight={600}>
            Cashflow Analysis
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              size="small" 
              onClick={handleDecrease}
              disabled={maxYears <= 1}
              sx={{ 
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: 'grey.200' },
                '&.Mui-disabled': { bgcolor: 'grey.50' }
              }}
            >
              <Remove fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center', fontWeight: 600 }}>
              {maxYears} {maxYears === 1 ? 'Year' : 'Years'}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleIncrease}
              disabled={maxYears >= 15}
              sx={{ 
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: 'grey.200' },
                '&.Mui-disabled': { bgcolor: 'grey.50' }
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <div style={{ position: 'relative', height: '400px', minWidth: '600px', width: '100%' }}>
          <canvas ref={canvasRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}

export default CashflowChartJS;
