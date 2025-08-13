import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import { useExcel } from '../../Comps/ExcelContext'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function Sales({ period }) {
  const { bizInfo, overviewData } = useExcel()
  // console.log(overviewData)
  // console.log(period)
  
  const [change, setChange] = useState(0.0)
  const [color, setColor] = useState('gray')
  const [icon, setIcon] = useState(1)

  const totalRev = overviewData.revenue.reduce((prev, curr) => prev + curr, 0)

  const formatToCurrency = (number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number).replace('$', '');
  }

  const totalRevenue = formatToCurrency(totalRev)

  const icons = {
      1: <TrendingUpIcon className="sidebar-icon" />,
      2: <TrendingDownIcon className="sidebar-icon" />
  }

  useEffect(() => {
    // console.log(bizInfo)
    // console.log(bizInfo.months)
    // console.log(bizInfo)
    if (!bizInfo || !bizInfo.months || !overviewData.revenue) return;
  
    const months = [...bizInfo.months].reverse();  // avoid mutating original
    const revenues = [...overviewData.revenue].reverse(); // avoid mutating original
  
    // console.log("months", months)
    let last;
    let change = null;
  
    for (let i = 0; i < months.length; i++) {
      // console.log(months[i])
      if (period === months[i] && i > 0) {
        const current = revenues[i];
        const previous = revenues[i - 1];
        change = (((current - previous) / previous) * 100).toFixed(2) ; // percentage change
        break;
      }
    }
  
    if (change !== null) {
      // console.log(`% Change for ${period}:`, (change * 100).toFixed(1) + '%');
      setChange(change)
      if (change > 0) {
        setColor('green')
        setIcon(1)
      }
      else {
        setColor('red')
        setIcon(2)
      }
    }
  }, [overviewData, period]);

  return (
    <>
      <div className='top-box-content'>
        <div className='top-box-metric'>
          <p style={{ display: 'inline' }}>$</p>
          <Typography variant="h4"  style={{ display: 'inline' }}>{totalRevenue}</Typography>
        </div>
        <div className='top-box-subtitle'>
          <Typography style={{ display: 'inline' }} variant="subtitle1">Lifetime Sales</Typography>
          <p style={{ display: 'inline', color: color, fontSize: 'small' }}>&nbsp;&nbsp;+{change}%</p>

        </div>
      </div>
      
      <div className='top-box-image'>
        {icon == 1 ? (
          <TrendingUpIcon sx={{ fontSize: '35px', color: `${color}` }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: '35px', color: `${color}` }} />
        )}
        
      </div>
    </>
  )
}

export default Sales