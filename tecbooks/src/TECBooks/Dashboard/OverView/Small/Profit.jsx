import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import { useExcel } from '../../Comps/ExcelContext'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

function Profit({ period }) {
  const { bizInfo, overviewData } = useExcel()
  const [change, setChange] = useState(0)
  const [color, setColor] = useState('gray')
  const [trendUp, setTrendUp] = useState(true)

  // Calculate total profit
  const totalProf = overviewData?.total?.reduce((prev, curr) => (prev || 0) + (curr || 0), 0) || 0

  // Format currency without dollar sign
  const formatToCurrency = (number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number).replace('$', '')
  }

  // Calculate percentage change between current and previous period
  useEffect(() => {
    if (!overviewData?.total || overviewData.total.length < 2) return

    const current = overviewData.total[0] || 0
    const previous = overviewData.total[1] || 0
    
    // Avoid division by zero
    const percentageChange = previous !== 0 
      ? ((current - previous) / Math.abs(previous)) * 100
      : current !== 0 
        ? (current > 0 ? Infinity : -Infinity)
        : 0

    const roundedChange = Math.round(percentageChange * 10) / 10 // Round to 1 decimal
    
    setChange(roundedChange)
    setTrendUp(roundedChange >= 0)
    setColor(roundedChange >= 0 ? '#4CAF50' : '#F44336') // Material green/red
  }, [overviewData])

  return (
    <>
      <div className='top-box-content'>
        <div className='top-box-metric'>
          <p style={{ display: 'inline' }}>$</p>
          <Typography variant="h4" style={{ display: 'inline' }}>
            {formatToCurrency(totalProf)}
          </Typography>
        </div>
        <div className='top-box-subtitle'>
          <Typography style={{ display: 'inline' }} variant="subtitle1">
            Lifetime Profit
          </Typography>
          <Typography 
            style={{ 
              display: 'inline', 
              color: color, 
              fontSize: '0.875rem',
              marginLeft: '8px'
            }}
          >
            {change >= 0 ? '+' : ''}{change}%
          </Typography>
        </div>
      </div>
      
      <div className='top-box-image'>
        {trendUp ? (
          <TrendingUpIcon sx={{ fontSize: '35px', color }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: '35px', color }} />
        )}
      </div>
    </>
  )
}

export default Profit