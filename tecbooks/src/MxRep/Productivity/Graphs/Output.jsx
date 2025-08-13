import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSimData } from '../../SimDataContext'
import { getXTimeline, getOutputData } from '../Calcs/outputData'
import Loader from '../../Novus Components/Loader'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'

function Output({ period, year }) {
    const { simData, isLoading, error } = useSimData()
    const navigate = useNavigate()

    const [xTimeline, setXTimeline] = useState('')
    const [seriesData, setSeriesData] = useState([])

    // Handle navigation for error or missing simData
    useEffect(() => {
        if (error) {
            navigate('/error')
        } else if (!simData && !isLoading) {
            navigate('/production-line')
        }
    }, [simData, error, isLoading, navigate])

    // Update timeline and series data when inputs change
    useEffect(() => {
        if (simData && simData.actualOutputData) {
            const newTimeline = getXTimeline(period, year)
            setXTimeline(newTimeline)

            const newData = getOutputData(period, year, simData.actualOutputData)
            setSeriesData(newData)
        }
    }, [period, year, simData])

//     console.log("right before options")
//     console.log("xTimeline:", xTimeline)
// console.log("seriesData:", seriesData)

    // Highcharts options
    const options = {
        chart: {
            type: 'line',
            height: '55%'
        },
        title: {
            text: 'Actual Output vs Theoretical Output',
            style: { fontSize: '16px', color: 'gray' }
        },
        xAxis: {
            title: {
                text: xTimeline,
            },
        },
        yAxis: {
            title: {
                text: 'Units/Hour',
            },
        },
        series: seriesData,
    }

    // Render loader while data is loading
    if (isLoading) return <Loader />

    // Prevent rendering if simData is missing
    if (!simData) return null

    // console.log("right before render of chart")
    // console.log()
    // console.log(seriesData)

    return (
        <div style={{ width: '100%' }}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}

export default Output
