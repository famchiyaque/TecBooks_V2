import React from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'

function Games() {
  const { user } = useAuth()

  return (
    <div>Games</div>
  )
}

export default Games