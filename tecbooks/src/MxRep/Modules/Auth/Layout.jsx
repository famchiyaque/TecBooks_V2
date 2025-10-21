import { Outlet, useLocation } from 'react-router-dom'
import GenericHeader from '@/Global Components/GenericHeader'
import GenericSubheader from "@/Global Components/GenericSubheader"
import React from 'react'
// import SubHeader from './SubHeader'
// import Loader from './Loader'

function Layout() {
  const location = useLocation()

  const getSubpage = () => {
    const splitPath = location.pathname.split('/')
    const subPage = splitPath[splitPath.length - 1]

    switch (subPage) {
      case "sign-in": return "Sign In"
      case "forgot-password": return "Forgot Password"
      case "reset-password": return "Reset Password"
      default: return "Auth"
    }
  }

    return (
        <>
            <GenericHeader pageName={"Auth"} />
            <GenericSubheader simName={getSubpage()} />

            <div className='w-full h-screen text-center'>
              <div className='w-[50%] min-h-[calc(100vh-140px)] m-auto flex flex-col justify-center items-center'>
                <Outlet />
              </div>
            </div>    
        </>
    );
}
// }

export default Layout