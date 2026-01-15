import '@/styles/overview.css'
import { React, useEffect, useState } from 'react'
// import { useSimData } from '../SimDataContext'
import Loader from '../Comps//Loader'
import { Navigate } from 'react-router-dom'
import Capital from './Small/Capital'
import Sales from './Small/Sales'
import Profit from './Small/Profit'
import Orders from './Middle/Orders'
import SalesDonut from './Middle/SalesDonut'
import { useOutletContext } from 'react-router-dom'
// import { SimContext } from './SimContext'
import { useExcel } from '../Comps/ExcelContext'


function Overview_View() {
    const { loading } = useExcel()
    const { period } = useOutletContext()
    // console.log(period)

    if (loading) return <Loader />

    // const totalSales = overviewData.total.reduce((prev, curr) => prev + curr, 0)
    // if (simData == null || error == true) return <Navigate to="/error" /> 

    return (
        <div className='overview-view'>
            <div className='top-row'>
                {/* <LeaderBoard /> */}
                {/* <Capital /> */}
                <div className='whitecard top-box'>
                    <Sales period={period} />
                </div>
                <div className='whitecard top-box'>
                    <Profit period={period} />
                </div>
                <div className='whitecard top-box'>
                    <Capital period={period} />
                </div>
            </div>
            <div className='middle-row'>
                <div className='whitecard sales-div'>
                    <SalesDonut />
                </div>
                <div className='whitecard orders-div'>
                    <Orders />
                </div>
            </div>
        </div>
    )
}

export default Overview_View