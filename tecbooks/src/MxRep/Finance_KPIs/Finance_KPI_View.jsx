import React from 'react'
import '../../styles/financial_health.css'
import { useOutletContext } from 'react-router-dom'
import Sales from './Margins/Sales'
import Operating from './Margins/Operating'
import Gross from './Margins/Gross'
// import Waterfall from './Graphs/Waterfall'
import ROS from './Margins/ROS'
import Debt from './Gauges/Debt'
import Current from './Gauges/Current'
import Quick from './Gauges/Quick'
import Capital from './Margins/Capital'
import AssetTurnover from './Graphs/AssetBullet'
import InventoryTurnover from './Graphs/InventoryBullet'
import { Typography } from '@mui/material'
import { useSimData } from '../SimDataContext'
import Loader from '../Novus Components/Loader'
import { useNavigate } from 'react-router-dom'

function Financial_Health_View() {
  const { period, year } = useOutletContext()
  const { isLoading, error } = useSimData()
  const navigate = useNavigate()

  const months = [
    "January", "Februrary", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ]
  let timePeriod
  if (period == 12) timePeriod = year
  else timePeriod = months[period]

  if (error) navigate('/novus-dashboard')
  if (isLoading) return <Loader />

  return (
    <div className='finances-view'>
      <div className='left-finance'>
        <div className="margins-container whitecard">
          <Typography variant="h5" sx={{ margin: '0' }}>Cashflow of {timePeriod}</Typography>
          <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
            <div className="margins">
              <Sales period={period} year={year} />
              <Gross period={period} year={year} />
              <Operating period={period} year={year} />
            </div>
            <div className="waterfall-div">
              {/* <Waterfall period={period} year={year} /> */}
            </div>
          </div>
        </div>
        <div className="liquidity-container whitecard">
           <div className='whitecard-appbar'>
             <div className='whitecard-label'><i>Liquidity</i></div>
           </div>
           <div className='liq-caps-and-gauges'>
             <div className='liq-caps'>
               <Typography variant="subtitle2" sx={{ color: '#212121'}}>Current Ratio</Typography>
               <Typography variant="subtitle2" sx={{ color: '#212121'}}>Quick Ratio</Typography>
               <Typography variant="subtitle2" sx={{ color: '#212121'}}>Working Capital</Typography>
             </div>
             <div className='liquidity-gauges'>
               <Current />
               <Quick />
               <Capital />
             </div>
           </div>
         </div>

      </div>
      <div className='right-finance'>
        <div className='profitability whitecard'>
          <div className='whitecard-appbar'>
            <div className='whitecard-label'><i>Profitability</i></div>
          </div>
          <ROS />
        </div>
        <div className='debt whitecard'>
          <div className='whitecard-appbar'>
            <div className='whitecard-label'><i>Leverage</i></div>
          </div>
          <Debt />
        </div>
        <div className="efficiency-container whitecard">
          <div className='whitecard-appbar'>
            <div className='whitecard-label'><i>Efficiency</i></div>
          </div>
          <div className='efficiency-gauges'>
            <AssetTurnover />
            <InventoryTurnover />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Financial_Health_View
