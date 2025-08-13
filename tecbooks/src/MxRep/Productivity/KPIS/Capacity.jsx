import React, { useEffect } from 'react'
import { useSimData } from '../../SimDataContext'
import { Typography } from '@mui/material'
import Gauge from '../../Novus Components/Gauge'
import Loader from '../../Novus Components/Loader'
import { useNavigate } from 'react-router-dom'
import ReadMoreIcon from '@mui/icons-material/ReadMore'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

function Capacity() {
    const { simData, isLoading, error } = useSimData()
    const navigate = useNavigate()

    const capacity = 94

    useEffect(() => {
        if (error) navigate('/error')
        if (!simData) navigate('/production-line')
      }, [simData, error, navigate])

    if (isLoading) return <Loader />

    const style = {
      py: 0,
      width: '99%',
      // maxWidth: 360,
      // borderRadius: 2,
      // border: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }

  return (
    <div className='whitecard secondary'>
      <div className='whitecard-appbar'>
        <div className='whitecard-label'><i>Capacity</i></div>
        {/* <div className='whitecard-link'>
          <a to="/oee-metrics"><ReadMoreIcon /></a>
        </div> */}
      </div>

      <div className='two-child'>
        <Gauge percentage={simData.capacity} size={120} />
      </div>

      <List sx={style}>
        <ListItem>
          <div className='cap-info-flex'>
            <Typography variant="subtitle2">Max Capacity</Typography>
            <Typography variant="subtitle2">1120</Typography>
          </div>
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <div className='cap-info-flex'>
            <Typography variant="subtitle2">Quality</Typography>
            <div>
              <Typography variant="subtitle2" sx={{ display: 'inline-block' }}>{capacity}</Typography>%
            </div>
          </div>
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <div className='cap-info-flex'>
            <Typography variant="subtitle2">Work Orders</Typography>
            <Typography variant="subtitle2">1260</Typography>
          </div>
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <div className='cap-info-flex'>
            <Typography variant="subtitle2">Customer Orders</Typography>
            <Typography variant="subtitle2">1260</Typography>
          </div>
        </ListItem>
        <Divider component="li" />
      </List>
    </div>
  )
}

export default Capacity