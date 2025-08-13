import React from 'react'
import Typography from '@mui/material/Typography'
import { useExcel } from '../../Comps/ExcelContext'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { calculateWorkingCapital } from '../Calcs/smalls'

function Capital() {
  const { overviewData } = useExcel()
  
  // Calculate current and previous working capital
  const getWorkingCapitalData = () => {
    if (!overviewData) return { current: 0, previous: 0 }
    
    const current = calculateWorkingCapital(overviewData)
    const previous = calculateWorkingCapital({
      ...overviewData,
      revenue: overviewData.revenue.slice(1),
      costs: overviewData.costs.slice(1),
      expenses: overviewData.expenses.slice(1)
    })
    
    return { current, previous }
  }

  const { current, previous } = getWorkingCapitalData()
  const change = current - previous
  const changePercentage = previous !== 0 ? (change / previous * 100) : 0

  // Formatting functions
  const formatToCurrency = (number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(number)
  }

  // Determine styling based on change
  const changeColor = change >= 0 ? '#4caf50' : '#f44336' // Green or red
  const TrendIcon = change >= 0 ? TrendingUpIcon : TrendingDownIcon
  const changePrefix = change >= 0 ? '+' : ''

  return (
    <>
      <div className='top-box-content'>
        <div className='top-box-metric'>
          <Typography variant="h4">
            {formatToCurrency(current)}
          </Typography>
        </div>
        <div className='top-box-subtitle'>
          <Typography variant="subtitle1" style={{ display: 'inline' }}>
            Working Capital
          </Typography>
          <Typography 
            style={{ 
              display: 'inline', 
              color: changeColor,
              marginLeft: '8px',
              fontSize: '0.875rem'
            }}
          >
            {changePrefix}{formatToCurrency(change)} 
            {/* ({changePercentage.toFixed(1)}%) */}
          </Typography>
        </div>
      </div>
      
      <div className='top-box-image'>
        <TrendIcon sx={{ 
          fontSize: '35px', 
          color: changeColor 
        }} />
      </div>
    </>
  )
}

export default Capital