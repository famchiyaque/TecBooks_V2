import React, { useEffect } from 'react'
import Loader from '@/Global Components/Loader'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'

function Logout() {
    console.log("[LOGUT COMP]")
    const { logout } = useAuth()

    useEffect(() => {
        logout()
    }, [logout])

    return (
        <div className='w-full h-screen m-auto'>
            <Loader message={"Logging out..."} />
        </div>
    )
}

export default Logout