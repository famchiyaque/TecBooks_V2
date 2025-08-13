import React, { useState, useEffect } from 'react'
import { useSimData } from '../../SimDataContext'
import { Typography } from '@mui/material'
import Gauge from '../../Novus Components/Gauge'
import { useNavigate } from 'react-router-dom'
import Loader from '../../Novus Components/Loader'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { getKPIData } from '../Calcs/kpi-calcs'
// import ReadMoreIcon from '@mui/icons-material/ReadMore';
import KPISelect from './KPISelect'
import InputLabel from '@mui/material/InputLabel'


function PrimaryKPIs({ period, year }) {
    const { simData, isLoading, error } = useSimData()
    const navigate = useNavigate()

    const [data, setData] = useState({})

    const [process, setProcess] = useState(1)
    const handleProcess = (event, value) => {
      console.log(value)
      const newValue = parseInt(event.target.value)
      console.log("value after parse: ", newValue)
      setProcess(newValue)
    }

    useEffect(() => {
      if (error) navigate('/error')
      if (!simData) navigate('/production-line')

      const newData = getKPIData(simData, process, period, year)
      setData(newData)

    }, [simData, error, navigate, process, period, year])

    const HtmlTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} placement='right' />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        // backgroundColor: '#f5f5f9',
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        // color: 'white',
        // maxWidth: 150,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        marginLeft: '0'
      },
    }))

    if (isLoading) return <Loader />

  return (
    <div className='whitecard kpi-gauges'>
      <div className='whitecard-appbar'>
        <div className='whitecard-label'><i>Efficiency Metrics</i></div>
        <div className='whitecard-input-group'>
          <div className='whitecard-input-label'>
            <Typography variant="subtitle1">Process:</Typography>
          </div>
          <div className='whitecard-link'>
            <KPISelect process={process} handleProcess={handleProcess} /> 
          </div>
        </div>
      </div>
        {/* <Typography variant="h5">Operational Efficiency</Typography> */}
        
        <div className='OEE-three'>
            <div className='oee-child'>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <em><b>{"How Often Does It Work"}</b></em> <br></br>
                      {`Total Up Time: ${data.uptime} hrs` } <br></br>
                      {`Total Running Time: ${data.runningtime} hrs` } <br></br> <br></br>
                    </React.Fragment>
                  }
                >
                  <div style={{ cursor: 'pointer' }}>
                    <Gauge percentage={data.availability} size={120} metric={"availability"} />
                  </div>
                  
                </HtmlTooltip>
                <Typography variant="subtitle2" sx={{ color: '#212121', marginTop: '0', paddingTop: '0'}}>Availability</Typography>
            </div>

            <div className='oee-child'>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <em><b>{"Output during Uptime"}</b></em> <br></br>
                      {`Output: ${data.actualOutput} u/hr` } <br></br>
                      {`Ideal Output: ${data.idealOutput} u/hr` }
                    </React.Fragment>
                  }
                >
                  <div style={{ cursor: 'pointer' }}>
                    <Gauge percentage={data.performance} size={120} metric={"performance"} />
                  </div>
                  
                </HtmlTooltip>
                <Typography variant="subtitle2" sx={{ color: '#212121'}}>Performance</Typography>
            </div>

            <div className='oee-child'>
              <HtmlTooltip
                  title={
                    <React.Fragment>
                      <em><b>{"Usable Parts"}</b></em> <br></br>
                      {`Good Parts Made: ${data.goodParts}` } <br></br>
                      {`Total Parts Made: ${data.totalParts}` }
                    </React.Fragment>
                  }
                >
                  <div style={{ cursor: 'pointer' }}>
                    <Gauge percentage={data.quality} size={120} metric={"quality"} />
                  </div>
                  
                </HtmlTooltip>
                <Typography variant="subtitle2" sx={{ color: '#212121'}}>Quality</Typography>
            </div>

            <div className='oee-child' style={{ borderLeft: 'solid lightgray 1px', minWidth: '120px' }}>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      {`Total Down Time: ${data.unitsProduced}` } <br></br>
                      {`Total Running Time: ${data.laborHours}` } <br></br> <br></br>
                      {"Click on 'more' to see more"}
                    </React.Fragment>
                  }
                >
                  {/* <Gauge percentage={data.productivity} size={120} /> */}
                  <Typography variant="h4" sx={{ display: 'inline'}} gutterBottom>{data.productivity}</Typography>
                  <p style={{ display: 'inline' }}>u/hr</p>
                </HtmlTooltip>
                <Typography className='prod-subtitle' variant="subtitle2" sx={{ color: '#212121'}}>Productivity</Typography>
            </div>

        </div>
    </div>
  )
}

export default PrimaryKPIs