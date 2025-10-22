import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

function Inbox() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState()

  // should make call to backend at /professor-panel/get-notifications
  // should send userId in params
  // should get up to last 15 notifications, or all that are new (haven't been seen)
  // should populate the notifications 

  // const handleReadEvent = () => {

  // }

  // useEffect(() => {
  //   try {

  //   } catch (e) {

  //   } finally {
  //     setIsLoading()
  //   }
  // }, [])

  return (
    <div className='w-full h-full m-auto'>
      <Typography variant='h2'>Inbox</Typography>
      <Typography variant='h4'>Coming Soon</Typography>
    </div>
  )
}

export default Inbox