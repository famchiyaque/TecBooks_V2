import React from 'react'
import Loader from '@/Global Components/Loader'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'

function Logout() {
    const { logout } = useAuth()

    logout()

    return <Loader message={"Logging out..."} />
}

export default Logout