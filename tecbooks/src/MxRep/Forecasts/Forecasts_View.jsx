import '../../styles/forecasts.css'
import { React, useEffect, useState } from 'react'
import { useSimData } from "../SimDataContext"
import Typography from '@mui/material/Typography'
import Methods from './Options/Methods'
import TimeLine from './Options/TimeLine'
import Graph from './Graph'
// import HelpIcon from '@mui/icons-material/Help'
// import Tooltip from '../Novus Components/Tooltip'
import Loader from '../Novus Components/Loader'
import Cast from './Leaderboard/Cast'
import { useNavigate } from 'react-router-dom'
import { getData, getXLabel, getXCategories, getCastTotals } from './Calcs/Forecasting'
import Inputs from './Options/Inputs'
import DataType from './Options/DataType'

function Forecasts_View() {
    const { simData, isLoading, error } = useSimData()
    const navigate = useNavigate()

    const [activeForecasts, setActiveForecasts] = useState([1])
    const [past, setPast] = useState(1)
    const [future, setFuture] = useState(1)
    const [interval, setIntervals] = useState('daily')
    const [smoothing, setSmoothing] = useState(4)
    const [alpha, setAlpha] = useState(0.5)
    const [dataType, setDataType] = useState('sales')

    const [graphTitle, setGraphTitle] = useState("Graph Title")
    const [xTitle, setXTitle] = useState("")
    const [xAxis, setXAxis] = useState([])
    const [seriesData, setSeriesData] = useState([{name: "", data: []}])
    const [castTotals, setCastTotals] = useState([["", 0], ["", 1]])

    const pastChange = (event, value) => { setPast(value) }
    const futureChange = (event, value) => { setFuture(value) }
    const intervalChange = (value) => { setIntervals(value) }
    const smoothingChange = (value) => { setSmoothing(value) }
    const alphaChange = (value) => { setAlpha(value) }
    const changeDataType = (value) => { setDataType(value) }

    const futures = ["", "This Month", "Next 6 Months", "Rest of Year", "Next Year"]

    useEffect(() =>  {
        if (simData) {
            setGraphTitle(futures[future])
            setXTitle(getXLabel(past, future, simData.startDate))
            setXAxis(getXCategories(past, future, simData.startDate, interval))
    
            const newData = getData(past, future, activeForecasts, simData.ordersData, simData.startDate, interval, smoothing, dataType, alpha)
            setSeriesData(newData)
        }
    }, [past, future, activeForecasts, simData, interval, smoothing, dataType, alpha])

    useEffect(() => {
        const newCastTotals = getCastTotals(seriesData, dataType)
        setCastTotals(newCastTotals)
    }, [seriesData])

    const isActive = (value) => activeForecasts.includes(value)

    const handleCastChange = (event) => {
        const value = parseInt(event.target.value, 10)
        let newActiveForecasts

        if (activeForecasts.includes(value)) {
            newActiveForecasts = activeForecasts.filter((element) => element !== value)
        } else {
            newActiveForecasts = [...activeForecasts, value]
        }
        setActiveForecasts(newActiveForecasts)
    }

    if (error) navigate('/novus-dashboard')
    if (isLoading) return <Loader />

    return (
        <div>
            <Methods isActive={isActive} handleCastChange={handleCastChange} />

            <div className='forecast-graph-section'>
                <div className='graph-part'>
                    <div className='graph-and-options-div'>
                        <TimeLine past={past} future={future} pastChange={pastChange} futureChange={futureChange} />
                        <div className='main-graph-div'>
                            <Inputs
                                interval={interval} past={past} future={future} intervalChange={intervalChange}
                                smoothing={smoothing} smoothingChange={smoothingChange}
                                alpha={alpha} alphaChange={alphaChange} activeForecasts={activeForecasts}
                            />
                            <div className='main-graph whitecard-b'>
                                <Graph dataType={dataType} graphTitle={graphTitle}
                                    xTitle={xTitle} xAxis={xAxis} seriesData={seriesData}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='info-part'>
                    <div className='data-types-container whitecard-b'>
                        <DataType dataType={dataType} changeDataType={changeDataType} />
                    </div>
                    <div className='leaderboard-container whitecard-b'>
                        <Typography variant="h6">Forecast Leaderboard</Typography>
                        <div className='leaderboard-div'>
                            <div className='leaderboard-columns'>
                                <Typography variant="subtitle1">Method</Typography>
                                <Typography variant='subtitle1'>Volume</Typography>
                            </div>
                            <div className='leaderboard-flex'>
                                {castTotals.map(pair => {
                                    return <Cast title={pair[0]} total={pair[1]} color={pair[2]} /> 
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forecasts_View