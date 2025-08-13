import React, { useState, useEffect } from 'react'
import Gauge from '../../Novus Components/Gauge'
import { useSimData } from '../../SimDataContext'
import Loader from '../../Novus Components/Loader'
import { useNavigate } from 'react-router-dom'
import { getOee } from '../Calcs/kpi-calcs'

function OEE() {
  const { simData, isLoading, error } = useSimData()
  const navigate = useNavigate()
  const [oee, setOee] = useState(0)

  // Handle navigation if error or simData is missing
  useEffect(() => {
    if (error) {
      navigate('/error')
    } else if (!simData && !isLoading) {
      // Only navigate if simData is missing and data is not loading
      navigate('/production-line')
    }

    const newOee = getOee(simData)
    setOee(newOee)

  }, [simData, error, isLoading, navigate])

  // If data is still loading, show the loader
  if (isLoading) return <Loader />

  // If simData is missing (edge case), return null (shouldn't happen due to navigation)
  if (!simData) return null

  // Safely calculate OEE when simData is ready
  // const oee =
  //   simData?.availability &&
  //   simData?.performance &&
  //   simData?.quality
  //     ? ((simData.availability + simData.performance + simData.quality) / 3).toFixed(0)
  //     : 0; // Fallback value

  return (
    <div className="whitecard oee-inner">
      <div className='whitecard-label' 
        style={{ paddingBottom: '0.5rem', width: '95%', textAlign: 'left', margin: '0 auto' }}>
        <i>Overall Equipment Efficiency</i>
      </div>
      
      <Gauge percentage={oee} size={120} metric={"oee"} />
      {/* <Typography variant="subtitle2">OEE</Typography> */}
    </div>
  )
}

export default OEE
