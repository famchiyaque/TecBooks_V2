import React from 'react'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'

function Logout() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    logout()

    return <Loader message={"Logging out..."} />

//   return (
//     <div>
//         Logout
//     </div>
//   )
}

export default Logout