import '../../styles/overview.css'
import { React, useEffect, useState } from 'react'
import { useSimData } from '../SimDataContext'
import Loader from '../Novus Components/Loader'
import { Navigate } from 'react-router-dom'
import Capital from './Small/Capital'
import Sales from './Small/Sales'
import LeaderBoard from './Small/LeaderBoard'
import Orders from './Middle/Orders'
import SalesDonut from './Middle/SalesDonut'
import { useOutletContext } from 'react-router-dom'
// import { SimContext } from './SimContext'


function Overview_View() {
    const { simData, isLoading, error } = useSimData()
    const { period, year } = useOutletContext()

    if (isLoading) return <Loader />
    if (simData == null || error == true) return <Navigate to="/error" /> 

    return (
        <div className='overview-view'>
            <div className='top-row'>
                {/* <LeaderBoard /> */}
                {/* <Capital /> */}
                <div className='whitecard top-box'>
                    <LeaderBoard />
                </div>
                <div className='whitecard top-box'>
                    <Sales />
                </div>
                <div className='whitecard top-box'>
                    <Capital />
                </div>
            </div>
            <div className='middle-row'>
                <div className='whitecard sales-div'>
                    <SalesDonut period={period} year={year} />
                </div>
                <div className='whitecard orders-div'>
                    <Orders period={period} year={year} />
                </div>
            </div>
        </div>
    )
}

export default Overview_View